// src/lib/studentService.ts
"use server"; 

import type { Student, AttendanceRecord, SurveyResponse } from './types';
import { db } from './firebaseConfig'; // Importa a instância do Firestore
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
// localStorageUtils não será mais usado aqui quando tudo estiver no Firestore
// import { getStudentsFromLocalStorage, saveStudentsToLocalStorage } from './localStorageUtils';


// Helper para converter dados do Firestore para o tipo Student, tratando Timestamps e campos ausentes
function mapDocToStudent(docSnap: import("firebase/firestore").DocumentSnapshot): Student {
  const data = docSnap.data();
  if (!data) {
    console.error(`[mapDocToStudent] Document data is undefined for mapping! Doc ID: ${docSnap.id}`);
    // Retorna um objeto Student parcialmente preenchido ou lança um erro mais específico.
    // Preenche com o máximo de defaults para evitar quebrar a UI.
    return {
        id: docSnap.id,
        name: "Erro: Nome Indisp.",
        email: "Erro: Email Indisp.",
        membershipType: "Basico",
        joinDate: new Date().toISOString().split('T')[0],
        attendance: [],
        missedClassesCount: 0,
        phone: "",
        dateOfBirth: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        profilePictureUrl: "",
        latestSurveyResponse: undefined, // Será null se não existir no Firestore
        genderIdentity: "nao_informado",
        maritalStatus: "nao_informado",
        hasChildren: "nao_informado",
        occupation: "",
        monthlyIncome: "nao_informado",
        educationLevel: "nao_informado",
        likesWinter: "nao_informado",
        bestTrainingTime: "nao_informado",
        daysPerWeek: "",
        workSchedule: "nao_informado",
        commuteTime: "",
        mainGoal: "nao_informado",
        otherGoalDetail: "",
        attendedGymBefore: "nao_informado",
        previousGymDuration: "",
        reasonForLeavingPreviousGym: "",
        trainingDifficulties: "",
        medicalRestrictions: "nao_informado",
        medicalRestrictionsDetail: "",
        professionalFollowUp: "nao_informado",
        currentHealthStatus: "nao_informado",
        motivationSource: "",
        potentialQuitFactors: "",
        wantsFollowUpApp: "nao_informado",
        contractPlan: "nao_informado",
        paymentMethod: "nao_informado",
    } as Student; // Afirmação de tipo para satisfazer o compilador com os defaults
  }
  
  const convertTimestampToString = (timestampField: any, fieldName: string): string => {
    // Função interna para logs mais detalhados
    const logPrefix = `[mapDocToStudent Field: ${fieldName}, DocID: ${docSnap.id}]`;

    if (!timestampField) {
        // Se o campo não existir ou for null/undefined, retorna uma string vazia ou uma data padrão.
        // Para joinDate, uma data padrão é melhor. Para dateOfBirth, talvez string vazia.
        if (fieldName === 'joinDate') return new Date().toISOString().split('T')[0];
        return ""; 
    }
    if (timestampField instanceof Timestamp) {
      return timestampField.toDate().toISOString().split('T')[0]; // Pega apenas YYYY-MM-DD
    }
    if (typeof timestampField === 'string') {
      try {
        const dateObj = new Date(timestampField);
        if (!isNaN(dateObj.getTime())) {
            // Se for uma string de data completa (com T), pegue apenas a parte da data
            return dateObj.toISOString().split('T')[0];
        }
        // Se já for YYYY-MM-DD, retorne como está
        if (/^\d{4}-\d{2}-\d{2}$/.test(timestampField)) {
            return timestampField;
        }
        console.warn(`${logPrefix} String de data não reconhecida ou em formato inesperado: ${timestampField}. Retornando original.`);
        return timestampField; 
      } catch (e) {
        console.warn(`${logPrefix} Não foi possível converter a string de data: ${timestampField}`, e);
        return timestampField; 
      }
    }
    if (typeof timestampField === 'object' && timestampField.seconds !== undefined && timestampField.nanoseconds !== undefined) {
        try {
            const dateFromObject = new Timestamp(timestampField.seconds, timestampField.nanoseconds).toDate();
            return dateFromObject.toISOString().split('T')[0];
        } catch (e) {
            console.warn(`${logPrefix} Não foi possível converter objeto de timestamp:`, timestampField, e);
            return fieldName === 'joinDate' ? new Date().toISOString().split('T')[0] : "";
        }
    }
    console.warn(`${logPrefix} Campo de timestamp não é Timestamp nem string válida: ${String(timestampField)}. Retornando default.`);
    return fieldName === 'joinDate' ? new Date().toISOString().split('T')[0] : "";
  };

  const mapAttendance = (attendanceArray: any): AttendanceRecord[] => {
    if (!Array.isArray(attendanceArray)) return [];
    return attendanceArray.map((att: any) => {
      let dateStr = att.date;
      if (att.date instanceof Timestamp) {
        dateStr = att.date.toDate().toISOString().split('T')[0];
      } else if (typeof att.date === 'string') {
         dateStr = att.date.includes('T') ? att.date.split('T')[0] : att.date;
         if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            console.warn(`[mapDocToStudent DocID: ${docSnap.id}] Formato de data de frequência inválido: ${dateStr}. Usando data atual.`);
            dateStr = new Date().toISOString().split('T')[0];
         }
      } else {
        console.warn(`[mapDocToStudent DocID: ${docSnap.id}] Data de frequência inválida (tipo): ${String(att.date)}. Usando data atual.`);
        dateStr = new Date().toISOString().split('T')[0];
      }
      return {
        date: dateStr,
        attended: typeof att.attended === 'boolean' ? att.attended : false,
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  const studentData: Student = {
    id: docSnap.id,
    name: data.name || "Nome Indisponível",
    email: data.email || "Email Indisponível",
    phone: data.phone || "",
    dateOfBirth: convertTimestampToString(data.dateOfBirth, 'dateOfBirth'),
    emergencyContactName: data.emergencyContactName || "",
    emergencyContactPhone: data.emergencyContactPhone || "",
    membershipType: data.membershipType || "Basico",
    joinDate: convertTimestampToString(data.joinDate, 'joinDate'),
    profilePictureUrl: data.profilePictureUrl || "", // Default se não houver
    attendance: mapAttendance(data.attendance),
    missedClassesCount: typeof data.missedClassesCount === 'number' ? data.missedClassesCount : 0,
    latestSurveyResponse: data.latestSurveyResponse ? {
      surveyId: data.latestSurveyResponse.surveyId || "",
      studentId: data.latestSurveyResponse.studentId || docSnap.id,
      submittedAt: convertTimestampToString(data.latestSurveyResponse.submittedAt, 'latestSurveyResponse.submittedAt'),
      answers: Array.isArray(data.latestSurveyResponse.answers) ? data.latestSurveyResponse.answers : [],
    } : undefined, // undefined se não houver
    genderIdentity: data.genderIdentity || "nao_informado",
    maritalStatus: data.maritalStatus || "nao_informado",
    hasChildren: data.hasChildren || "nao_informado",
    occupation: data.occupation || "",
    monthlyIncome: data.monthlyIncome || "nao_informado",
    educationLevel: data.educationLevel || "nao_informado",
    likesWinter: data.likesWinter || "nao_informado",
    bestTrainingTime: data.bestTrainingTime || "nao_informado",
    daysPerWeek: data.daysPerWeek || "",
    workSchedule: data.workSchedule || "nao_informado",
    commuteTime: data.commuteTime || "",
    mainGoal: data.mainGoal || "nao_informado",
    otherGoalDetail: data.otherGoalDetail || "",
    attendedGymBefore: data.attendedGymBefore || "nao_informado",
    previousGymDuration: data.previousGymDuration || "",
    reasonForLeavingPreviousGym: data.reasonForLeavingPreviousGym || "",
    trainingDifficulties: data.trainingDifficulties || "",
    medicalRestrictions: data.medicalRestrictions || "nao_informado",
    medicalRestrictionsDetail: data.medicalRestrictionsDetail || "",
    professionalFollowUp: data.professionalFollowUp || "nao_informado",
    currentHealthStatus: data.currentHealthStatus || "nao_informado",
    motivationSource: data.motivationSource || "",
    potentialQuitFactors: data.potentialQuitFactors || "",
    wantsFollowUpApp: data.wantsFollowUpApp || "nao_informado",
    contractPlan: data.contractPlan || "nao_informado",
    paymentMethod: data.paymentMethod || "nao_informado",
  };
  return studentData;
}

// --- Funções que interagem com o Firestore ---

export async function getStudents(): Promise<Student[]> {
  console.log("[StudentService-Firestore] getStudents: Buscando alunos do Firestore");
  try {
    const studentsCollection = collection(db, "students");
    const q = query(studentsCollection, orderBy("joinDate", "desc"));
    const querySnapshot = await getDocs(q);
    
    const students = querySnapshot.docs.map(mapDocToStudent);
    console.log("[StudentService-Firestore] Alunos buscados do Firestore:", students.length);
    return students;
  } catch (error) {
    console.error("[StudentService-Firestore] Erro CRÍTICO ao buscar alunos do Firestore:", error);
    return []; 
  }
}

export async function addStudent(
  newStudentData: Omit<Student, 'id' | 'attendance' | 'missedClassesCount' | 'profilePictureUrl'>
): Promise<Student> {
  console.log("[StudentService-Firestore] addStudent: Adicionando ao Firestore:", JSON.stringify(newStudentData, null, 2));
  try {
    // Prepara o objeto para salvar, convertendo 'undefined' para 'null' ou valores padrão
    const studentToSave: Omit<Student, 'id'> = {
      name: newStudentData.name || "Nome não fornecido",
      email: newStudentData.email || "email@naofornecido.com",
      joinDate: newStudentData.joinDate || new Date().toISOString().split('T')[0],
      membershipType: newStudentData.membershipType || "Basico",
      
      phone: newStudentData.phone || null,
      dateOfBirth: newStudentData.dateOfBirth || null,
      emergencyContactName: newStudentData.emergencyContactName || null,
      emergencyContactPhone: newStudentData.emergencyContactPhone || null,
      
      profilePictureUrl: 'https://placehold.co/100x100.png', 
      attendance: [], 
      missedClassesCount: 0, 
      latestSurveyResponse: newStudentData.latestSurveyResponse === undefined ? null : {
        ...newStudentData.latestSurveyResponse,
        submittedAt: newStudentData.latestSurveyResponse.submittedAt || new Date().toISOString(),
        answers: newStudentData.latestSurveyResponse.answers || [],
      },
      
      genderIdentity: newStudentData.genderIdentity || "nao_informado",
      maritalStatus: newStudentData.maritalStatus || "nao_informado",
      hasChildren: newStudentData.hasChildren || "nao_informado",
      occupation: newStudentData.occupation || null,
      monthlyIncome: newStudentData.monthlyIncome || "nao_informado",
      educationLevel: newStudentData.educationLevel || "nao_informado",
      likesWinter: newStudentData.likesWinter || "nao_informado",
      bestTrainingTime: newStudentData.bestTrainingTime || "nao_informado",
      daysPerWeek: newStudentData.daysPerWeek || null,
      workSchedule: newStudentData.workSchedule || "nao_informado",
      commuteTime: newStudentData.commuteTime || null,
      mainGoal: newStudentData.mainGoal || "nao_informado",
      otherGoalDetail: newStudentData.otherGoalDetail || null,
      attendedGymBefore: newStudentData.attendedGymBefore || "nao_informado",
      previousGymDuration: newStudentData.previousGymDuration || null,
      reasonForLeavingPreviousGym: newStudentData.reasonForLeavingPreviousGym || null,
      trainingDifficulties: newStudentData.trainingDifficulties || null,
      medicalRestrictions: newStudentData.medicalRestrictions || "nao_informado",
      medicalRestrictionsDetail: newStudentData.medicalRestrictionsDetail || null,
      professionalFollowUp: newStudentData.professionalFollowUp || "nao_informado",
      currentHealthStatus: newStudentData.currentHealthStatus || "nao_informado",
      motivationSource: newStudentData.motivationSource || null,
      potentialQuitFactors: newStudentData.potentialQuitFactors || null,
      wantsFollowUpApp: newStudentData.wantsFollowUpApp || "nao_informado",
      contractPlan: newStudentData.contractPlan || "nao_informado",
      paymentMethod: newStudentData.paymentMethod || "nao_informado",
    };
    
    // Firestore não aceita chaves com valor 'undefined'. O objeto acima já trata isso.
    const docRef = await addDoc(collection(db, "students"), studentToSave);
    console.log("[StudentService-Firestore] Aluno adicionado ao Firestore com ID: ", docRef.id);
    
    // Retorna o aluno completo, incluindo o ID gerado e os defaults aplicados.
    return { id: docRef.id, ...studentToSave } as Student;
  } catch (error) {
    console.error("[StudentService-Firestore] Erro CRÍTICO ao adicionar aluno no Firestore:", error);
    throw error; // Relança o erro para ser tratado pelo chamador (ex: AddStudentDialog)
  }
}


export async function getStudentById(id: string): Promise<Student | undefined> {
  console.log(`[StudentService-Firestore] getStudentById para ID: ${id}`);
  if (!id) {
    console.error("[StudentService-Firestore] getStudentById chamado com ID indefinido ou vazio.");
    return undefined;
  }
  try {
    const studentDocRef = doc(db, "students", id);
    const docSnap = await getDoc(studentDocRef);

    if (docSnap.exists()) {
      console.log(`[StudentService-Firestore] Aluno ${id} encontrado no Firestore.`);
      return mapDocToStudent(docSnap);
    } else {
      console.warn(`[StudentService-Firestore] Aluno com ID ${id} não encontrado no Firestore.`);
      return undefined;
    }
  } catch (error) {
    console.error(`[StudentService-Firestore] Erro CRÍTICO ao buscar aluno com ID ${id} do Firestore:`, error);
    return undefined; 
  }
}

export async function updateStudent(id: string, updatedData: Partial<Omit<Student, 'id'>>): Promise<Student | undefined> {
  console.log(`[StudentService-Firestore] updateStudent chamado para ID: ${id}. Dados para atualizar:`, JSON.stringify(updatedData, null, 2));
  if (!id) {
    console.error("[StudentService-Firestore] updateStudent chamado sem ID.");
    return undefined;
  }
  try {
    const studentDocRef = doc(db, "students", id);

    // Verificar se o aluno existe antes de tentar atualizar
    const docSnapBeforeUpdate = await getDoc(studentDocRef);
    if (!docSnapBeforeUpdate.exists()) {
      console.error(`[StudentService-Firestore] updateStudent ERRO: Aluno com ID ${id} NÃO ENCONTRADO para atualização.`);
      return undefined; 
    }
    console.log(`[StudentService-Firestore] updateStudent: Aluno ${id} encontrado ANTES da atualização.`);
    
    // Prepara os dados para o Firestore, convertendo 'undefined' para 'null'
    // e tratando Timestamps se necessário (embora updateDoc lide bem com strings ISO para datas existentes).
    const dataToUpdateForFirestore: { [key: string]: any } = {};
    for (const key in updatedData) {
      if (Object.prototype.hasOwnProperty.call(updatedData, key)) {
        const value = (updatedData as any)[key];
        
        if (value === undefined) {
          dataToUpdateForFirestore[key] = null; // Converte undefined para null
        } else if (key === 'latestSurveyResponse' && value && typeof value.submittedAt === 'string') {
          // Se 'submittedAt' for uma string, tentamos converter para Timestamp
          // Embora o Firestore também aceite strings ISO para campos de data.
          // Se já for Timestamp, está ok. Se for null, também ok.
           dataToUpdateForFirestore[key] = {
             ...value,
             submittedAt: Timestamp.fromDate(new Date(value.submittedAt)) // Garante que seja Timestamp
           };
        } else if ((key === 'joinDate' || key === 'dateOfBirth') && typeof value === 'string' && value) {
            // Para datas no formato YYYY-MM-DD, podemos salvar como string.
            // Ou converter para Timestamp: dataToUpdateForFirestore[key] = Timestamp.fromDate(new Date(value + "T00:00:00Z"));
            dataToUpdateForFirestore[key] = value;
        } else {
          dataToUpdateForFirestore[key] = value;
        }
      }
    }
    
    if (Object.keys(dataToUpdateForFirestore).length === 0) {
      console.warn("[StudentService-Firestore] updateStudent: Nenhum dado válido fornecido para atualização. Retornando aluno atual.");
      return mapDocToStudent(docSnapBeforeUpdate); 
    }

    console.log(`[StudentService-Firestore] updateStudent: Dados que serão enviados para updateDoc para o aluno ${id}:`, JSON.stringify(dataToUpdateForFirestore, null, 2));
    
    await updateDoc(studentDocRef, dataToUpdateForFirestore);
    console.log(`[StudentService-Firestore] updateStudent: Aluno com ID ${id} atualizado com sucesso no Firestore.`);
    
    // Busca o documento atualizado para retornar os dados mais recentes
    const updatedDocSnap = await getDoc(studentDocRef);
    if (updatedDocSnap.exists()) {
      console.log(`[StudentService-Firestore] updateStudent: Dados do aluno ${id} APÓS atualização:`, updatedDocSnap.data());
      return mapDocToStudent(updatedDocSnap);
    }
    
    // Isso não deveria acontecer se updateDoc foi bem-sucedido e o doc existia antes.
    console.error(`[StudentService-Firestore] updateStudent ERRO: Documento do aluno com ID ${id} não encontrado APÓS uma atualização supostamente bem-sucedida.`);
    return undefined; // Ou o aluno antes da tentativa de update
  } catch (error) {
    console.error(`[StudentService-Firestore] updateStudent ERRO CRÍTICO ao atualizar aluno com ID ${id} no Firestore:`, error);
    // Tenta retornar o aluno antes da tentativa de atualização se possível
    const studentBeforeError = docSnapBeforeUpdate && docSnapBeforeUpdate.exists() ? mapDocToStudent(docSnapBeforeUpdate) : undefined;
    if (studentBeforeError) {
        console.warn("[StudentService-Firestore] updateStudent: Retornando dados do aluno ANTES do erro de atualização.");
        return studentBeforeError;
    }
    return undefined; 
  }
}

export async function updateStudentSurveyResponse(studentId: string, surveyResponse: SurveyResponse): Promise<Student | undefined> {
  console.log(`[StudentService-Firestore] updateStudentSurveyResponse: Atualizando pesquisa para student ID: ${studentId}`);
  // Garante que submittedAt seja uma string ISO para consistência ou null.
  // O updateStudent irá converter para Timestamp se necessário, mas aqui garantimos o formato de entrada.
  const surveyResponseForUpdate: SurveyResponse = {
    ...surveyResponse,
    submittedAt: surveyResponse.submittedAt ? new Date(surveyResponse.submittedAt).toISOString() : new Date().toISOString(),
  };
  return updateStudent(studentId, { latestSurveyResponse: surveyResponseForUpdate });
}
    

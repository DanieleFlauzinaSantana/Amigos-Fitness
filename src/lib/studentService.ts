
// src/lib/studentService.ts
// Este arquivo NÃO deve usar "use server" se as funções são chamadas pelo cliente.

import type { Student, AttendanceRecord, SurveyResponse } from './types';
import { db } from './firebaseConfig'; 
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

// Helper para converter dados do Firestore para o tipo Student, tratando Timestamps e campos ausentes
function mapDocToStudent(docSnap: import("firebase/firestore").DocumentSnapshot): Student {
  const data = docSnap.data();
  // console.log(`[StudentService-Firestore] mapDocToStudent - Raw data for doc ID ${docSnap.id}:`, JSON.stringify(data, null, 2));

  if (!data) {
    console.error(`[StudentService-Firestore] mapDocToStudent - Document data is undefined for doc ID: ${docSnap.id}. Returning minimal default.`);
    // Retorna um objeto Student mínimo para evitar erros mais abaixo.
    // Idealmente, isso não deveria acontecer se o documento existe.
    return {
        id: docSnap.id,
        name: "Erro: Dados Indisp.",
        email: "erro@indisponivel.com",
        membershipType: "Basico",
        joinDate: new Date().toISOString().split('T')[0],
        attendance: [],
        missedClassesCount: 0,
        profilePictureUrl: "", // Adicionado
        // Preencher outros campos obrigatórios ou opcionais com defaults se necessário
    } as Student;
  }
  
  const convertTimestampToString = (timestampField: any, fieldNameForLog: string): string => {
    const logPrefix = `[StudentService-Firestore mapDocToStudent Field: ${fieldNameForLog}, DocID: ${docSnap.id}]`;
    if (!timestampField) {
        // Para datas de nascimento, uma string vazia é melhor que uma data padrão.
        // Para joinDate, uma data padrão pode ser aceitável se for realmente obrigatório.
        if (fieldNameForLog === 'joinDate') return new Date().toISOString().split('T')[0]; // Data de entrada padrão
        return ""; // Default para outras datas como dateOfBirth
    }
    if (timestampField instanceof Timestamp) {
      return timestampField.toDate().toISOString().split('T')[0];
    }
    if (typeof timestampField === 'string') {
      // Tenta normalizar para YYYY-MM-DD se for uma string de data válida
      try {
        const dateObj = new Date(timestampField);
        if (!isNaN(dateObj.getTime())) { // Verifica se é uma data válida
            return dateObj.toISOString().split('T')[0];
        }
         // Se já estiver no formato YYYY-MM-DD, retorna como está
        if (/^\d{4}-\d{2}-\d{2}$/.test(timestampField)) {
            return timestampField;
        }
        console.warn(`${logPrefix} String de data não reconhecida '${timestampField}'. Retornando original.`);
        return timestampField; // Ou retorna string vazia: return "";
      } catch (e) {
        console.warn(`${logPrefix} Erro ao converter string de data '${timestampField}':`, e, ". Retornando original.");
        return timestampField; // Ou retorna string vazia: return "";
      }
    }
    // Lidar com objetos que são Timestamps serializados (comum de Firestore quando não é Timestamp instance)
    if (typeof timestampField === 'object' && timestampField.seconds !== undefined && timestampField.nanoseconds !== undefined) {
        try {
            const dateFromObject = new Timestamp(timestampField.seconds, timestampField.nanoseconds).toDate();
            return dateFromObject.toISOString().split('T')[0];
        } catch (e) {
            console.warn(`${logPrefix} Erro ao converter objeto de timestamp:`, timestampField, e, ". Retornando default.");
            return fieldNameForLog === 'joinDate' ? new Date().toISOString().split('T')[0] : "";
        }
    }
    console.warn(`${logPrefix} Campo de timestamp não é Timestamp nem string válida: '${String(timestampField)}'. Retornando default.`);
    return fieldNameForLog === 'joinDate' ? new Date().toISOString().split('T')[0] : "";
  };

  const mapAttendance = (attendanceArray: any): AttendanceRecord[] => {
    if (!Array.isArray(attendanceArray)) return [];
    return attendanceArray.map((att: any) => {
      let dateStr = att.date;
      if (att.date instanceof Timestamp) {
        dateStr = att.date.toDate().toISOString().split('T')[0];
      } else if (typeof att.date === 'string') {
         // Normaliza para YYYY-MM-DD
         dateStr = att.date.includes('T') ? att.date.split('T')[0] : att.date;
         if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            console.warn(`[StudentService-Firestore mapDocToStudent DocID: ${docSnap.id}] Formato de data de frequência inválido: '${dateStr}'. Usando data atual.`);
            dateStr = new Date().toISOString().split('T')[0]; // Fallback
         }
      } else if (typeof att.date === 'object' && att.date.seconds !== undefined) { 
        dateStr = new Timestamp(att.date.seconds, att.date.nanoseconds).toDate().toISOString().split('T')[0];
      }
      else {
        console.warn(`[StudentService-Firestore mapDocToStudent DocID: ${docSnap.id}] Data de frequência inválida (tipo): '${String(att.date)}'. Usando data atual.`);
        dateStr = new Date().toISOString().split('T')[0]; // Fallback
      }
      return {
        date: dateStr,
        attended: typeof att.attended === 'boolean' ? att.attended : false,
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordena por data, mais recente primeiro
  };
  
  let latestSurveyResponseMapped: SurveyResponse | undefined = undefined;
  if (data.latestSurveyResponse && typeof data.latestSurveyResponse === 'object') {
    const surveyResponseData = data.latestSurveyResponse;
    latestSurveyResponseMapped = {
      surveyId: surveyResponseData.surveyId || "", // Padrão para string vazia
      studentId: surveyResponseData.studentId || docSnap.id,
      submittedAt: convertTimestampToString(surveyResponseData.submittedAt, 'latestSurveyResponse.submittedAt'),
      answers: Array.isArray(surveyResponseData.answers) ? surveyResponseData.answers : [],
    };
  }

  const studentData: Student = {
    id: docSnap.id,
    name: data.name || "Nome Indisponível",
    email: data.email || "Email Indisponível",
    phone: data.phone || "",
    profilePictureUrl: data.profilePictureUrl || "", // Adicionado default
    dateOfBirth: convertTimestampToString(data.dateOfBirth, 'dateOfBirth'),
    emergencyContactName: data.emergencyContactName || "",
    emergencyContactPhone: data.emergencyContactPhone || "",
    membershipType: data.membershipType || "Basico",
    joinDate: convertTimestampToString(data.joinDate, 'joinDate'), // Deve ter um default
    attendance: mapAttendance(data.attendance),
    missedClassesCount: typeof data.missedClassesCount === 'number' ? data.missedClassesCount : 0,
    latestSurveyResponse: latestSurveyResponseMapped,
    
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
  // console.log(`[StudentService-Firestore] mapDocToStudent - Mapped Student for doc ID ${docSnap.id}:`, JSON.stringify(studentData, null, 2));
  return studentData;
}

export async function getStudents(): Promise<Student[]> {
  console.log("[StudentService-Firestore] getStudents: Buscando alunos do Firestore.");
  try {
    const studentsCollection = collection(db, "students");
    const q = query(studentsCollection, orderBy("joinDate", "desc"));
    const querySnapshot = await getDocs(q);
    
    const students = querySnapshot.docs.map(mapDocToStudent);
    console.log(`[StudentService-Firestore] ${students.length} alunos buscados do Firestore.`);
    return students;
  } catch (error) {
    console.error("[StudentService-Firestore] Erro CRÍTICO ao buscar alunos do Firestore:", error);
    return []; 
  }
}

export async function addStudent(
  newStudentData: Omit<Student, 'id' | 'attendance' | 'missedClassesCount' | 'latestSurveyResponse'>
): Promise<Student> {
  console.log("[StudentService-Firestore] addStudent: Adicionando ao Firestore:", JSON.stringify(newStudentData, null, 2));
  
  // Garante que todos os campos opcionais sejam null se não fornecidos, ou tenham um default, em vez de undefined
  const studentToSave = {
      name: newStudentData.name || "Nome não fornecido",
      email: newStudentData.email || "email@naofornecido.com",
      joinDate: newStudentData.joinDate || new Date().toISOString().split('T')[0], // Obrigatório
      membershipType: newStudentData.membershipType || "Basico", // Obrigatório
      
      phone: newStudentData.phone || null,
      profilePictureUrl: newStudentData.profilePictureUrl || null, // Alterado para null se vazio
      dateOfBirth: newStudentData.dateOfBirth || null,
      emergencyContactName: newStudentData.emergencyContactName || null,
      emergencyContactPhone: newStudentData.emergencyContactPhone || null,
      
      attendance: [], 
      missedClassesCount: 0, 
      latestSurveyResponse: null, // Começa como null para novos alunos
      
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

  try {
    const docRef = await addDoc(collection(db, "students"), studentToSave);
    console.log("[StudentService-Firestore] Aluno adicionado ao Firestore com ID: ", docRef.id);
    // Retorna o objeto completo como está no Firestore, incluindo o ID e os defaults/nulls
    return { id: docRef.id, ...studentToSave } as Student; 
  } catch (error) {
    console.error("[StudentService-Firestore] Erro CRÍTICO ao adicionar aluno no Firestore:", error);
    throw error; // Relança o erro para ser tratado pelo chamador (ex: na UI)
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

  const studentDocRef = doc(db, "students", id);

  try {
    const docSnapBeforeUpdate = await getDoc(studentDocRef);
    if (!docSnapBeforeUpdate.exists()) {
      console.error(`[StudentService-Firestore] updateStudent ERRO: Aluno com ID ${id} NÃO ENCONTRADO para atualização.`);
      return undefined; 
    }
    console.log(`[StudentService-Firestore] updateStudent: Aluno ${id} encontrado ANTES da atualização.`);
    
    // Prepara os dados para o Firestore, garantindo que 'undefined' não seja enviado
    // e convertendo datas de SurveyResponse se necessário
    const dataToUpdateForFirestore: { [key: string]: any } = {};
    for (const key in updatedData) {
      if (Object.prototype.hasOwnProperty.call(updatedData, key)) {
        const value = (updatedData as any)[key];
        
        if (value === undefined) {
          // Firestore não gosta de 'undefined'. Podemos omitir ou usar 'null'.
          // Por segurança, omitimos ou convertemos para null se o campo já existe e queremos limpá-lo.
          // Se for um campo novo e undefined, simplesmente não o incluímos.
          // Para campos existentes que queremos "limpar", o ideal seria usar FieldValue.delete(), mas para simplificar:
          dataToUpdateForFirestore[key] = null; // Ou omitir, dependendo da intenção. Null é mais seguro.
        } else if (key === 'latestSurveyResponse' && value && typeof value === 'object') {
           // Lida com a data dentro de latestSurveyResponse
           const surveyResponseValue = value as SurveyResponse;
           dataToUpdateForFirestore[key] = {
             ...surveyResponseValue,
             submittedAt: surveyResponseValue.submittedAt 
                ? (surveyResponseValue.submittedAt instanceof Timestamp 
                    ? surveyResponseValue.submittedAt 
                    : Timestamp.fromDate(new Date(surveyResponseValue.submittedAt)))
                : Timestamp.now() // Default para agora se não houver data
           };
        } else if ((key === 'joinDate' || key === 'dateOfBirth') && typeof value === 'string' && value) {
            // Mantém datas como strings YYYY-MM-DD se já estiverem assim.
            // O Firestore as armazenará como strings.
            dataToUpdateForFirestore[key] = value;
        } else if (key === 'attendance' && Array.isArray(value)) {
            // Garante que as datas em attendance sejam strings ou Timestamps válidos
            dataToUpdateForFirestore[key] = value.map(att => ({
                ...att,
                date: att.date instanceof Timestamp ? att.date : (typeof att.date === 'string' && att.date ? att.date : new Date().toISOString().split('T')[0])
            }));
        }
        else {
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
    
    const updatedDocSnap = await getDoc(studentDocRef);
    if (updatedDocSnap.exists()) {
      return mapDocToStudent(updatedDocSnap);
    }
    
    console.error(`[StudentService-Firestore] updateStudent ERRO: Documento do aluno com ID ${id} não encontrado APÓS uma atualização supostamente bem-sucedida.`);
    return undefined; // Algo deu muito errado
  } catch (error) {
    console.error(`[StudentService-Firestore] updateStudent ERRO CRÍTICO ao atualizar aluno com ID ${id} no Firestore:`, error);
    // Em caso de erro, tenta retornar o estado anterior do aluno, se disponível
    const studentBeforeError = docSnapBeforeUpdate && docSnapBeforeUpdate.exists() ? mapDocToStudent(docSnapBeforeUpdate) : undefined;
    if(studentBeforeError) {
        console.warn("[StudentService-Firestore] updateStudent: Retornando dados do aluno ANTES do erro de atualização.");
        return studentBeforeError;
    }
    return undefined; 
  }
}

export async function updateStudentSurveyResponse(studentId: string, surveyResponse: SurveyResponse): Promise<Student | undefined> {
  console.warn(`[StudentService-Firestore] updateStudentSurveyResponse para student ID: ${studentId}`);
  // Converte submittedAt para string ISO antes de passar para updateStudent, se não for já
  const surveyResponseForUpdate: Partial<Omit<Student, 'id'>> = {
    latestSurveyResponse: {
      ...surveyResponse,
      submittedAt: surveyResponse.submittedAt 
        ? (new Date(surveyResponse.submittedAt).toISOString()) 
        : new Date().toISOString(),
    }
  };
  return updateStudent(studentId, surveyResponseForUpdate);
}

    

// src/lib/studentService.ts
// "use server"; // REMOVIDO

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
  // Adiciona um log para ver os dados brutos do Firestore
  // console.log(`[mapDocToStudent] Mapeando doc ID: ${docSnap.id}, Dados Brutos:`, JSON.stringify(data, null, 2));

  if (!data) {
    console.error(`[mapDocToStudent] Document data is undefined for mapping! Doc ID: ${docSnap.id}. Retornando defaults.`);
    return {
        id: docSnap.id, // Ainda retorna o ID se disponível
        name: "Erro: Nome Indisp.",
        email: "Erro: Email Indisp.",
        membershipType: "Basico",
        joinDate: new Date().toISOString().split('T')[0], // Data atual como padrão
        attendance: [],
        missedClassesCount: 0,
        phone: "",
        dateOfBirth: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        profilePictureUrl: "",
        latestSurveyResponse: undefined,
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
    } as Student;
  }
  
  const convertTimestampToString = (timestampField: any, fieldNameForLog: string): string => {
    const logPrefix = `[mapDocToStudent Field: ${fieldNameForLog}, DocID: ${docSnap.id}]`;
    if (!timestampField) {
        if (fieldNameForLog === 'joinDate') return new Date().toISOString().split('T')[0];
        return ""; 
    }
    if (timestampField instanceof Timestamp) {
      return timestampField.toDate().toISOString().split('T')[0];
    }
    if (typeof timestampField === 'string') {
      try {
        const dateObj = new Date(timestampField);
        if (!isNaN(dateObj.getTime())) {
            return dateObj.toISOString().split('T')[0];
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(timestampField)) {
            return timestampField;
        }
        console.warn(`${logPrefix} String de data não reconhecida: ${timestampField}. Retornando original.`);
        return timestampField; 
      } catch (e) {
        console.warn(`${logPrefix} Não foi possível converter a string de data: ${timestampField}`, e);
        return timestampField; 
      }
    }
    // Lidar com objetos que são Timestamps serializados (comum de Firestore quando não é Timestamp instance)
    if (typeof timestampField === 'object' && timestampField.seconds !== undefined && timestampField.nanoseconds !== undefined) {
        try {
            const dateFromObject = new Timestamp(timestampField.seconds, timestampField.nanoseconds).toDate();
            return dateFromObject.toISOString().split('T')[0];
        } catch (e) {
            console.warn(`${logPrefix} Não foi possível converter objeto de timestamp:`, timestampField, e);
            return fieldNameForLog === 'joinDate' ? new Date().toISOString().split('T')[0] : "";
        }
    }
    console.warn(`${logPrefix} Campo de timestamp não é Timestamp nem string válida: ${String(timestampField)}. Retornando default.`);
    return fieldNameForLog === 'joinDate' ? new Date().toISOString().split('T')[0] : "";
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
      } else if (typeof att.date === 'object' && att.date.seconds !== undefined) { // Handle serialized Timestamps in attendance
        dateStr = new Timestamp(att.date.seconds, att.date.nanoseconds).toDate().toISOString().split('T')[0];
      }
      else {
        console.warn(`[mapDocToStudent DocID: ${docSnap.id}] Data de frequência inválida (tipo): ${String(att.date)}. Usando data atual.`);
        dateStr = new Date().toISOString().split('T')[0];
      }
      return {
        date: dateStr,
        attended: typeof att.attended === 'boolean' ? att.attended : false,
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  let latestSurveyResponseMapped: SurveyResponse | undefined = undefined;
  if (data.latestSurveyResponse) {
    latestSurveyResponseMapped = {
      surveyId: data.latestSurveyResponse.surveyId || "",
      studentId: data.latestSurveyResponse.studentId || docSnap.id,
      submittedAt: convertTimestampToString(data.latestSurveyResponse.submittedAt, 'latestSurveyResponse.submittedAt'),
      answers: Array.isArray(data.latestSurveyResponse.answers) ? data.latestSurveyResponse.answers : [],
    };
  }

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
    profilePictureUrl: data.profilePictureUrl || "",
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
  // console.log(`[mapDocToStudent] Mapeado para Student:`, JSON.stringify(studentData, null, 2));
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
    console.error("[StudentService-Firestore] ERRO CRÍTICO ao buscar alunos do Firestore:", error);
    return []; 
  }
}

export async function addStudent(
  newStudentData: Omit<Student, 'id' | 'attendance' | 'missedClassesCount' | 'profilePictureUrl'>
): Promise<Student> {
  console.log("[StudentService-Firestore] addStudent: Adicionando ao Firestore:", JSON.stringify(newStudentData, null, 2));
  
  const studentToSave = {
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
        submittedAt: newStudentData.latestSurveyResponse.submittedAt ? new Date(newStudentData.latestSurveyResponse.submittedAt).toISOString() : new Date().toISOString(),
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

  try {
    const docRef = await addDoc(collection(db, "students"), studentToSave);
    console.log("[StudentService-Firestore] Aluno adicionado ao Firestore com ID: ", docRef.id);
    return { id: docRef.id, ...studentToSave } as Student;
  } catch (error) {
    console.error("[StudentService-Firestore] Erro CRÍTICO ao adicionar aluno no Firestore:", error);
    throw error;
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

  let docSnapBeforeUpdate;
  try {
    const studentDocRef = doc(db, "students", id);
    docSnapBeforeUpdate = await getDoc(studentDocRef); // Para log e possível retorno em caso de erro de update

    if (!docSnapBeforeUpdate.exists()) {
      console.error(`[StudentService-Firestore] updateStudent ERRO: Aluno com ID ${id} NÃO ENCONTRADO para atualização.`);
      return undefined; 
    }
    console.log(`[StudentService-Firestore] updateStudent: Aluno ${id} encontrado ANTES da atualização. Dados atuais:`, JSON.stringify(docSnapBeforeUpdate.data(), null, 2));
    
    const dataToUpdateForFirestore: { [key: string]: any } = {};
    for (const key in updatedData) {
      if (Object.prototype.hasOwnProperty.call(updatedData, key)) {
        const value = (updatedData as any)[key];
        
        if (value === undefined) {
          // Não enviamos 'undefined'. Se quisermos remover um campo, usaríamos FieldValue.delete()
          // ou definiríamos como null se isso for aceitável para o campo.
          // Por enquanto, apenas não incluímos campos undefined no objeto de atualização.
          console.warn(`[StudentService-Firestore] updateStudent: Campo '${key}' era undefined e não será enviado para update.`);
        } else if (key === 'latestSurveyResponse' && value && typeof value.submittedAt === 'string') {
           dataToUpdateForFirestore[key] = {
             ...value,
             // Converte para Timestamp se for string, para consistência no DB
             submittedAt: Timestamp.fromDate(new Date(value.submittedAt))
           };
        } else if ((key === 'joinDate' || key === 'dateOfBirth') && typeof value === 'string' && value) {
            // Datas como YYYY-MM-DD são salvas como string. Poderiam ser Timestamps.
            dataToUpdateForFirestore[key] = value;
        } else {
          dataToUpdateForFirestore[key] = value;
        }
      }
    }
    
    if (Object.keys(dataToUpdateForFirestore).length === 0) {
      console.warn("[StudentService-Firestore] updateStudent: Nenhum dado válido fornecido para atualização (após limpar undefineds). Retornando aluno atual sem alteração no DB.");
      return mapDocToStudent(docSnapBeforeUpdate); 
    }

    console.log(`[StudentService-Firestore] updateStudent: Dados que serão enviados para updateDoc para o aluno ${id}:`, JSON.stringify(dataToUpdateForFirestore, null, 2));
    
    await updateDoc(studentDocRef, dataToUpdateForFirestore);
    console.log(`[StudentService-Firestore] updateStudent: Aluno com ID ${id} atualizado com sucesso no Firestore.`);
    
    const updatedDocSnap = await getDoc(studentDocRef);
    if (updatedDocSnap.exists()) {
      // console.log(`[StudentService-Firestore] updateStudent: Dados do aluno ${id} APÓS atualização:`, JSON.stringify(updatedDocSnap.data(), null, 2));
      return mapDocToStudent(updatedDocSnap);
    }
    
    console.error(`[StudentService-Firestore] updateStudent ERRO: Documento do aluno com ID ${id} não encontrado APÓS uma atualização supostamente bem-sucedida.`);
    return undefined;
  } catch (error) {
    console.error(`[StudentService-Firestore] updateStudent ERRO CRÍTICO ao atualizar aluno com ID ${id} no Firestore:`, error);
    if (docSnapBeforeUpdate && docSnapBeforeUpdate.exists()) {
        console.warn("[StudentService-Firestore] updateStudent: Retornando dados do aluno ANTES do erro de atualização.");
        return mapDocToStudent(docSnapBeforeUpdate);
    }
    return undefined; 
  }
}

export async function updateStudentSurveyResponse(studentId: string, surveyResponse: SurveyResponse): Promise<Student | undefined> {
  console.log(`[StudentService-Firestore] updateStudentSurveyResponse: Atualizando pesquisa para student ID: ${studentId}`);
  const surveyResponseForUpdate: SurveyResponse = {
    ...surveyResponse,
    submittedAt: surveyResponse.submittedAt ? new Date(surveyResponse.submittedAt).toISOString() : new Date().toISOString(),
  };
  return updateStudent(studentId, { latestSurveyResponse: surveyResponseForUpdate });
}
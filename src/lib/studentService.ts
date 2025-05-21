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
  Timestamp,
  deleteDoc // Importar deleteDoc se formos implementar a exclusão
} from 'firebase/firestore';

// Helper para converter dados do Firestore para o tipo Student, tratando Timestamps
function mapDocToStudent(docSnap: import("firebase/firestore").DocumentSnapshot): Student {
  const data = docSnap.data();
  if (!data) {
    // Isso não deveria acontecer se o docSnap existir, mas é um type guard
    throw new Error("Document data is undefined!");
  }
  
  // Função auxiliar para converter Timestamp para string ISO ou manter a string
  const convertTimestampToString = (timestampField: any): string | undefined => {
    if (timestampField instanceof Timestamp) {
      return timestampField.toDate().toISOString();
    }
    if (typeof timestampField === 'string') {
      return timestampField;
    }
    return undefined;
  };

  const studentData: Student = {
    id: docSnap.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    dateOfBirth: data.dateOfBirth, // Assumindo que já é string YYYY-MM-DD ou undefined
    emergencyContactName: data.emergencyContactName,
    emergencyContactPhone: data.emergencyContactPhone,
    membershipType: data.membershipType,
    joinDate: data.joinDate, // Assumindo que já é string YYYY-MM-DD
    profilePictureUrl: data.profilePictureUrl,
    attendance: (data.attendance || []).map((att: any) => ({
      ...att,
      // Garante que 'date' seja string, Firestore pode armazenar como Timestamp se não tratado
      date: att.date instanceof Timestamp ? att.date.toDate().toISOString().split('T')[0] : att.date,
    })),
    missedClassesCount: data.missedClassesCount || 0,
    latestSurveyResponse: data.latestSurveyResponse ? {
      ...data.latestSurveyResponse,
      submittedAt: convertTimestampToString(data.latestSurveyResponse.submittedAt) || new Date().toISOString(),
      answers: data.latestSurveyResponse.answers || [],
    } : undefined,
    // Mapeamento para os novos campos opcionais
    genderIdentity: data.genderIdentity,
    maritalStatus: data.maritalStatus,
    hasChildren: data.hasChildren,
    occupation: data.occupation,
    monthlyIncome: data.monthlyIncome,
    educationLevel: data.educationLevel,
    likesWinter: data.likesWinter,
    bestTrainingTime: data.bestTrainingTime,
    daysPerWeek: data.daysPerWeek,
    workSchedule: data.workSchedule,
    commuteTime: data.commuteTime,
    mainGoal: data.mainGoal,
    otherGoalDetail: data.otherGoalDetail,
    attendedGymBefore: data.attendedGymBefore,
    previousGymDuration: data.previousGymDuration,
    reasonForLeavingPreviousGym: data.reasonForLeavingPreviousGym,
    trainingDifficulties: data.trainingDifficulties,
    medicalRestrictions: data.medicalRestrictions,
    medicalRestrictionsDetail: data.medicalRestrictionsDetail,
    professionalFollowUp: data.professionalFollowUp,
    currentHealthStatus: data.currentHealthStatus,
    motivationSource: data.motivationSource,
    potentialQuitFactors: data.potentialQuitFactors,
    wantsFollowUpApp: data.wantsFollowUpApp,
    contractPlan: data.contractPlan,
    paymentMethod: data.paymentMethod,
  };
  return studentData;
}

export async function getStudents(): Promise<Student[]> {
  console.log("[StudentService-Firestore] getStudents: Tentando buscar do Firestore");
  try {
    const studentsCollection = collection(db, "students");
    const q = query(studentsCollection, orderBy("joinDate", "desc"));
    const querySnapshot = await getDocs(q);
    
    const students = querySnapshot.docs.map(mapDocToStudent);
    console.log("[StudentService-Firestore] Alunos buscados do Firestore:", students.length);
    return students;
  } catch (error) {
    console.error("[StudentService-Firestore] Erro ao buscar alunos do Firestore:", error);
    return []; // Retorna array vazio em caso de erro
  }
}

export async function addStudent(
  newStudentData: Omit<Student, 'id' | 'attendance' | 'missedClassesCount' | 'profilePictureUrl' | 'latestSurveyResponse'>
): Promise<Student> {
  console.log("[StudentService-Firestore] addStudent: Tentando adicionar ao Firestore:", newStudentData);
  try {
    const studentWithDefaults = {
      ...newStudentData,
      profilePictureUrl: newStudentData.profilePictureUrl || 'https://placehold.co/100x100.png',
      attendance: [],
      missedClassesCount: 0,
      latestSurveyResponse: undefined,
      // Valores padrão para campos opcionais para consistência no Firestore
      phone: newStudentData.phone || "",
      dateOfBirth: newStudentData.dateOfBirth || "",
      emergencyContactName: newStudentData.emergencyContactName || "",
      emergencyContactPhone: newStudentData.emergencyContactPhone || "",
      genderIdentity: newStudentData.genderIdentity || "nao_informado",
      maritalStatus: newStudentData.maritalStatus || "nao_informado",
      hasChildren: newStudentData.hasChildren || "nao_informado",
      occupation: newStudentData.occupation || "",
      monthlyIncome: newStudentData.monthlyIncome || "nao_informado",
      educationLevel: newStudentData.educationLevel || "nao_informado",
      likesWinter: newStudentData.likesWinter || "nao_informado",
      bestTrainingTime: newStudentData.bestTrainingTime || "nao_informado",
      daysPerWeek: newStudentData.daysPerWeek || "",
      workSchedule: newStudentData.workSchedule || "nao_informado",
      commuteTime: newStudentData.commuteTime || "",
      mainGoal: newStudentData.mainGoal || "nao_informado",
      otherGoalDetail: newStudentData.otherGoalDetail || "",
      attendedGymBefore: newStudentData.attendedGymBefore || "nao_informado",
      previousGymDuration: newStudentData.previousGymDuration || "",
      reasonForLeavingPreviousGym: newStudentData.reasonForLeavingPreviousGym || "",
      trainingDifficulties: newStudentData.trainingDifficulties || "",
      medicalRestrictions: newStudentData.medicalRestrictions || "nao_informado",
      medicalRestrictionsDetail: newStudentData.medicalRestrictionsDetail || "",
      professionalFollowUp: newStudentData.professionalFollowUp || "nao_informado",
      currentHealthStatus: newStudentData.currentHealthStatus || "nao_informado",
      motivationSource: newStudentData.motivationSource || "",
      potentialQuitFactors: newStudentData.potentialQuitFactors || "",
      wantsFollowUpApp: newStudentData.wantsFollowUpApp || "nao_informado",
      contractPlan: newStudentData.contractPlan || "nao_informado",
      paymentMethod: newStudentData.paymentMethod || "nao_informado",
    };

    const docRef = await addDoc(collection(db, "students"), studentWithDefaults);
    console.log("[StudentService-Firestore] Aluno adicionado ao Firestore com ID: ", docRef.id);
    return { id: docRef.id, ...studentWithDefaults } as Student; // Type assertion
  } catch (error) {
    console.error("[StudentService-Firestore] Erro ao adicionar aluno no Firestore:", error);
    throw error; 
  }
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  console.log(`[StudentService-Firestore] getStudentById: Tentando buscar ID ${id} do Firestore`);
  try {
    const studentDocRef = doc(db, "students", id);
    const docSnap = await getDoc(studentDocRef);

    if (docSnap.exists()) {
      const student = mapDocToStudent(docSnap);
      console.log("[StudentService-Firestore] Aluno encontrado no Firestore:", student);
      return student;
    } else {
      console.warn(`[StudentService-Firestore] Aluno com ID ${id} não encontrado no Firestore.`);
      return undefined;
    }
  } catch (error) {
    console.error(`[StudentService-Firestore] Erro ao buscar aluno com ID ${id} do Firestore:`, error);
    return undefined;
  }
}

export async function updateStudent(id: string, updatedData: Partial<Omit<Student, 'id'>>): Promise<Student | undefined> {
  console.log(`[StudentService-Firestore] updateStudent: Tentando atualizar ID ${id} no Firestore com dados:`, updatedData);
  try {
    const studentDocRef = doc(db, "students", id);
    
    // Para evitar sobrescrever campos com undefined se eles não estiverem em updatedData
    // e para garantir que os tipos sejam corretos (ex: Timestamp para datas se necessário)
    const dataToUpdate: any = {};
    for (const key in updatedData) {
      if (Object.prototype.hasOwnProperty.call(updatedData, key) && (updatedData as any)[key] !== undefined) {
        dataToUpdate[key] = (updatedData as any)[key];
      }
    }
    
    // Tratar o campo de frequência especificamente para garantir que não seja sobrescrito por undefined
    if (updatedData.attendance && Array.isArray(updatedData.attendance)) {
      dataToUpdate.attendance = updatedData.attendance;
    } else if (updatedData.attendance === undefined && Object.keys(dataToUpdate).includes('attendance')) {
      // Se attendance está explicitamente como undefined em updatedData e não queremos apagar o campo se ele não foi intencionalmente limpado.
      // Esta lógica pode precisar de refinamento dependendo de como você quer tratar "limpar a frequência".
      // Por agora, se 'attendance' não está em updatedData, não será alterado. Se está e é undefined, será removido.
      // Se a intenção é apenas adicionar a um array existente, a lógica no componente chamador deve buscar o array atual e adicionar.
    }


    if (Object.keys(dataToUpdate).length === 0) {
        console.log("[StudentService-Firestore] updateStudent: Nenhum dado para atualizar.");
        // Retorna o aluno atual sem fazer chamada ao Firestore se não há o que atualizar.
        return getStudentById(id);
    }
    
    await updateDoc(studentDocRef, dataToUpdate);
    console.log(`[StudentService-Firestore] Aluno com ID ${id} atualizado no Firestore.`);
    
    // Busca o aluno atualizado para retornar
    const updatedDocSnap = await getDoc(studentDocRef);
    if (updatedDocSnap.exists()) {
      return mapDocToStudent(updatedDocSnap);
    }
    return undefined; // Não deveria acontecer se o update foi bem-sucedido
  } catch (error) {
    console.error(`[StudentService-Firestore] Erro ao atualizar aluno com ID ${id} no Firestore:`, error);
    throw error;
  }
}

// Esta função pode ser simplificada ou removida se 'updateStudent' lidar bem com 'latestSurveyResponse'
export async function updateStudentSurveyResponse(studentId: string, surveyResponse: SurveyResponse): Promise<Student | undefined> {
  console.log(`[StudentService-Firestore] updateStudentSurveyResponse: Atualizando pesquisa para student ID ${studentId}`);
  // Converte submittedAt para Timestamp do Firestore para armazenamento consistente, se for string
  const surveyResponseToStore = {
    ...surveyResponse,
    submittedAt: typeof surveyResponse.submittedAt === 'string' 
        ? Timestamp.fromDate(new Date(surveyResponse.submittedAt)) 
        : surveyResponse.submittedAt,
  };
  return updateStudent(studentId, { latestSurveyResponse: surveyResponseToStore as any });
}

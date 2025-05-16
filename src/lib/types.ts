
export interface SurveyQuestion {
  id: string; // e.g., "q1", "q2"
  text: string;
  type: 'rating' | 'text' | 'multiple-choice' | 'yes-no';
  options?: string[]; // For multiple-choice
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
}

export interface SurveyAnswer {
  questionId: string;
  value: string | number; // Could be number for rating, string for text/multiple-choice
}

export interface SurveyResponse {
  surveyId: string;
  studentId?: string; // Optional: if the response is linked to a student
  submittedAt: string; // ISO date string
  answers: SurveyAnswer[];
}

// This can be part of the Student interface or a separate structure
export interface SurveyFeedbackForAI {
  overallSatisfaction?: number; // e.g., from a rating question (q1)
  facilityCleanliness?: number; // e.g., from q2
  equipmentSatisfaction?: "sim" | "nao" | string; // e.g., from q3
  likelyToRecommend?: number; // e.g., from q4
  comments?: string; // e.g., from an open text question (q5)
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  membershipType: 'Basico' | 'Premium' | 'Experimental';
  joinDate: string; // YYYY-MM-DD
  profilePictureUrl?: string;
  attendance: AttendanceRecord[];
  missedClassesCount: number;
  latestSurveyResponse?: SurveyResponse;

  // Informações Pessoais Detalhadas
  genderIdentity?: "feminino" | "masculino" | "outro_nao_informar" | "nao_informado";
  maritalStatus?: "solteiro" | "casado_uniao" | "divorciado" | "viuvo" | "nao_informado";
  hasChildren?: "sim" | "nao" | "nao_informado"; 
  occupation?: string;
  monthlyIncome?: "menos_1000" | "1000_2500" | "2500_5000" | "5000_10000" | "acima_10000" | "prefiro_nao_informar" | "nao_informado";
  educationLevel?: "fundamental_incompleto" | "fundamental_completo" | "medio_incompleto" | "medio_completo" | "superior_incompleto" | "superior_completo" | "pos_graduacao" | "nao_informado";
  
  likesWinter?: "sim" | "nao" | "nao_informado";
  
  bestTrainingTime?: "manha" | "tarde" | "noite" | "nao_informado";
  daysPerWeek?: string; 
  workSchedule?: "turnos" | "fixos" | "flexivel" | "nao_trabalha" | "nao_informado";
  commuteTime?: string; 

  mainGoal?: "emagrecimento" | "massa_muscular" | "qualidade_vida" | "reabilitacao" | "socializacao" | "outro" | "nao_informado";
  otherGoalDetail?: string; 
  attendedGymBefore?: "sim" | "nao" | "nao_informado";
  previousGymDuration?: string; 
  reasonForLeavingPreviousGym?: string;
  trainingDifficulties?: string; 

  medicalRestrictions?: "sim" | "nao" | "nao_informado";
  medicalRestrictionsDetail?: string; 
  professionalFollowUp?: "sim" | "nao" | "nao_informado"; 
  currentHealthStatus?: "excelente" | "bom" | "regular" | "ruim" | "nao_informado";

  motivationSource?: string; 
  potentialQuitFactors?: string; 
  wantsFollowUpApp?: "sim" | "nao" | "talvez" | "nao_informado"; 

  contractPlan?: "mensal" | "trimestral" | "semestral" | "anual" | "nao_informado";
  paymentMethod?: "cartao_credito" | "cartao_debito" | "pix" | "boleto" | "dinheiro" | "nao_informado";
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  attended: boolean;
}

export interface DropoutPredictionResult {
  dropoutRisk: number;
  reasons: string[];
  recommendations: string[];
}

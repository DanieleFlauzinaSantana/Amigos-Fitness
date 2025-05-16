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

  // Perguntas antigas que foram adaptadas ou mantidas
  likesWinter?: "sim" | "nao" | "nao_informado";
  hasChildren?: "sim" | "nao" | "nao_informado";
  
  // Novas Perguntas

  // ROTINA E DISPONIBILIDADE
  bestTrainingTime?: "manha" | "tarde" | "noite" | "nao_informado";
  daysPerWeek?: string; // e.g., "3", "5", "todos_os_dias"
  workSchedule?: "turnos" | "fixos" | "flexivel" | "nao_trabalha" | "nao_informado";
  commuteTime?: string; // e.g., "15 min", "30-45 min", "1 hora+"

  // MOTIVAÇÃO E OBJETIVOS
  mainGoal?: "emagrecimento" | "massa_muscular" | "qualidade_vida" | "reabilitacao" | "socializacao" | "outro";
  otherGoalDetail?: string; // Detalhes se mainGoal for 'outro'
  attendedGymBefore?: "sim" | "nao" | "nao_informado";
  previousGymDuration?: string; // e.g., "6 meses", "1 ano"
  reasonForLeavingPreviousGym?: string;
  trainingDifficulties?: string; // Quais dificuldades já teve

  // SAÚDE E CONDIÇÃO FÍSICA
  medicalRestrictions?: "sim" | "nao" | "nao_informado";
  medicalRestrictionsDetail?: string; // Detalhes se medicalRestrictions for 'sim'
  professionalFollowUp?: "sim" | "nao" | "nao_informado"; // Nutricionista, médico, etc.
  currentHealthStatus?: "excelente" | "bom" | "regular" | "ruim" | "nao_informado";

  // ENGAJAMENTO E EXPECTATIVA
  motivationSource?: string; // O que te motiva a continuar
  potentialQuitFactors?: string; // O que poderia te fazer desistir
  wantsFollowUpApp?: "sim" | "nao" | "talvez" | "nao_informado"; // Acompanhamento por app/mensagens

  // DADOS DE CONTRATO (opcional)
  contractPlan?: "mensal" | "trimestral" | "semestral" | "anual" | "nao_informado";
  paymentMethod?: "cartao_credito" | "cartao_debito" | "pix" | "boleto" | "dinheiro" | "nao_informado";

  // Campo fitnessGoals original foi substituído por mainGoal e otherGoalDetail
  // Campo previousGyms original foi substituído por attendedGymBefore, previousGymDuration, reasonForLeavingPreviousGym
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  attended: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'rating' | 'text' | 'multiple-choice';
  options?: string[];
}

export interface SurveyResponse {
  surveyId: string;
  studentId?: string; // Optional for anonymous surveys
  answers: SurveyAnswer[];
  submittedAt: string; // ISO Date string
}

export interface SurveyAnswer {
  questionId: string;
  value: string | number;
}

// For AI flow inputs/outputs if needed beyond direct flow types
// Example: Dropout prediction display data
export interface DropoutPredictionResult {
  dropoutRisk: number;
  reasons: string[];
  recommendations: string[];
}


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
  // latestSurveyResponse?: SurveyResponse; // Removido pois as respostas estarão no Google Forms

  // Informações Pessoais Detalhadas
  genderIdentity?: "feminino" | "masculino" | "outro_nao_informar" | "nao_informado";
  maritalStatus?: "solteiro" | "casado_uniao" | "divorciado" | "viuvo" | "nao_informado";
  hasChildren?: "sim" | "nao" | "nao_informado"; 
  occupation?: string;
  monthlyIncome?: "menos_1000" | "1000_2500" | "2500_5000" | "5000_10000" | "acima_10000" | "prefiro_nao_informar" | "nao_informado";
  educationLevel?: "fundamental_incompleto" | "fundamental_completo" | "medio_incompleto" | "medio_completo" | "superior_incompleto" | "superior_completo" | "pos_graduacao" | "nao_informado";
  
  // Perguntas de Preferência (mantidas)
  likesWinter?: "sim" | "nao" | "nao_informado";
  
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
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  attended: boolean;
}

// Removidos Survey, SurveyQuestion, SurveyResponse, SurveyAnswer, SurveyFeedbackForAI
// pois a pesquisa será gerenciada pelo Google Forms.

// For AI flow inputs/outputs if needed beyond direct flow types
// Example: Dropout prediction display data
export interface DropoutPredictionResult {
  dropoutRisk: number;
  reasons: string[];
  recommendations: string[];
}

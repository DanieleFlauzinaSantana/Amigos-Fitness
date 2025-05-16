export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  fitnessGoals?: string;
  membershipType: 'Basico' | 'Premium' | 'Experimental';
  joinDate: string; // YYYY-MM-DD
  profilePictureUrl?: string;
  attendance: AttendanceRecord[];
  missedClassesCount: number;
  likesWinter?: "sim" | "nao" | "nao_informado";
  hasChildren?: "sim" | "nao" | "nao_informado";
  previousGyms?: string;
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



import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, FileText, ClipboardCheckIcon, Settings } from 'lucide-react';
import type { Student, Survey, SurveyResponse, SurveyFeedbackForAI } from '@/lib/types';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavLink[];
  exact?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard, exact: true },
  { href: '/students', label: 'Alunos', icon: Users },
  { href: '/checkin', label: 'Check-in (Nº Inscrição)', icon: ClipboardCheckIcon },
  { href: '/surveys', label: 'Pesquisas', icon: FileText },
  // { href: '/settings', label: 'Configurações', icon: Settings }, // Removido do menu principal, mas acessível pelo rodapé do sidebar
];

export const MOCK_SURVEY: Survey = {
  id: 'survey1',
  title: 'Pesquisa de Satisfação da Amigos Fitness',
  description: 'Seu feedback é muito importante para nós! Responda às perguntas abaixo.',
  questions: [
    { id: 'q1', text: 'Qual seu nível de satisfação geral com a academia (1 a 5 estrelas)?', type: 'rating' },
    { id: 'q2', text: 'Como você avalia a limpeza das instalações (1 a 5 estrelas)?', type: 'rating' },
    { id: 'q3', text: 'Os equipamentos disponíveis atendem às suas necessidades?', type: 'yes-no' },
    { id: 'q4', text: 'Em uma escala de 1 a 5, o quão provável você recomendaria a Amigos Fitness a um amigo ou colega?', type: 'rating' },
    { id: 'q5', text: 'Deixe um comentário, sugestão ou crítica construtiva (opcional):', type: 'text' },
  ],
};

export const anaSilvaSurveyResponse: SurveyResponse = {
  surveyId: 'survey1',
  studentId: '1',
  submittedAt: '2024-07-10T10:00:00Z',
  answers: [
    { questionId: 'q1', value: 4 }, // Satisfação Geral
    { questionId: 'q2', value: 5 }, // Limpeza
    { questionId: 'q3', value: 'sim' }, // Equipamentos
    { questionId: 'q4', value: 5 }, // Recomendaria
    { questionId: 'q5', value: 'Gostaria de mais aulas de Zumba às sextas-feiras!' }, // Comentário
  ],
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '(11) 98765-4321',
    dateOfBirth: '1995-03-15',
    emergencyContactName: 'Carlos Silva',
    emergencyContactPhone: '(11) 91234-5678',
    membershipType: 'Premium',
    joinDate: '2023-01-10',
    profilePictureUrl: 'https://placehold.co/100x100.png',
    attendance: [
      { date: '2024-07-01', attended: true },
      { date: '2024-07-03', attended: true },
      { date: '2024-07-05', attended: false },
      { date: '2024-07-08', attended: true },
      { date: '2024-07-10', attended: false },
      { date: '2024-07-12', attended: false },
      { date: '2024-07-15', attended: true },
    ],
    missedClassesCount: 3,
    latestSurveyResponse: anaSilvaSurveyResponse,

    genderIdentity: "feminino",
    maritalStatus: "solteiro",
    hasChildren: "nao",
    occupation: "Designer Gráfica",
    monthlyIncome: "2500_5000",
    educationLevel: "superior_completo",

    likesWinter: "sim",

    bestTrainingTime: "manha",
    daysPerWeek: "3-4",
    workSchedule: "flexivel",
    commuteTime: "20 minutos",
    mainGoal: "emagrecimento",
    otherGoalDetail: "",
    attendedGymBefore: "sim",
    previousGymDuration: "2 anos",
    reasonForLeavingPreviousGym: "Mudança de cidade.",
    trainingDifficulties: "Falta de tempo às vezes.",
    medicalRestrictions: "nao",
    medicalRestrictionsDetail: "",
    professionalFollowUp: "sim",
    currentHealthStatus: "bom",
    motivationSource: "Ver resultados, bem-estar.",
    potentialQuitFactors: "Falta de tempo, desmotivação se não vir progresso.",
    wantsFollowUpApp: "sim",
    contractPlan: "anual",
    paymentMethod: "cartao_credito",
  },
  {
    id: '2',
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    phone: '(21) 99999-8888',
    dateOfBirth: '1988-07-22',
    membershipType: 'Basico',
    joinDate: '2023-05-20',
    profilePictureUrl: 'https://placehold.co/100x100.png',
    attendance: [
      { date: '2024-07-02', attended: true },
      { date: '2024-07-04', attended: true },
      { date: '2024-07-09', attended: true },
      { date: '2024-07-11', attended: true },
    ],
    missedClassesCount: 0,
    latestSurveyResponse: undefined,

    genderIdentity: "masculino",
    maritalStatus: "casado_uniao",
    hasChildren: "sim",
    occupation: "Engenheiro de Software",
    monthlyIncome: "acima_10000",
    educationLevel: "pos_graduacao",

    likesWinter: "nao",

    bestTrainingTime: "noite",
    daysPerWeek: "5",
    workSchedule: "fixos",
    commuteTime: "30 minutos",
    mainGoal: "massa_muscular",
    otherGoalDetail: "",
    attendedGymBefore: "nao",
    previousGymDuration: "",
    reasonForLeavingPreviousGym: "",
    trainingDifficulties: "Manter a dieta.",
    medicalRestrictions: "nao",
    medicalRestrictionsDetail: "",
    professionalFollowUp: "nao",
    currentHealthStatus: "excelente",
    motivationSource: "Superar limites, estética.",
    potentialQuitFactors: "Lesões.",
    wantsFollowUpApp: "talvez",
    contractPlan: "trimestral",
    paymentMethod: "pix",
  },
  {
    id: '3',
    name: 'Carla Dias',
    email: 'carla.dias@example.com',
    membershipType: 'Experimental',
    joinDate: '2024-06-01',
    profilePictureUrl: 'https://placehold.co/100x100.png',
    attendance: [
       { date: '2024-07-01', attended: true },
       { date: '2024-07-03', attended: false },
       { date: '2024-07-05', attended: false },
       { date: '2024-07-08', attended: false },
       { date: '2024-07-10', attended: false },
    ],
    missedClassesCount: 4,
    latestSurveyResponse: undefined,

    genderIdentity: "outro_nao_informar",
    maritalStatus: "divorciado",
    hasChildren: "nao_informado",
    occupation: "Autônoma",
    monthlyIncome: "1000_2500",
    educationLevel: "medio_completo",

    likesWinter: "nao_informado",

    bestTrainingTime: "tarde",
    daysPerWeek: "2-3",
    workSchedule: "turnos",
    commuteTime: "10 minutos",
    mainGoal: "qualidade_vida",
    otherGoalDetail: "",
    attendedGymBefore: "sim",
    previousGymDuration: "6 meses",
    reasonForLeavingPreviousGym: "Falta de acompanhamento.",
    trainingDifficulties: "Consistência.",
    medicalRestrictions: "sim",
    medicalRestrictionsDetail: "Dor no joelho esquerdo ao realizar agachamentos profundos.",
    professionalFollowUp: "nao",
    currentHealthStatus: "regular",
    motivationSource: "Sentir-se bem, aliviar estresse.",
    potentialQuitFactors: "Rotina de trabalho puxada.",
    wantsFollowUpApp: "nao",
    contractPlan: "mensal",
    paymentMethod: "boleto",
  }
];

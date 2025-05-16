
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, FileText, ClipboardCheckIcon, Settings } from 'lucide-react';
import type { Student, Survey, SurveyResponse } from '@/lib/types';

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
  // { href: '/settings', label: 'Configurações', icon: Settings }, // Removido conforme solicitado anteriormente
];

export const MOCK_SURVEY: Survey = {
  id: 'survey1',
  title: 'Pesquisa de Satisfação Amigos Fitness',
  description: 'Seu feedback é muito importante para nós! Por favor, dedique alguns minutos para responder às perguntas abaixo. Suas respostas nos ajudarão a melhorar nossos serviços.',
  questions: [
    { 
      id: 'q1_satisfaction', 
      text: 'Em uma escala de 1 a 5, qual seu nível de satisfação geral com a academia Amigos Fitness?', 
      type: 'rating' 
    },
    { 
      id: 'q2_recommend', 
      text: 'Você recomendaria a Amigos Fitness a um amigo, familiar ou colega?', 
      type: 'yes-no' 
    },
    { 
      id: 'q4_cleanliness', 
      text: 'Como você avalia a limpeza das instalações (vestiários, áreas de treino, banheiros, etc.)? (1 a 5 estrelas)', 
      type: 'rating' 
    },
    { 
      id: 'q5_equipment_quality', 
      text: 'Como você avalia a qualidade e manutenção dos nossos equipamentos? (1 a 5 estrelas)', 
      type: 'rating' 
    },
    { 
      id: 'q6_equipment_availability', 
      text: 'Com que frequência os equipamentos que você deseja usar estão disponíveis?', 
      type: 'multiple-choice',
      options: ["Sempre disponíveis", "Geralmente disponíveis", "Às vezes preciso esperar", "Frequentemente preciso esperar", "Raramente disponíveis"] 
    },
    { 
      id: 'q7_instructors_availability', 
      text: 'Como você avalia a disponibilidade dos instrutores para ajudar ou tirar dúvidas?', 
      type: 'multiple-choice',
      options: ["Muito satisfeito(a)", "Satisfeito(a)", "Neutro(a)", "Insatisfeito(a)", "Muito insatisfeito(a)"]
    },
    { 
      id: 'q8_instructors_quality', 
      text: 'Como você avalia a qualidade do atendimento, conhecimento e cortesia dos instrutores? (1 a 5 estrelas)', 
      type: 'rating' 
    },
    { 
      id: 'q9_class_schedule', 
      text: 'Os horários e a variedade das aulas em grupo (se você participa) atendem às suas necessidades?', 
      type: 'multiple-choice',
      options: ["Sim, totalmente", "Em grande parte", "Poderia ser melhor", "Não atende bem", "Não participo de aulas em grupo"] 
    },
    { 
      id: 'q10_value_for_money', 
      text: 'Considerando os serviços e instalações, como você avalia o custo-benefício da sua mensalidade? (1 a 5 estrelas)', 
      type: 'rating' 
    },
    { 
      id: 'q3_comments', 
      text: 'Você tem algum comentário, sugestão ou crítica construtiva para nos ajudar a melhorar? (Opcional)', 
      type: 'text' 
    },
  ],
};

// Resposta de exemplo para Ana Silva, ajustada para as novas perguntas da MOCK_SURVEY
export const anaSilvaSurveyResponse: SurveyResponse = {
  surveyId: 'survey1',
  studentId: '1',
  submittedAt: '2024-07-25T10:00:00Z', // Data de exemplo
  answers: [
    { questionId: 'q1_satisfaction', value: 4 },        // Satisfação Geral
    { questionId: 'q2_recommend', value: 'sim' },       // Recomendaria
    { questionId: 'q4_cleanliness', value: 5 },         // Limpeza
    { questionId: 'q5_equipment_quality', value: 4 },   // Qualidade Equipamentos
    { questionId: 'q6_equipment_availability', value: "Geralmente disponíveis" }, // Disponibilidade Equipamentos
    { questionId: 'q7_instructors_availability', value: "Satisfeito(a)" }, // Disponibilidade Instrutores
    { questionId: 'q8_instructors_quality', value: 5 }, // Qualidade Instrutores
    { questionId: 'q9_class_schedule', value: "Poderia ser melhor" }, // Horários Aulas
    { questionId: 'q10_value_for_money', value: 4 },    // Custo-Benefício
    { questionId: 'q3_comments', value: 'Adoraria mais opções de aulas de dança no período da noite e talvez alguns equipamentos de cardio mais modernos.' }, // Comentários
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
      { date: '2024-07-17', attended: true },
      { date: '2024-07-19', attended: true },
      { date: '2024-07-22', attended: true },
      { date: '2024-07-24', attended: true },
      { date: '2024-07-26', attended: false }, // Nova falta
    ],
    missedClassesCount: 3, // (05, 10, 12) + 26 = 4 (será recalculado pela UI)
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
      { date: '2024-07-16', attended: true },
      { date: '2024-07-18', attended: true },
      { date: '2024-07-23', attended: true },
      { date: '2024-07-25', attended: true },
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
       { date: '2024-07-12', attended: true }, // Voltou
       { date: '2024-07-15', attended: false }, // Faltou de novo
       { date: '2024-07-17', attended: false },
       { date: '2024-07-19', attended: false },
       { date: '2024-07-22', attended: false },
       { date: '2024-07-24', attended: false },
       { date: '2024-07-26', attended: true }, // Voltou
    ],
    missedClassesCount: 8, // (03,05,08,10) + (15,17,19,22,24) = 9 (será recalculado)
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

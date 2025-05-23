
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, FileText, ClipboardCheck, TrendingDown, BrainCircuit, Settings as SettingsIcon } from 'lucide-react';
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
  { href: '/checkin', label: 'Check-in (Nº Inscrição)', icon: ClipboardCheck },
  { href: '/surveys', label: 'Pesquisas', icon: FileText },
  { href: '/predictions', label: 'Previsão de Desistência', icon: TrendingDown },
  { href: '/chat-ia', label: 'Chat com IA', icon: BrainCircuit },
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
      id: 'q3_comments',
      text: 'Você tem algum comentário, sugestão ou crítica construtiva para nos ajudar a melhorar? (Opcional)',
      type: 'text'
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
  ],
};

// Este MOCK_STUDENTS é usado como fallback pelo studentService se o Firestore estiver vazio ou
// para inicializar o localStorage se studentService ainda o usa.
const anaSilvaSurveyResponse: SurveyResponse = {
  surveyId: 'survey1',
  studentId: 'example-student-1-mock', 
  submittedAt: '2024-05-10T10:00:00Z',
  answers: [
    { questionId: 'q1_satisfaction', value: 4 },
    { questionId: 'q2_recommend', value: 'sim' },
    { questionId: 'q3_comments', value: 'Gostaria de mais aulas de dança e um bebedouro melhor.' },
    { questionId: 'q4_cleanliness', value: 5 },
    { questionId: 'q5_equipment_quality', value: 3 },
    { questionId: 'q6_equipment_availability', value: "Às vezes preciso esperar" },
    { questionId: 'q7_instructors_availability', value: "Satisfeito(a)" },
    { questionId: 'q8_instructors_quality', value: 4 },
    { questionId: 'q9_class_schedule', value: "Em grande parte" },
    { questionId: 'q10_value_for_money', value: 4 },
  ],
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'example-student-1-mock', 
    name: 'Ana Silva (Exemplo)',
    email: 'ana.exemplo@example.com',
    phone: '(11) 98888-7777',
    profilePictureUrl: 'https://placehold.co/100x100.png?text=AS',
    dateOfBirth: '1990-05-15',
    emergencyContactName: 'Carlos Silva',
    emergencyContactPhone: '(11) 91111-2222',
    membershipType: 'Premium',
    joinDate: '2023-01-10',
    attendance: [
      { date: '2024-05-01', attended: true },
      { date: '2024-05-03', attended: true },
      { date: '2024-05-06', attended: false },
    ],
    missedClassesCount: 1,
    latestSurveyResponse: anaSilvaSurveyResponse,
    genderIdentity: "feminino",
    maritalStatus: "solteiro",
    hasChildren: "nao",
    occupation: "Designer Gráfica",
    monthlyIncome: "2500_5000",
    educationLevel: "superior_completo",
    likesWinter: "nao",
    bestTrainingTime: "noite",
    daysPerWeek: "3-4 vezes",
    workSchedule: "fixos",
    commuteTime: "30 minutos",
    mainGoal: "qualidade_vida",
    otherGoalDetail: "",
    attendedGymBefore: "sim",
    previousGymDuration: "1 ano",
    reasonForLeavingPreviousGym: "Mudança de cidade",
    trainingDifficulties: "Falta de tempo às vezes",
    medicalRestrictions: "nao",
    medicalRestrictionsDetail: "",
    professionalFollowUp: "sim",
    currentHealthStatus: "bom",
    motivationSource: "Bem-estar e saúde",
    potentialQuitFactors: "Falta de tempo, desmotivação no inverno",
    wantsFollowUpApp: "sim",
    contractPlan: "anual",
    paymentMethod: "cartao_credito",
  },
];

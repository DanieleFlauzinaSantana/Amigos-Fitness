import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, FileText } from 'lucide-react';
import type { Student, Survey, SurveyQuestion } from '@/lib/types';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavLink[];
  exact?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/students', label: 'Alunos', icon: Users },
  { href: '/surveys', label: 'Pesquisas', icon: FileText },
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '(11) 98765-4321',
    dateOfBirth: '1995-03-15',
    emergencyContactName: 'Carlos Silva',
    emergencyContactPhone: '(11) 91234-5678',
    fitnessGoals: 'Perder peso e aumentar a resistência.',
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
  },
  {
    id: '2',
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    phone: '(21) 99999-8888',
    dateOfBirth: '1988-07-22',
    fitnessGoals: 'Ganhar massa muscular.',
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
  }
];

const MOCK_SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: 'q1', text: 'Qual o seu nível de satisfação com a limpeza das instalações?', type: 'rating' },
  { id: 'q2', text: 'Como você avalia a qualidade dos equipamentos?', type: 'rating' },
  { id: 'q3', text: 'Os horários das aulas atendem às suas necessidades?', type: 'multiple-choice', options: ['Sim', 'Não', 'Em parte'] },
  { id: 'q4', text: 'Você indicaria a academia para um amigo?', type: 'multiple-choice', options: ['Sim, com certeza', 'Talvez', 'Não'] },
  { id: 'q5', text: 'Deixe seus comentários ou sugestões:', type: 'text' },
];

export const MOCK_SURVEY: Survey = {
  id: 'survey1',
  title: 'Pesquisa de Satisfação - Academia Inteligente',
  description: 'Sua opinião é muito importante para nós! Por favor, dedique alguns minutos para responder a esta pesquisa e nos ajudar a melhorar nossos serviços.',
  questions: MOCK_SURVEY_QUESTIONS,
};

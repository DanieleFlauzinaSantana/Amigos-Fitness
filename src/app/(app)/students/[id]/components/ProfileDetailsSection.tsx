
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StudentForm } from '../../components/StudentForm';
import type { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Edit3, User, Mail, Phone, Cake, Shield, Users as UsersIcon, CalendarDays, Snowflake, Building2, Clock, Target, HeartPulse, HelpCircle, FileTextIcon, Tag, Briefcase, Hourglass, Users2, TrendingUp, MessageCircle, Smartphone, BookOpen, CreditCard, Binary, HeartHandshake, DollarSign, GraduationCap, Contact, Lightbulb, AlertTriangle } from 'lucide-react'; 
import { Separator } from '@/components/ui/separator';


const DetailItem = ({ icon: Icon, label, value, fullWidth = false }: { icon?: React.ElementType, label: string, value?: string | React.ReactNode, fullWidth?: boolean }) => (
  <div className={`flex items-start space-x-3 ${fullWidth ? 'md:col-span-2' : ''}`}>
    {Icon && <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />}
    <div className="min-w-0">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {typeof value === 'string' ? <p className="text-base text-foreground break-words">{value || 'Não informado'}</p> : <div className="text-base text-foreground">{value || 'Não informado'}</div>}
    </div>
  </div>
);

const SectionTitleDisplay: React.FC<{ children: React.ReactNode, icon?: React.ElementType }> = ({ children, icon: Icon }) => (
  <h3 className="text-xl font-semibold mt-6 mb-3 text-primary flex items-center col-span-1 md:col-span-2">
    {Icon && <Icon className="mr-2 h-5 w-5" />}
    {children}
  </h3>
);


export function ProfileDetailsSection({ student, onUpdateStudent }: { student: Student, onUpdateStudent: (updatedStudent: Student) => void;}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: Omit<Student, 'id' | 'attendance' | 'missedClassesCount' | 'profilePictureUrl'>) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedStudentData = { ...student, ...data };
    onUpdateStudent(updatedStudentData);
    setIsSubmitting(false);
    setIsEditing(false);
    toast({
      title: "Perfil Atualizado!",
      description: `Os dados de ${student.name} foram atualizados.`,
    });
  };

  const formatYesNoNotInformated = (value?: "sim" | "nao" | "nao_informado" | "talvez") => {
    if (value === "sim") return "Sim";
    if (value === "nao") return "Não";
    if (value === "talvez") return "Talvez";
    return "Não informado";
  }

  const formatDisplayValue = (value: string | undefined, mapping: Record<string, string>, defaultValue = "Não informado") => {
    return value ? mapping[value] || value : defaultValue;
  }
  
  const genderIdentityMap = {
    feminino: "Feminino",
    masculino: "Masculino",
    outro_nao_informar: "Outro / Prefere não informar",
    nao_informado: "Não informado"
  };

  const maritalStatusMap = {
    solteiro: "Solteiro(a)",
    casado_uniao: "Casado(a) / União estável",
    divorciado: "Divorciado(a)",
    viuvo: "Viúvo(a)",
    nao_informado: "Não informado"
  };

  const monthlyIncomeMap = {
    menos_1000: "Menos de R$ 1.000",
    "1000_2500": "De R$ 1.000 a R$ 2.500",
    "2500_5000": "De R$ 2.500 a R$ 5.000",
    "5000_10000": "De R$ 5.000 a R$ 10.000",
    acima_10000: "Acima de R$ 10.000",
    prefiro_nao_informar: "Prefere não informar",
    nao_informado: "Não informado"
  };

  const educationLevelMap = {
    fundamental_incompleto: "Ensino fundamental incompleto",
    fundamental_completo: "Ensino fundamental completo",
    medio_incompleto: "Ensino médio incompleto",
    medio_completo: "Ensino médio completo",
    superior_incompleto: "Ensino superior incompleto",
    superior_completo: "Ensino superior completo",
    pos_graduacao: "Pós-graduação ou mais",
    nao_informado: "Não informado"
  };

  const membershipTypeMap = {
    Basico: "Básico",
    Premium: "Premium",
    Experimental: "Experimental"
  };

  const bestTrainingTimeMap = {
    manha: "Manhã", 
    tarde: "Tarde", 
    noite: "Noite",
    nao_informado: "Não informado"
  };

  const workScheduleMap = {
    turnos: "Turnos", 
    fixos: "Horários Fixos", 
    flexivel: "Horários Flexíveis", 
    nao_trabalha: "Não trabalha atualmente",
    nao_informado: "Não informado"
  };
  
  const mainGoalMap = {
    emagrecimento: "Emagrecimento", 
    massa_muscular: "Ganho de massa muscular", 
    qualidade_vida: "Qualidade de vida", 
    reabilitacao: "Reabilitação/Condicionamento", 
    socializacao: "Socialização", 
    outro: "Outro",
    nao_informado: "Não informado"
  };

  const currentHealthStatusMap = {
    excelente: "Excelente", 
    bom: "Bom", 
    regular: "Regular", 
    ruim: "Ruim",
    nao_informado: "Não informado"
  };

  const contractPlanMap = {
    mensal: "Mensal", 
    trimestral: "Trimestral", 
    semestral: "Semestral", 
    anual: "Anual",
    nao_informado: "Não informado"
  };

  const paymentMethodMap = {
    cartao_credito: "Cartão de Crédito", 
    cartao_debito: "Cartão de Débito", 
    pix: "Pix", 
    boleto: "Boleto", 
    dinheiro: "Dinheiro",
    nao_informado: "Não informado"
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Perfil Completo do Aluno</CardTitle>
          <CardDescription>Informações detalhadas, preferências e histórico.</CardDescription>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Edit3 className="h-4 w-4" />
              <span className="sr-only">Editar Perfil</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Perfil de {student.name}</DialogTitle>
            </DialogHeader>
            <StudentForm 
              student={student} 
              onSubmit={handleFormSubmit} 
              onCancel={() => setIsEditing(false)}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Image
            src={student.profilePictureUrl || "https://placehold.co/128x128.png"}
            alt={`Foto de ${student.name}`}
            data-ai-hint="profile avatar"
            width={128}
            height={128}
            className="rounded-full border-4 border-primary shadow-md"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-primary">{student.name}</h2>
            <DetailItem icon={Mail} label="Email" value={student.email} />
            {student.phone && <DetailItem icon={Phone} label="Telefone" value={student.phone} />}
          </div>
        </div>
        
        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <SectionTitleDisplay icon={User}>Informações Pessoais Básicas</SectionTitleDisplay>
          <DetailItem icon={Cake} label="Data de Nascimento" value={student.dateOfBirth ? new Date(student.dateOfBirth + 'T00:00:00').toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : undefined} />
          <DetailItem icon={CalendarDays} label="Data de Início na Academia" value={new Date(student.joinDate + 'T00:00:00').toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />
          <DetailItem icon={Tag} label="Tipo de Plano (Academia)" value={formatDisplayValue(student.membershipType, membershipTypeMap)} />
          <DetailItem icon={Shield} label="Contato de Emergência" value={`${student.emergencyContactName || ''} ${student.emergencyContactPhone || ''}`.trim() || undefined} />

          <SectionTitleDisplay icon={Contact}>Informações Pessoais Detalhadas</SectionTitleDisplay>
          <DetailItem icon={Binary} label="Identidade de Gênero" value={formatDisplayValue(student.genderIdentity, genderIdentityMap)} />
          <DetailItem icon={HeartHandshake} label="Estado Civil" value={formatDisplayValue(student.maritalStatus, maritalStatusMap)} />
          <DetailItem icon={Users2} label="Possui filhos ou dependentes?" value={formatYesNoNotInformated(student.hasChildren)} />
          <DetailItem icon={Briefcase} label="Ocupação Atual" value={student.occupation} />
          <DetailItem icon={DollarSign} label="Renda Mensal Aproximada" value={formatDisplayValue(student.monthlyIncome, monthlyIncomeMap)} />
          <DetailItem icon={GraduationCap} label="Nível de Escolaridade" value={formatDisplayValue(student.educationLevel, educationLevelMap)} />
          <DetailItem icon={Snowflake} label="Gosta de Inverno?" value={formatYesNoNotInformated(student.likesWinter)} />
          

          <SectionTitleDisplay icon={Clock}>🕒 Rotina e Disponibilidade</SectionTitleDisplay>
          <DetailItem icon={Hourglass} label="Melhor horário para treinar" value={formatDisplayValue(student.bestTrainingTime, bestTrainingTimeMap)} />
          <DetailItem icon={CalendarDays} label="Dias por semana (pretensão)" value={student.daysPerWeek} />
          <DetailItem icon={Briefcase} label="Horário de Trabalho" value={formatDisplayValue(student.workSchedule, workScheduleMap)} />
          <DetailItem icon={Building2} label="Tempo de deslocamento até academia" value={student.commuteTime} />
          
          <SectionTitleDisplay icon={Target}>🧠 Motivação e Objetivos</SectionTitleDisplay>
          <DetailItem icon={TrendingUp} label="Principal Objetivo" value={formatDisplayValue(student.mainGoal, mainGoalMap)} />
          {student.mainGoal === "outro" && student.otherGoalDetail && (
            <DetailItem label="Detalhe do Outro Objetivo" value={student.otherGoalDetail} fullWidth />
          )}
          <DetailItem icon={Building2} label="Já frequentou academia antes?" value={formatYesNoNotInformated(student.attendedGymBefore)} />
          {student.attendedGymBefore === "sim" && (
            <>
              <DetailItem label="Tempo na academia anterior" value={student.previousGymDuration} />
              <DetailItem label="Motivo da saída da academia anterior" value={student.reasonForLeavingPreviousGym} fullWidth/>
            </>
          )}
          <DetailItem icon={HelpCircle} label="Dificuldades em manter rotina de treinos" value={student.trainingDifficulties} fullWidth/>

          <SectionTitleDisplay icon={HeartPulse}>🩺 Saúde e Condição Física</SectionTitleDisplay>
          <DetailItem icon={Shield} label="Restrições Médicas?" value={formatYesNoNotInformated(student.medicalRestrictions)} />
          {student.medicalRestrictions === "sim" && student.medicalRestrictionsDetail && (
            <DetailItem label="Detalhes das Restrições Médicas" value={student.medicalRestrictionsDetail} fullWidth/>
          )}
          <DetailItem icon={UsersIcon} label="Acompanhamento Profissional (Nutri, Médico)?" value={formatYesNoNotInformated(student.professionalFollowUp)} />
          <DetailItem icon={TrendingUp} label="Estado de Saúde Atual" value={formatDisplayValue(student.currentHealthStatus, currentHealthStatusMap)} />

          <SectionTitleDisplay icon={MessageCircle}>💬 Engajamento e Expectativa</SectionTitleDisplay>
          <DetailItem icon={Lightbulb} label="O que motiva a continuar treinando?" value={student.motivationSource} fullWidth />
          <DetailItem icon={AlertTriangle} label="Fatores que poderiam levar à desistência" value={student.potentialQuitFactors} fullWidth />
          <DetailItem icon={Smartphone} label="Gostaria de acompanhamento por app/mensagens?" value={formatYesNoNotInformated(student.wantsFollowUpApp)} />
          
          <SectionTitleDisplay icon={FileTextIcon}>🧾 Dados de Contrato (Opcional)</SectionTitleDisplay>
          <DetailItem icon={BookOpen} label="Plano Contratado (Duração)" value={formatDisplayValue(student.contractPlan, contractPlanMap)} />
          <DetailItem icon={CreditCard} label="Forma de Pagamento" value={formatDisplayValue(student.paymentMethod, paymentMethodMap)} />
        </div>
      </CardContent>
    </Card>
  );
}

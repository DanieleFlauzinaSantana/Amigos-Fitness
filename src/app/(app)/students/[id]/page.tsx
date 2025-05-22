
// src/app/(app)/students/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProfileDetailsSection } from './components/ProfileDetailsSection';
import { AttendanceSection } from './components/AttendanceSection';
import { DropoutPredictionSection } from './components/DropoutPredictionSection';
import { AbsenceNotificationSection } from './components/AbsenceNotificationSection';
import { StudentIdSection } from './components/StudentIdSection';
import { StudentSurveyResponseSection } from './components/StudentSurveyResponseSection';
import type { Student, AttendanceRecord, SurveyResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react'; // Adicionado Loader2
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { calculateConsecutiveAbsences } from '@/lib/utils';
// Removida a importação de ABSENCE_THRESHOLD de @/lib/config
import { getStudentById, updateStudent, updateStudentSurveyResponse } from '@/lib/studentService'; 
import { MOCK_SURVEY } from '@/lib/constants'; 
import { useAppSettings } from '@/contexts/AppSettingsContext'; // Importar AppSettingsContext

const CONSECUTIVE_ABSENCES_THRESHOLD_FOR_SURVEY_LINK = 5;

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const { toast } = useToast();
  const { settings, isLoadingSettings } = useAppSettings(); // Usar o hook para configurações

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoadingStudent, setIsLoadingStudent] = useState(true); // Renomeado para evitar conflito

  const fetchStudentData = useCallback(async () => {
    if (studentId) {
      setIsLoadingStudent(true);
      try {
        const foundStudent = await getStudentById(studentId);
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          console.warn("Aluno não encontrado no Firestore:", studentId);
          toast({ variant: "destructive", title: "Erro", description: "Aluno não encontrado." });
          router.push('/students'); 
        }
      } catch (error) {
        console.error("Erro ao buscar aluno do Firestore:", error);
        toast({ variant: "destructive", title: "Erro ao Carregar", description: "Não foi possível carregar os dados do aluno." });
        router.push('/students');
      } finally {
        setIsLoadingStudent(false);
      }
    }
  }, [studentId, router, toast]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);
  
  const handleAttendanceUpdate = useCallback(async (newAttendance: AttendanceRecord[]) => {
    if (student && settings) { // Garante que settings e student estejam carregados
      const oldMissedCount = student.missedClassesCount;
      // Calcula o novo número de faltas. A data de início é crucial aqui.
      const joinDateObj = new Date(student.joinDate + 'T00:00:00'); // Adiciona T00:00:00 para UTC
      const newMissedCount = newAttendance.filter(att => 
        !att.attended && new Date(att.date + 'T00:00:00') > joinDateObj
      ).length;

      const updatedStudentData: Partial<Omit<Student, 'id'>> = { 
        attendance: newAttendance,
        missedClassesCount: newMissedCount
      };
      
      try {
        const updatedStudentFromDb = await updateStudent(student.id, updatedStudentData);
        if (updatedStudentFromDb) {
          setStudent(updatedStudentFromDb); 

          if (updatedStudentFromDb.missedClassesCount >= settings.absenceThreshold && oldMissedCount < settings.absenceThreshold) {
            toast({
              title: "Alerta de Faltas para Admin (Simulação)",
              description: `O aluno ${updatedStudentFromDb.name} atingiu ${updatedStudentFromDb.missedClassesCount} faltas (limite: ${settings.absenceThreshold}).`,
              variant: "default",
              duration: 7000,
            });
          }

          const consecutiveAbsences = calculateConsecutiveAbsences(updatedStudentFromDb.attendance);
          if (consecutiveAbsences >= CONSECUTIVE_ABSENCES_THRESHOLD_FOR_SURVEY_LINK && !updatedStudentFromDb.latestSurveyResponse) {
             toast({
              title: "Lembrete de Envio de Pesquisa",
              description: `O aluno ${updatedStudentFromDb.name} teve ${consecutiveAbsences} faltas consecutivas. Considere enviar o link da pesquisa de satisfação.`,
              variant: "default",
              duration: 7000,
              action: (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (typeof window !== 'undefined' && MOCK_SURVEY?.id && student?.id) {
                      const surveyLink = `${window.location.origin}/surveys/${MOCK_SURVEY.id}/submit?studentId=${student.id}`;
                      window.open(surveyLink, '_blank');
                    } else {
                      toast({title: "Erro", description: "Não foi possível gerar o link da pesquisa."})
                    }
                  }}
                >
                  Abrir Pesquisa
                </Button>
              )
            });
          }
        }
      } catch (error) {
        console.error("Erro ao atualizar frequência do aluno:", error);
        toast({variant: "destructive", title: "Erro", description: "Não foi possível atualizar a frequência."});
      }
    } else if (!settings && !isLoadingSettings) {
        console.warn("[StudentDetailPage] Configurações não carregadas, não foi possível verificar o limite de faltas para o toast.");
    }
  }, [student, toast, router, settings, isLoadingSettings]); // Adicionado settings e isLoadingSettings às dependências

  const handleProfileUpdate = useCallback((updatedStudentFromDb: Student) => {
     setStudent(updatedStudentFromDb); 
     toast({
        title: "Perfil Atualizado!",
        description: `Os dados de ${updatedStudentFromDb.name} foram atualizados com sucesso.`,
     });
  }, [toast]);


  if (isLoadingStudent || isLoadingSettings) { // Verifica se o aluno OU as configurações estão carregando
    return (
      <div>
        <PageHeader title="Carregando Aluno..." />
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Carregando dados...</p>
        </div>
        <div className="space-y-6 mt-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!student) {
    // O redirecionamento já é feito em fetchStudentData, mas por segurança:
    return (
      <div>
        <PageHeader title="Aluno não encontrado" />
        <p>O perfil do aluno solicitado não foi encontrado ou não pôde ser carregado.</p>
        <Button onClick={() => router.push('/students')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Alunos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title={student.name} description={`Detalhes e gerenciamento para ${student.name}`}>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProfileDetailsSection student={student} onUpdateStudent={handleProfileUpdate} />
          <AttendanceSection studentId={student.id} initialAttendance={student.attendance} onAttendanceUpdate={handleAttendanceUpdate}/>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <StudentIdSection student={student} />
          <DropoutPredictionSection student={student} />
          <AbsenceNotificationSection student={student} />
          <StudentSurveyResponseSection student={student} />
        </div>
      </div>
    </div>
  );
}
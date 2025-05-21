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
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { calculateConsecutiveAbsences } from '@/lib/utils';
import { ABSENCE_THRESHOLD } from '@/lib/config';
// Removido localStorageUtils, usaremos studentService
import { getStudentById, updateStudent } from '@/lib/studentService'; 
import { MOCK_SURVEY } from '@/lib/constants'; 

const CONSECUTIVE_ABSENCES_THRESHOLD_FOR_SURVEY_LINK = 5;

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentData = useCallback(async () => {
    if (studentId) {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    }
  }, [studentId, router, toast]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);
  
  const handleAttendanceUpdate = useCallback(async (newAttendance: AttendanceRecord[]) => {
    if (student) {
      const oldMissedCount = student.missedClassesCount;
      const updatedStudentData: Partial<Omit<Student, 'id'>> = { 
        attendance: newAttendance,
        missedClassesCount: newAttendance.filter(att => !att.attended && new Date(att.date) > new Date(student.joinDate)).length
      };
      
      try {
        const updatedStudentFromDb = await updateStudent(student.id, updatedStudentData);
        if (updatedStudentFromDb) {
          setStudent(updatedStudentFromDb); // Atualiza o estado com os dados do DB

          if (updatedStudentFromDb.missedClassesCount >= ABSENCE_THRESHOLD && oldMissedCount < ABSENCE_THRESHOLD) {
            toast({
              title: "Alerta de Faltas para Admin (Simulação)",
              description: `O aluno ${updatedStudentFromDb.name} atingiu ${updatedStudentFromDb.missedClassesCount} faltas.`,
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
                    // Lógica para construir e abrir o link da pesquisa
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
    }
  }, [student, toast, router]);

  // Esta função é chamada pelo ProfileDetailsSection após o formulário de edição ser submetido e salvo.
  // Ela recebe o aluno atualizado (já vindo do studentService.updateStudent) e atualiza o estado local.
  const handleProfileUpdate = useCallback((updatedStudentFromDb: Student) => {
     setStudent(updatedStudentFromDb); // Atualiza o estado local com os dados retornados do DB/serviço
     toast({
        title: "Perfil Atualizado!",
        description: `Os dados de ${updatedStudentFromDb.name} foram atualizados com sucesso.`,
     });
  }, [toast]);


  if (isLoading) {
    return (
      <div>
        <PageHeader title="Carregando Aluno..." />
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <PageHeader title="Aluno não encontrado" />
        <p>O perfil do aluno solicitado não foi encontrado.</p>
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

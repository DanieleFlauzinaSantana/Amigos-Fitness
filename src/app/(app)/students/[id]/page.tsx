
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
import { getStudentsFromLocalStorage, saveStudentsToLocalStorage } from '@/lib/localStorageUtils';
import { MOCK_SURVEY } from '@/lib/constants'; // Para o link da pesquisa

const CONSECUTIVE_ABSENCES_THRESHOLD_FOR_SURVEY_LINK = 5;

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  useEffect(() => {
    const studentsFromStorage = getStudentsFromLocalStorage();
    setAllStudents(studentsFromStorage);
    if (studentId) {
      setIsLoading(true);
      const foundStudent = studentsFromStorage.find(s => s.id === studentId);
      if (foundStudent) {
        setStudent(foundStudent);
      } else {
        // Se não encontrar, pode ser útil redirecionar ou mostrar erro
        // Por enquanto, vamos manter como estava, mas idealmente trataria melhor
        console.warn("Aluno não encontrado no localStorage:", studentId);
        router.push('/students'); 
      }
      setIsLoading(false);
    }
  }, [studentId, router]);

  const updateStudentsInStorage = (updatedStudentsList: Student[]) => {
    setAllStudents(updatedStudentsList);
    saveStudentsToLocalStorage(updatedStudentsList);
  };

  const handleUpdateStudent = useCallback((updatedStudent: Student) => {
    setStudent(updatedStudent); // Atualiza o estado local do aluno sendo visualizado
    const studentIndex = allStudents.findIndex(s => s.id === updatedStudent.id);
    if (studentIndex !== -1) {
      const newStudentsList = [...allStudents];
      newStudentsList[studentIndex] = updatedStudent;
      updateStudentsInStorage(newStudentsList);
    }
  }, [allStudents]);
  
  const handleAttendanceUpdate = useCallback((newAttendance: AttendanceRecord[]) => {
    if (student) {
      const oldMissedCount = student.missedClassesCount;
      const updatedStudentData = { 
        ...student, 
        attendance: newAttendance,
        missedClassesCount: newAttendance.filter(att => !att.attended && new Date(att.date) > new Date(student.joinDate)).length
      };
      
      handleUpdateStudent(updatedStudentData); // Isso salvará no localStorage

      if (updatedStudentData.missedClassesCount >= ABSENCE_THRESHOLD && oldMissedCount < ABSENCE_THRESHOLD) {
        toast({
          title: "Alerta de Faltas para Admin (Simulação)",
          description: `O aluno ${updatedStudentData.name} atingiu ${updatedStudentData.missedClassesCount} faltas. Uma notificação seria enviada ao administrador.`,
          variant: "default",
          duration: 7000,
        });
      }

      const consecutiveAbsences = calculateConsecutiveAbsences(updatedStudentData.attendance);
      if (consecutiveAbsences >= CONSECUTIVE_ABSENCES_THRESHOLD_FOR_SURVEY_LINK && !student.latestSurveyResponse) {
         toast({
          title: "Lembrete de Envio de Pesquisa (Simulação)",
          description: `O aluno ${updatedStudentData.name} teve ${consecutiveAbsences} faltas consecutivas. Considere enviar o link da pesquisa de satisfação.`,
          variant: "default",
          duration: 7000,
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push(`/surveys/${MOCK_SURVEY.id}/submit?studentId=${student.id}`)}
            >
              Abrir Pesquisa
            </Button>
          )
        });
      }
    }
  }, [student, handleUpdateStudent, toast, router]);

  // Função para atualizar a resposta da pesquisa do aluno
  const handleSurveyResponseUpdate = useCallback((surveyResponse: SurveyResponse) => {
    if (student) {
      const updatedStudentData = {
        ...student,
        latestSurveyResponse: surveyResponse,
      };
      handleUpdateStudent(updatedStudentData);
    }
  }, [student, handleUpdateStudent]);


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
          <ProfileDetailsSection student={student} onUpdateStudent={handleUpdateStudent} />
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

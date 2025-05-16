// src/app/(app)/students/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProfileDetailsSection } from './components/ProfileDetailsSection';
import { AttendanceSection } from './components/AttendanceSection';
import { DropoutPredictionSection } from './components/DropoutPredictionSection';
import { AbsenceNotificationSection } from './components/AbsenceNotificationSection';
import { StudentIdSection } from './components/StudentIdSection'; // Importação atualizada
import { MOCK_STUDENTS } from '@/lib/constants';
import type { Student, AttendanceRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { calculateConsecutiveAbsences } from '@/lib/utils';
import { ABSENCE_THRESHOLD } from '@/lib/config';

const CONSECUTIVE_ABSENCES_THRESHOLD_FOR_SURVEY = 5;

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousMissedCount, setPreviousMissedCount] = useState<number | null>(null);


  useEffect(() => {
    if (studentId) {
      setIsLoading(true);
      setTimeout(() => {
        const foundStudent = MOCK_STUDENTS.find(s => s.id === studentId);
        if (foundStudent) {
          setStudent(foundStudent);
          setPreviousMissedCount(foundStudent.missedClassesCount);
        } else {
          router.push('/students'); 
        }
        setIsLoading(false);
      }, 500);
    }
  }, [studentId, router]);

  const handleUpdateStudent = useCallback((updatedStudent: Student) => {
    setStudent(updatedStudent);
    const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === updatedStudent.id);
    if (studentIndex !== -1) {
      MOCK_STUDENTS[studentIndex] = updatedStudent;
    }
  }, []);
  
  const handleAttendanceUpdate = useCallback((newAttendance: AttendanceRecord[]) => {
    if (student) {
      const oldMissedCount = student.missedClassesCount;
      const updatedStudentData = { 
        ...student, 
        attendance: newAttendance,
        missedClassesCount: newAttendance.filter(att => !att.attended && new Date(att.date) > new Date(student.joinDate)).length
      };
      setStudent(updatedStudentData);
      handleUpdateStudent(updatedStudentData);

      // Simulação de Notificação ao Admin por Faltas Acumuladas
      if (updatedStudentData.missedClassesCount >= ABSENCE_THRESHOLD && oldMissedCount < ABSENCE_THRESHOLD) {
        toast({
          title: "Alerta de Faltas para Admin (Simulação)",
          description: `O aluno ${updatedStudentData.name} atingiu ${updatedStudentData.missedClassesCount} faltas. Uma notificação seria enviada ao administrador.`,
          variant: "default",
          duration: 7000,
        });
      }

      // Simulação de Envio de Pesquisa por Faltas Consecutivas
      const consecutiveAbsences = calculateConsecutiveAbsences(updatedStudentData.attendance);
      if (consecutiveAbsences >= CONSECUTIVE_ABSENCES_THRESHOLD_FOR_SURVEY) {
         // Para evitar spam, idealmente você guardaria um estado se a pesquisa já foi enviada por esta sequência.
         // Por simplicidade, vamos apenas mostrar o toast.
         toast({
          title: "Envio de Pesquisa (Simulação)",
          description: `O aluno ${updatedStudentData.name} teve ${consecutiveAbsences} faltas consecutivas. A pesquisa de satisfação seria enviada automaticamente.`,
          variant: "default",
          duration: 7000,
        });
      }
    }
  }, [student, handleUpdateStudent, toast]);


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
          <StudentIdSection student={student} /> {/* Componente atualizado */}
          <DropoutPredictionSection student={student} />
          <AbsenceNotificationSection student={student} />
        </div>
      </div>
    </div>
  );
}

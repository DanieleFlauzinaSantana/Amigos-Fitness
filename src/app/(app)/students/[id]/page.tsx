"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProfileDetailsSection } from './components/ProfileDetailsSection';
import { AttendanceSection } from './components/AttendanceSection';
import { DropoutPredictionSection } from './components/DropoutPredictionSection';
import { AbsenceNotificationSection } from './components/AbsenceNotificationSection';
import { MOCK_STUDENTS } from '@/lib/constants';
import type { Student, AttendanceRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      // Simulate fetching student data
      setIsLoading(true);
      setTimeout(() => {
        const foundStudent = MOCK_STUDENTS.find(s => s.id === studentId);
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          // Handle student not found, e.g., redirect or show error
          router.push('/students'); 
        }
        setIsLoading(false);
      }, 500);
    }
  }, [studentId, router]);

  const handleUpdateStudent = useCallback((updatedStudent: Student) => {
    setStudent(updatedStudent);
    // In a real app, you'd also update the MOCK_STUDENTS array or backend
    const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === updatedStudent.id);
    if (studentIndex !== -1) {
      MOCK_STUDENTS[studentIndex] = updatedStudent;
    }
  }, []);
  
  const handleAttendanceUpdate = useCallback((newAttendance: AttendanceRecord[]) => {
    if (student) {
      const updatedStudent = { 
        ...student, 
        attendance: newAttendance,
        missedClassesCount: newAttendance.filter(att => !att.attended && new Date(att.date) > new Date(student.joinDate)).length // Recalculate
      };
      setStudent(updatedStudent);
      handleUpdateStudent(updatedStudent); // To update the mock data source
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

      <ProfileDetailsSection student={student} onUpdateStudent={handleUpdateStudent} />
      <AttendanceSection studentId={student.id} initialAttendance={student.attendance} onAttendanceUpdate={handleAttendanceUpdate}/>
      <DropoutPredictionSection student={student} />
      <AbsenceNotificationSection student={student} />
    </div>
  );
}

// src/app/(app)/predictions/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { DropoutPredictionSection } from '@/app/(app)/students/[id]/components/DropoutPredictionSection';
import { AbsenceNotificationSection } from '@/app/(app)/students/[id]/components/AbsenceNotificationSection';
import { MOCK_STUDENTS } from '@/lib/constants';
import type { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentPredictionFocusPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      setIsLoading(true);
      // Simular busca de dados
      setTimeout(() => {
        const foundStudent = MOCK_STUDENTS.find(s => s.id === studentId);
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          // Idealmente, mostrar uma página de não encontrado ou redirecionar
          console.error("Aluno não encontrado para predição:", studentId);
          router.push('/predictions'); 
        }
        setIsLoading(false);
      }, 300);
    }
  }, [studentId, router]);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Carregando Análise do Aluno..." />
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <PageHeader title="Aluno não encontrado" description="Não foi possível carregar os dados para análise."/>
        <div className="flex items-center text-red-600 p-4 border border-red-200 bg-red-50 rounded-md">
            <AlertTriangle className="mr-2 h-5 w-5"/>
            <p>O perfil do aluno solicitado para análise não foi encontrado.</p>
        </div>
        <Button onClick={() => router.push('/predictions')} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Análise
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title={`Análise: ${student.name}`} description={`Foco em previsão de desistência e notificação de ausência para ${student.name}.`}>
        <Button onClick={() => router.push('/predictions')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DropoutPredictionSection student={student} />
        <AbsenceNotificationSection student={student} />
      </div>
    </div>
  );
}

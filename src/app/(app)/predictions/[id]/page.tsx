// src/app/(app)/predictions/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { DropoutPredictionSection } from '@/app/(app)/students/[id]/components/DropoutPredictionSection';
import { AbsenceNotificationSection } from '@/app/(app)/students/[id]/components/AbsenceNotificationSection';
import type { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getStudentById } from '@/lib/studentService'; // Importar de studentService
import { useToast } from '@/hooks/use-toast';

export default function StudentPredictionFocusPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      const fetchStudent = async () => {
        console.log(`[StudentPredictionFocusPage] Fetching student with ID: ${studentId} from Firestore.`);
        setIsLoading(true);
        try {
          const foundStudent = await getStudentById(studentId);
          if (foundStudent) {
            console.log(`[StudentPredictionFocusPage] Student found:`, foundStudent);
            setStudent(foundStudent);
          } else {
            console.error("[StudentPredictionFocusPage] Aluno não encontrado no Firestore para predição:", studentId);
            toast({
              variant: "destructive",
              title: "Aluno Não Encontrado",
              description: `Não foi possível carregar dados para o aluno com ID: ${studentId}. Redirecionando...`,
            });
            router.push('/predictions'); 
          }
        } catch (error) {
            console.error("[StudentPredictionFocusPage] Erro ao buscar aluno do Firestore:", error);
            toast({
              variant: "destructive",
              title: "Erro ao Carregar Aluno",
              description: "Ocorreu um erro ao buscar os dados do aluno.",
            });
            router.push('/predictions');
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudent();
    }
  }, [studentId, router, toast]); // Adicionado toast às dependências

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Carregando Análise do Aluno..." />
        <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Buscando dados do aluno no Firestore...</p>
        </div>
        <div className="space-y-6 mt-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!student) {
    // Este estado geralmente não deveria ser alcançado se o useEffect redireciona em caso de não encontrar
    // Mas é uma salvaguarda.
    return (
      <div>
        <PageHeader title="Aluno não encontrado" description="Não foi possível carregar os dados para análise."/>
        <div className="flex items-center text-destructive p-4 border border-destructive/20 bg-destructive/10 rounded-md my-4">
            <AlertTriangle className="mr-2 h-5 w-5"/>
            <p>O perfil do aluno solicitado para análise não foi encontrado ou ocorreu um erro ao carregá-lo.</p>
        </div>
        <Button onClick={() => router.push('/predictions')} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Análise
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title={`Análise de Risco: ${student.name}`} description={`Foco em previsão de desistência e notificação de ausência para ${student.name}.`}>
        <Button onClick={() => router.push('/predictions')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Análise
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DropoutPredictionSection student={student} />
        <AbsenceNotificationSection student={student} />
      </div>
    </div>
  );
}

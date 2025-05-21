"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentTable } from "./components/StudentTable";
import { AddStudentDialog } from "./components/AddStudentDialog";
import type { Student } from "@/lib/types";
import { getStudents, addStudent as addStudentService } from "@/lib/studentService"; 
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedStudents = await getStudents(); // Agora busca do Firestore
      setStudents(loadedStudents);
    } catch (error) {
      console.error("Erro ao carregar alunos do Firestore:", error);
      toast({
        variant: "destructive",
        title: "Erro ao Carregar Alunos",
        description: "Não foi possível buscar os dados dos alunos. Tente recarregar a página.",
      });
      setStudents([]); // Define como vazio em caso de erro
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleStudentAdded = async (
    newStudentData: Omit<Student, 'id' | 'attendance' | 'missedClassesCount' | 'profilePictureUrl' | 'latestSurveyResponse'>
  ) => {
    try {
      // studentService.addStudent agora salva no Firestore e retorna o aluno completo com ID
      const addedStudent = await addStudentService(newStudentData);
      // Atualiza o estado local para refletir a adição imediatamente na UI
      // Poderia também refazer o fetchStudents(), mas adicionar diretamente é mais rápido para a UI
      setStudents(prevStudents => [addedStudent, ...prevStudents].sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()));
      toast({
        title: "Aluno Adicionado!",
        description: `${addedStudent.name} foi cadastrado com sucesso no Firestore.`,
      });
    } catch (error) {
      console.error("Erro ao adicionar aluno via studentService:", error);
      toast({
        variant: "destructive",
        title: "Erro ao Adicionar",
        description: "Não foi possível adicionar o aluno. Verifique o console para mais detalhes.",
      });
    }
  };

  return (
    <div>
      <PageHeader title="Gerenciamento de Alunos" description="Visualize e gerencie os perfis dos seus alunos.">
        <AddStudentDialog onStudentAdded={handleStudentAdded} />
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            Encontre todos os alunos cadastrados na academia (dados do Firestore).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <p>Carregando alunos do Firestore...</p>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : students.length > 0 ? (
            <StudentTable students={students} />
          ) : (
            <p>Nenhum aluno cadastrado ainda no Firestore.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

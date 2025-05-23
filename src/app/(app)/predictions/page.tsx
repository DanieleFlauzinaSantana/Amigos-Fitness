
// src/app/(app)/predictions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentTable } from "@/app/(app)/students/components/StudentTable";
import type { Student } from "@/lib/types";
import { AlertTriangle } from "lucide-react";
import { getStudents } from "@/lib/studentService"; // Importar de studentService

export default function PredictionsListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const loadedStudents = await getStudents(); // Buscar do Firestore
        setStudents(loadedStudents);
      } catch (error) {
        console.error("Erro ao carregar alunos para predição:", error);
        setStudents([]); // Define como vazio em caso de erro
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div>
      <PageHeader 
        title="Análise de Risco de Desistência" 
        description="Selecione um aluno abaixo para analisar o risco de desistência e gerar notificações de ausência."
      />
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos para Análise</CardTitle>
          <CardDescription>
            Clique no nome de um aluno para acessar as ferramentas de previsão e notificação. Os dados são carregados do Firestore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando alunos do Firestore...</p>
          ) : students.length > 0 ? (
            <StudentTable students={students} linkBasePath="/predictions" />
          ) : (
            <p className="flex items-center text-muted-foreground">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                Nenhum aluno cadastrado no Firestore para análise.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

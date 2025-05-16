"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentTable } from "./components/StudentTable";
import { AddStudentDialog } from "./components/AddStudentDialog";
import { MOCK_STUDENTS } from "@/lib/constants";
import type { Student } from "@/lib/types";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setStudents(MOCK_STUDENTS);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleStudentAdded = (newStudent: Student) => {
    setStudents(prevStudents => [newStudent, ...prevStudents]);
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
            Encontre todos os alunos cadastrados na academia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando alunos...</p>
          ) : students.length > 0 ? (
            <StudentTable students={students} />
          ) : (
            <p>Nenhum aluno cadastrado ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

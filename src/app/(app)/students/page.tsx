
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
    // When the page loads (or re-loads after navigation),
    // it sets the students state from the current MOCK_STUDENTS array.
    // If MOCK_STUDENTS was mutated (e.g., by adding a new student),
    // that change should be reflected here.
    setTimeout(() => {
      setStudents([...MOCK_STUDENTS]); // Use spread to ensure a new array reference for react state
      setIsLoading(false);
    }, 300); // Reduced delay
  }, []);

  const handleStudentAdded = (newStudent: Student) => {
    // Update the MOCK_STUDENTS array directly.
    // This change will persist in memory for the current session.
    MOCK_STUDENTS.unshift(newStudent);
    
    // Update the local state for immediate UI refresh
    // Re-read from MOCK_STUDENTS to ensure consistency if other direct mutations happened
    setStudents([...MOCK_STUDENTS]); 
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


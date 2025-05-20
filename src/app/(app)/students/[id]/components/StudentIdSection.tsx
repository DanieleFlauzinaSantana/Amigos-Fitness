// src/app/(app)/students/[id]/components/StudentIdSection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Student } from '@/lib/types';
import { Fingerprint } from 'lucide-react';

interface StudentIdSectionProps {
  student: Student;
}

export function StudentIdSection({ student }: StudentIdSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Fingerprint className="mr-2 h-6 w-6 text-primary" /> Número de Inscrição
        </CardTitle>
        <CardDescription>Este é o número de inscrição único do aluno.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-muted rounded-lg w-full text-center">
          <p className="text-sm text-muted-foreground">Nº de Inscrição do Aluno:</p>
          <p className="text-2xl font-bold text-primary">{student.id}</p>
        </div>
        <p className="text-xs text-center text-muted-foreground max-w-xs">
          O aluno pode usar este número para realizar o check-in na recepção ou em totens de autoatendimento.
        </p>
      </CardContent>
    </Card>
  );
}

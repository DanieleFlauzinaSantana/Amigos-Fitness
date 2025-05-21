// src/app/(app)/checkin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Student, AttendanceRecord } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ClipboardCheck, CheckCircle } from 'lucide-react';
import { getStudentById, updateStudent } from '@/lib/studentService'; // Alterado para usar studentService

export default function CheckinPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [studentIdInput, setStudentIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Removido o estado allStudents, pois não vamos mais carregar todos os alunos aqui.

  const handleCheckin = async () => {
    if (!studentIdInput.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campo Obrigatório',
        description: 'Por favor, insira seu Número de Inscrição.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const studentId = studentIdInput.trim();
      const student = await getStudentById(studentId);

      if (!student) {
        toast({
          variant: 'destructive',
          title: 'Aluno Não Encontrado',
          description: `Nenhum aluno encontrado com o Número de Inscrição: ${studentId}. Verifique o número e tente novamente.`,
        });
        setIsLoading(false);
        return;
      }

      const todayFormatted = format(new Date(), 'yyyy-MM-dd');
      const hasCheckedInToday = student.attendance.some(
        record => record.date === todayFormatted && record.attended
      );

      if (hasCheckedInToday) {
        toast({
          variant: 'default',
          title: 'Check-in já Realizado',
          description: `${student.name}, seu check-in de hoje já foi registrado.`,
        });
        setIsLoading(false);
        return;
      }

      const newAttendanceRecord: AttendanceRecord = { date: todayFormatted, attended: true };
      // Adiciona o novo registro e remove qualquer registro anterior para o mesmo dia (caso exista um com attended: false)
      const updatedAttendanceUnsorted = [
        ...student.attendance.filter(record => record.date !== todayFormatted),
        newAttendanceRecord
      ];
      // Ordena para manter a consistência (mais recentes primeiro)
      const updatedAttendance = updatedAttendanceUnsorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


      const newMissedClassesCount = updatedAttendance.filter(att => !att.attended && new Date(att.date) > new Date(student.joinDate)).length;

      const updatedStudentData: Partial<Omit<Student, 'id'>> = {
        attendance: updatedAttendance,
        missedClassesCount: newMissedClassesCount,
      };

      const updatedStudent = await updateStudent(student.id, updatedStudentData);

      if (updatedStudent) {
        toast({
          title: 'Check-in Confirmado!',
          description: `Olá ${updatedStudent.name}! Sua presença foi registrada para ${format(new Date(), 'dd/MM/yyyy')}.`,
        });
        setStudentIdInput('');
      } else {
        // Isso não deveria acontecer se updateStudent estiver correto e o aluno existir
        toast({
          variant: 'destructive',
          title: 'Erro ao Salvar Check-in',
          description: 'Não foi possível salvar o check-in. Tente novamente.',
        });
      }
    } catch (error) {
      console.error("Erro ao processar check-in:", error);
      toast({
        variant: 'destructive',
        title: 'Erro no Check-in',
        description: 'Ocorreu um erro ao registrar sua presença. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Registro de Presença" 
        description="Aluno, digite seu Número de Inscrição para registrar sua presença hoje."
      />
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><ClipboardCheck className="mr-2 h-6 w-6 text-primary" /> Bem-vindo(a)!</CardTitle>
          <CardDescription>
            Use o teclado para inserir seu Número de Inscrição abaixo e confirme seu check-in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentId">Seu Número de Inscrição</Label>
            <Input
              id="studentId"
              placeholder="Digite seu Número de Inscrição aqui"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              disabled={isLoading}
              autoFocus 
            />
          </div>
          <Button onClick={handleCheckin} className="w-full" disabled={isLoading} size="lg">
            {isLoading ? (
              "Registrando..."
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" /> Confirmar Check-in
              </>
            )}
          </Button>
           <p className="text-xs text-center text-muted-foreground pt-4">
            Esta página é ideal para totens de autoatendimento na entrada da academia. 
            Se precisar de ajuda, procure um instrutor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

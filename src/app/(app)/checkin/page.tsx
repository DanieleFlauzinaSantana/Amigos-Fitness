// src/app/(app)/checkin/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MOCK_STUDENTS } from '@/lib/constants';
import type { Student, AttendanceRecord } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ClipboardCheck, CheckCircle, XCircle } from 'lucide-react';

export default function CheckinPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [studentIdInput, setStudentIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckin = () => {
    if (!studentIdInput.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campo Obrigatório',
        description: 'Por favor, insira seu Número de Inscrição.',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentIdInput.trim());

      if (studentIndex === -1) {
        toast({
          variant: 'destructive',
          title: 'Aluno Não Encontrado',
          description: `Nenhum aluno encontrado com o Número de Inscrição: ${studentIdInput}. Verifique o número e tente novamente.`,
        });
        setIsLoading(false);
        return;
      }

      const student = MOCK_STUDENTS[studentIndex];
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
        // Poderia redirecionar para uma página de boas-vindas ou manter na mesma.
        // router.push(`/students/${student.id}`); 
        return;
      }

      const newAttendanceRecord: AttendanceRecord = { date: todayFormatted, attended: true };
      const updatedAttendance = [
        ...student.attendance.filter(record => record.date !== todayFormatted),
        newAttendanceRecord
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const updatedStudent: Student = {
        ...student,
        attendance: updatedAttendance,
      };

      MOCK_STUDENTS[studentIndex] = updatedStudent;

      toast({
        title: 'Check-in Confirmado!',
        description: `Olá ${student.name}! Sua presença foi registrada para ${format(new Date(), 'dd/MM/yyyy')}.`,
        // Ação de ver aluno pode não ser relevante para o aluno fazendo check-in.
        // action: (
        //   <Button variant="outline" size="sm" onClick={() => router.push(`/students/${student.id}`)}>
        //     Ver Aluno
        //   </Button>
        // ),
      });
      
      setStudentIdInput(''); 
      setIsLoading(false);
    }, 700); 
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
              // Adicionando autoFocus para conveniência em totens
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

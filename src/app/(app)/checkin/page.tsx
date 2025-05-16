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
import { ScanLine, CheckCircle, XCircle } from 'lucide-react';

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
        description: 'Por favor, insira o ID do aluno.',
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
          description: `Nenhum aluno encontrado com o ID: ${studentIdInput}.`,
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
          description: `${student.name} já realizou o check-in hoje.`,
        });
        setIsLoading(false);
        router.push(`/students/${student.id}`);
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
        // Recalcular missedClassesCount pode ser complexo aqui sem mais contexto de como as faltas são atribuídas
        // Por simplicidade, não vamos recalcular missedClassesCount aqui, mas em uma app real seria importante.
      };

      MOCK_STUDENTS[studentIndex] = updatedStudent;

      toast({
        title: 'Check-in Confirmado!',
        description: `Presença registrada para ${student.name} em ${format(new Date(), 'dd/MM/yyyy')}.`,
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push(`/students/${student.id}`)}>
            Ver Aluno
          </Button>
        ),
      });
      
      setStudentIdInput(''); // Limpar campo
      setIsLoading(false);
      // Opcionalmente, redirecionar: router.push(`/students/${student.id}`);

    }, 700); // Simular latência da rede
  };

  return (
    <div>
      <PageHeader 
        title="Check-in por QR Code (Simulado)" 
        description="Insira o ID do aluno (que seria lido de um QR Code) para registrar a presença."
      />
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><ScanLine className="mr-2 h-6 w-6 text-primary" /> Registrar Presença</CardTitle>
          <CardDescription>
            Após "ler" o QR Code do aluno, insira o ID abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentId">ID do Aluno</Label>
            <Input
              id="studentId"
              placeholder="Digite o ID do aluno"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleCheckin} className="w-full" disabled={isLoading}>
            {isLoading ? (
              "Registrando..."
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" /> Confirmar Check-in
              </>
            )}
          </Button>
           <p className="text-xs text-center text-muted-foreground pt-4">
            Esta página simula a leitura de um QR Code. Em uma implementação real, um leitor de QR Code preencheria o ID do aluno automaticamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

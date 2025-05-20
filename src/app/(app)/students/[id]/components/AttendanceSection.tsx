"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle, XCircle, CalendarDays } from "lucide-react";
import type { Student, AttendanceRecord } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isSameDay } from 'date-fns';

interface AttendanceSectionProps {
  studentId: string;
  initialAttendance: AttendanceRecord[];
  onAttendanceUpdate: (newAttendance: AttendanceRecord[]) => void;
}

export function AttendanceSection({ studentId, initialAttendance, onAttendanceUpdate }: AttendanceSectionProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');

  const hasCheckedInToday = attendance.some(record => record.date === todayFormatted && record.attended);

  const handleCheckIn = () => {
    const newAttendanceRecord: AttendanceRecord = { date: todayFormatted, attended: true };
    const updatedAttendance = [
      ...attendance.filter(record => record.date !== todayFormatted), // Remove any existing record for today
      newAttendanceRecord
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

    setAttendance(updatedAttendance);
    onAttendanceUpdate(updatedAttendance); // Propagate update to parent

    toast({
      title: "Check-in Registrado!",
      description: `Presença registrada para ${format(today, 'dd/MM/yyyy')}.`,
    });
  };
  
  const attendedDays = attendance.filter(a => a.attended).map(a => parseISO(a.date));
  const missedDays = attendance.filter(a => !a.attended).map(a => parseISO(a.date));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-6 w-6 text-primary" /> Controle de Frequência</CardTitle>
        <CardDescription>Registre e visualize a frequência do aluno.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-muted/30">
          <div>
            <h3 className="text-lg font-semibold">Registrar Presença Hoje ({format(today, 'dd/MM/yyyy')})</h3>
            {hasCheckedInToday && <p className="text-sm text-green-600">Check-in já realizado para hoje.</p>}
          </div>
          <Button onClick={handleCheckIn} disabled={hasCheckedInToday} size="lg">
            <CheckCircle className="mr-2 h-5 w-5" />
            {hasCheckedInToday ? "Check-in Feito" : "Confirmar Check-in"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Calendário de Frequência</h4>
            <Calendar
              mode="multiple"
              selected={attendedDays}
              onSelect={() => {}} // Calendar is display-only for past selection
              defaultMonth={selectedDate}
              className="rounded-md border"
              disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
              modifiers={{
                attended: attendedDays,
                missed: missedDays,
              }}
              modifiersStyles={{
                attended: { backgroundColor: 'hsl(var(--primary)/0.2)', color: 'hsl(var(--primary))' },
                missed: { backgroundColor: 'hsl(var(--destructive)/0.2)', color: 'hsl(var(--destructive))', textDecoration: 'line-through' },
              }}
            />
             <div className="mt-2 flex space-x-4">
              <div className="flex items-center space-x-1 text-xs">
                <div className="h-3 w-3 rounded-full" style={{backgroundColor: 'hsl(var(--primary)/0.2)'}} />
                <span>Presente</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <div className="h-3 w-3 rounded-full" style={{backgroundColor: 'hsl(var(--destructive)/0.2)'}}/>
                <span>Faltou</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Histórico Recente</h4>
            {attendance.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum registro de frequência.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {attendance.map((record) => (
                  <li key={record.date} className={`flex items-center justify-between p-2 rounded-md text-sm ${record.attended ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    <span>{format(parseISO(record.date), 'dd/MM/yyyy')}</span>
                    {record.attended ? (
                      <span className="flex items-center text-green-700 dark:text-green-400"><CheckCircle className="mr-1 h-4 w-4" /> Presente</span>
                    ) : (
                      <span className="flex items-center text-red-700 dark:text-red-400"><XCircle className="mr-1 h-4 w-4" /> Faltou</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

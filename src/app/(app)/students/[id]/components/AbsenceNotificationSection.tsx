"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { sendAbsenceNotification, type SendAbsenceNotificationInput, type SendAbsenceNotificationOutput } from '@/ai/flows/send-absence-notification';
import type { Student } from '@/lib/types';
import { MOCK_SURVEY } from '@/lib/constants'; 
import { BellRing, MessageSquare, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppSettings } from '@/contexts/AppSettingsContext';

interface AbsenceNotificationSectionProps {
  student: Student;
}

export function AbsenceNotificationSection({ student }: AbsenceNotificationSectionProps) {
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [origin, setOrigin] = useState('');
  const { settings, isLoadingSettings } = useAppSettings();

  // Log para depuração
  console.log("[AbsenceNotificationSection] Received settings:", settings, "isLoadingSettings:", isLoadingSettings);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const getLastAttendanceDate = () => {
    const attendedRecords = student.attendance
      .filter(att => att.attended)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return attendedRecords.length > 0 ? attendedRecords[0].date : student.joinDate;
  };

  const handleSendNotification = async () => {
    if (!settings) {
      setError("Configurações da academia não carregadas. Tente novamente mais tarde.");
      setIsLoading(false); // Adicionado para parar o loading
      return;
    }
    setIsLoading(true);
    setError(null);
    setNotificationMessage(null);

    if (!origin) {
        setError("Não foi possível determinar a URL base para o link da pesquisa. Tente novamente.");
        setIsLoading(false);
        return;
    }
    
    const surveyLinkForStudent = `${origin}/surveys/${MOCK_SURVEY.id}/submit?studentId=${student.id}`;

    const input: SendAbsenceNotificationInput = {
      studentName: student.name,
      studentId: student.id,
      lastAttendanceDate: getLastAttendanceDate(),
      missedClassesCount: student.missedClassesCount,
      gymName: "Academia Força Local", 
      gymContactInformation: settings.gymContactInfo, 
      surveyLink: surveyLinkForStudent,
    };

    try {
      const result: SendAbsenceNotificationOutput = await sendAbsenceNotification(input);
      setNotificationMessage(result.notificationMessage);
      toast({
        title: "Mensagem Gerada!",
        description: "A mensagem de notificação foi gerada pela IA.",
      });
    } catch (e) {
      console.error("Erro ao gerar notificação de ausência:", e);
      setError("Falha ao gerar a mensagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoadingSettings || !settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><MessageSquare className="mr-2 h-6 w-6 text-primary" /> Notificação de Ausência (IA)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
          <p className="text-muted-foreground">Carregando configurações...</p>
        </CardContent>
      </Card>
    );
  }

  const canSendNotification = student.missedClassesCount >= settings.absenceThreshold;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><MessageSquare className="mr-2 h-6 w-6 text-primary" /> Notificação de Ausência (IA)</CardTitle>
        <CardDescription>Envie uma mensagem personalizada para alunos ausentes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg bg-muted/30">
          <p className="text-sm font-medium">Aulas Perdidas: <span className="font-bold text-lg text-destructive">{student.missedClassesCount}</span></p>
          <p className="text-xs text-muted-foreground">Última presença: {new Date(getLastAttendanceDate() + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
          <p className="text-xs text-muted-foreground mt-1">Limite para notificação: {settings.absenceThreshold} faltas</p>
        </div>

        {canSendNotification ? (
          <Button onClick={handleSendNotification} disabled={isLoading || !origin}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Gerando Mensagem..." : "Gerar Mensagem de Notificação"}
            {!origin && isLoading && <span className="text-xs ml-2">(Aguardando URL base...)</span>}
          </Button>
        ) : (
          <Alert variant="default" className="border-primary/50">
             <Check className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Tudo Certo!</AlertTitle>
            <AlertDescription>
              O aluno não atingiu o limite de faltas ({settings.absenceThreshold}) para sugerir uma notificação.
            </AlertDescription>
          </Alert>
        )}

        {isLoading && <p className="flex items-center justify-center text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin mr-2" />Gerando mensagem, por favor aguarde...</p>}
        {error && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        
        {notificationMessage && (
          <Card className="bg-background shadow-inner">
            <CardHeader>
              <CardTitle className="text-lg">Mensagem Sugerida pela IA:</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-wrap p-4 border rounded-md bg-accent/10">{notificationMessage}</p>
              <Button className="mt-4" onClick={() => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(notificationMessage)
                    .then(() => {
                        toast({ title: "Mensagem Copiada!", description: "A mensagem foi copiada para a área de transferência."});
                    })
                    .catch(err => {
                        console.error('Falha ao copiar o link: ', err);
                        toast({ variant: "destructive", title: "Falha ao Copiar", description: "Não foi possível copiar o link automaticamente."});
                    });
                } else {
                    toast({ variant: "destructive", title: "Cópia Indisponível", description: "Seu navegador não suporta esta funcionalidade de cópia."});
                }
              }}>
                <BellRing className="mr-2 h-4 w-4" /> Copiar Mensagem e Simular Envio
              </Button>
               <p className="text-xs text-muted-foreground mt-2">Em uma aplicação real, isso integraria com WhatsApp/Email.</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

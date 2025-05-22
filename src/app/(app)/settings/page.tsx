// src/app/(app)/settings/page.tsx
"use client";

import { useState, useEffect, FormEvent } from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Info, Bell, Save, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import type { AppSettings } from '@/lib/configService';
import { updateAppSettings } from '@/lib/configService';
import { useAppSettings } from '@/contexts/AppSettingsContext';

export default function SettingsPage() {
  const { toast } = useToast();
  const { settings: appSettingsFromContext, isLoadingSettings: isLoadingContext, refetchSettings, errorSettings } = useAppSettings();

  const [gymNameInput, setGymNameInput] = useState('');
  const [gymContactInput, setGymContactInput] = useState('');
  const [absenceThresholdInput, setAbsenceThresholdInput] = useState<number | string>(''); // Inicializa como string vazia
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log("[SettingsPage] useEffect with context settings:", appSettingsFromContext, "isLoadingContext:", isLoadingContext);
    if (appSettingsFromContext && !isLoadingContext) {
      // Só atualiza os inputs se os valores do contexto forem diferentes dos atuais nos inputs
      // ou se os inputs estiverem vazios (primeira carga)
      if (gymNameInput === '' || appSettingsFromContext.gymName !== gymNameInput) {
        setGymNameInput(appSettingsFromContext.gymName);
      }
      if (gymContactInput === '' || appSettingsFromContext.gymContactInfo !== gymContactInput) {
        setGymContactInput(appSettingsFromContext.gymContactInfo);
      }
      // Garante que absenceThresholdInput seja uma string para o input type="number"
      const thresholdFromContext = String(appSettingsFromContext.absenceThreshold);
      if (absenceThresholdInput === '' || thresholdFromContext !== String(absenceThresholdInput)) {
        setAbsenceThresholdInput(thresholdFromContext);
      }
    } else if (!isLoadingContext && !appSettingsFromContext && !errorSettings) {
        // Se não está carregando, não tem settings do contexto e não tem erro, usa defaults (já feito pelo context, mas como segurança)
        console.log("[SettingsPage] useEffect: No context settings, no error, using defaults for inputs");
        setGymNameInput("Academia Padrão");
        setGymContactInput("contato@padrao.com");
        setAbsenceThresholdInput("3");
    }
  }, [appSettingsFromContext, isLoadingContext, errorSettings]); // Removidos os inputs da dependência para evitar loops


  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    console.log("[SettingsPage] handleSaveSettings - Valores atuais dos inputs ANTES DE SALVAR:", { gymNameInput, gymContactInput, absenceThresholdInput });

    const threshold = Number(absenceThresholdInput);
    if (isNaN(threshold) || threshold < 0) { // Permite 0, mas o input tem min="1"
      toast({
        variant: "destructive",
        title: "Valor Inválido",
        description: "O limite de faltas deve ser um número igual ou maior que zero.",
      });
      setIsSaving(false);
      return;
    }

    const settingsToSave: AppSettings = {
      gymName: gymNameInput.trim(),
      gymContactInfo: gymContactInput.trim(),
      absenceThreshold: threshold,
    };
    console.log("[SettingsPage] handleSaveSettings - Objeto settingsToSave a ser enviado:", settingsToSave);

    const success = await updateAppSettings(settingsToSave);

    if (success) {
      toast({
        title: "Configurações Salvas!",
        description: "As novas configurações foram salvas no Firestore.",
      });
      // ATUALIZA OS INPUTS LOCAIS IMEDIATAMENTE com os valores que foram salvos
      setGymNameInput(settingsToSave.gymName);
      setGymContactInput(settingsToSave.gymContactInfo);
      setAbsenceThresholdInput(String(settingsToSave.absenceThreshold)); // Converte para string para o input
      console.log("[SettingsPage] handleSaveSettings - Inputs atualizados localmente IMEDIATAMENTE para:", settingsToSave);
      
      // Refaz o fetch das configurações para atualizar o contexto global
      console.log("[SettingsPage] handleSaveSettings - Chamando refetchSettings...");
      await refetchSettings();
      console.log("[SettingsPage] handleSaveSettings - refetchSettings chamado e concluído.");
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao Salvar",
        description: "Não foi possível salvar as configurações. Verifique os logs.",
      });
    }
    setIsSaving(false);
  };

  if (isLoadingContext && !appSettingsFromContext) { // Mostra carregando apenas se appSettingsFromContext ainda for null
    return (
      <div>
        <PageHeader 
          title="Configurações do Sistema" 
          description="Gerencie as configurações gerais da aplicação Amigos Fitness."
        />
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Carregando configurações...</p>
        </div>
      </div>
    );
  }
  
  if (errorSettings && !appSettingsFromContext) { // Mostra erro apenas se appSettingsFromContext ainda for null
     return (
      <div>
        <PageHeader 
          title="Configurações do Sistema" 
          description="Gerencie as configurações gerais da aplicação Amigos Fitness."
        />
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Configurações Iniciais</AlertTitle>
          <AlertDescription>
            Não foi possível carregar as configurações do sistema. Verifique os logs do Firebase. Detalhes: {errorSettings}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Se chegou aqui, ou appSettingsFromContext tem valor, ou houve erro mas já temos defaults nos inputs
  // ou os inputs ainda estão com seus valores iniciais se appSettingsFromContext for null mas isLoadingContext for false
  // Esta lógica garante que os inputs sejam preenchidos na primeira carga ou se houver erro e o contexto fornecer defaults.

  return (
    <div>
      <PageHeader 
        title="Configurações do Sistema" 
        description="Gerencie as configurações gerais da sua academia e do aplicativo Amigos Fitness."
      />

      <form onSubmit={handleSaveSettings}>
        <div className="grid gap-8 md:grid-cols-2">
          
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary" /> Informações da Academia</CardTitle>
              <CardDescription>Edite as configurações básicas da sua academia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gymName">Nome da Academia</Label>
                <Input 
                  id="gymName" 
                  value={gymNameInput} 
                  onChange={(e) => setGymNameInput(e.target.value)}
                  className="mt-1" 
                  disabled={isSaving || isLoadingContext}
                  placeholder="Ex: Academia Força Total"
                />
              </div>
              <div>
                <Label htmlFor="gymContact">Informações de Contato</Label>
                <Input 
                  id="gymContact" 
                  value={gymContactInput} 
                  onChange={(e) => setGymContactInput(e.target.value)}
                  className="mt-1" 
                  disabled={isSaving || isLoadingContext}
                  placeholder="Ex: contato@suaacademia.com / (XX) 9XXXX-XXXX"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> Alertas e Notificações</CardTitle>
              <CardDescription>Parâmetros para alertas e notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="absenceThreshold">Limite de Faltas para Alerta</Label>
                <Input 
                  id="absenceThreshold" 
                  type="number" 
                  value={String(absenceThresholdInput)} // Garante que seja string para o input
                  onChange={(e) => setAbsenceThresholdInput(e.target.value)} // Pega como string
                  className="mt-1" 
                  disabled={isSaving || isLoadingContext}
                  min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">Nº de faltas para sugerir notificação de ausência e alerta ao admin.</p>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 flex justify-end mt-2">
            <Button type="submit" disabled={isSaving || (isLoadingContext && !appSettingsFromContext)} size="lg">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

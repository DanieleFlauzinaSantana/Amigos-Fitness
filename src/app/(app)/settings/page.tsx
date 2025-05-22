
// src/app/(app)/settings/page.tsx
"use client";

import { useState, useEffect, FormEvent } from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Info, KeyRound, Palette, Bell, Save, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { getAppSettings, updateAppSettings, type AppSettings } from '@/lib/configService';
// Os valores de config.ts não serão mais a fonte primária aqui
// import { GYM_NAME, GYM_CONTACT_INFO, ABSENCE_THRESHOLD } from "@/lib/config";

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [gymNameInput, setGymNameInput] = useState('');
  const [gymContactInput, setGymContactInput] = useState('');
  const [absenceThresholdInput, setAbsenceThresholdInput] = useState<number | string>(3); // Pode ser string do input
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      const currentSettings = await getAppSettings();
      setSettings(currentSettings);
      setGymNameInput(currentSettings.gymName);
      setGymContactInput(currentSettings.gymContactInfo);
      setAbsenceThresholdInput(currentSettings.absenceThreshold);
      setIsLoading(false);
    }
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const newSettings: Partial<AppSettings> = {
      gymName: gymNameInput,
      gymContactInfo: gymContactInput,
      absenceThreshold: Number(absenceThresholdInput), // Garante que é número
    };

    const success = await updateAppSettings(newSettings);

    if (success) {
      setSettings(prev => ({ ...prev!, ...newSettings })); // Atualiza estado local
      toast({
        title: "Configurações Salvas!",
        description: "As novas configurações foram salvas no Firestore.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao Salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
      });
    }
    setIsSaving(false);
  };

  if (isLoading) {
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
  
  if (!settings) {
     return (
      <div>
        <PageHeader 
          title="Configurações do Sistema" 
          description="Gerencie as configurações gerais da aplicação Amigos Fitness."
        />
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar as configurações. Verifique sua conexão com o Firebase.
          </AlertDescription>
        </Alert>
      </div>
    );
  }


  return (
    <div>
      <PageHeader 
        title="Configurações do Sistema" 
        description="Gerencie as configurações gerais da aplicação Amigos Fitness."
      />

      <form onSubmit={handleSaveSettings}>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
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
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="gymContact">Informações de Contato</Label>
                <Input 
                  id="gymContact" 
                  value={gymContactInput} 
                  onChange={(e) => setGymContactInput(e.target.value)}
                  className="mt-1" 
                  disabled={isSaving}
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
                  value={absenceThresholdInput} 
                  onChange={(e) => setAbsenceThresholdInput(e.target.value)}
                  className="mt-1" 
                  disabled={isSaving}
                  min="1"
                />
                <p className="text-xs text-muted-foreground mt-1">Nº de faltas para sugerir notificação de ausência.</p>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 flex justify-end mt-2">
            <Button type="submit" disabled={isSaving || isLoading} size="lg">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
          
          <Card className="lg:col-span-1 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Aparência</CardTitle>
              <CardDescription>Personalize a aparência do sistema (em desenvolvimento).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Opções para alterar cores, tema (claro/escuro) e logo poderiam ser adicionadas aqui no futuro.
              </p>
              <Button disabled variant="outline">Alterar Tema (Em breve)</Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3 mt-8">
              <CardHeader>
                  <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary" /> Gerenciamento de Administrador</CardTitle>
                  <CardDescription>Configurações relacionadas à conta de administrador.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Alert variant="default">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Funcionalidade Avançada</AlertTitle>
                      <AlertDescription>
                          Em uma aplicação completa, esta seção permitiria:
                          <ul className="list-disc list-inside mt-2 pl-4 text-sm">
                          <li>Alterar senha do administrador.</li>
                          <li>Configurar autenticação de dois fatores.</li>
                          <li>Gerenciar outros usuários administradores (se aplicável).</li>
                          </ul>
                          <p className="mt-2">A implementação de um sistema de autenticação e gerenciamento de usuários seguro é um processo complexo que envolve backend e não está no escopo atual.</p>
                      </AlertDescription>
                  </Alert>
              </CardContent>
          </Card>

        </div>
      </form>
    </div>
  );
}

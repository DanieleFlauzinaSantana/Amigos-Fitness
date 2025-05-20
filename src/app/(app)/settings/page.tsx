
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GYM_NAME, GYM_CONTACT_INFO, ABSENCE_THRESHOLD } from "@/lib/config";
import { Info, KeyRound, Palette, Bell } from "lucide-react";

export default function SettingsPage() {
  // Em uma aplicação real, essas configurações seriam carregadas de um backend
  // e poderiam ser alteradas pelo administrador.

  return (
    <div>
      <PageHeader 
        title="Configurações do Sistema" 
        description="Gerencie as configurações gerais da aplicação Amigos Fitness."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary" /> Informações da Academia</CardTitle>
            <CardDescription>Configurações básicas da sua academia.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gymName">Nome da Academia</Label>
              <Input id="gymName" value={GYM_NAME} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <Label htmlFor="gymContact">Informações de Contato</Label>
              <Input id="gymContact" value={GYM_CONTACT_INFO} readOnly className="mt-1 bg-muted/50" />
            </div>
             <Alert variant="default" className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Nota</AlertTitle>
                <AlertDescription>
                  Atualmente, estas informações são definidas no código-fonte (`src/lib/config.ts`). Em uma versão futura, poderiam ser editáveis aqui.
                </AlertDescription>
              </Alert>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> Alertas e Notificações</CardTitle>
            <CardDescription>Parâmetros para alertas e notificações automáticas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="absenceThreshold">Limite de Faltas para Alerta</Label>
              <Input id="absenceThreshold" type="number" value={ABSENCE_THRESHOLD} readOnly className="mt-1 bg-muted/50" />
               <p className="text-xs text-muted-foreground mt-1">Nº de faltas para sugerir notificação de ausência.</p>
            </div>
             <Alert variant="default" className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Nota</AlertTitle>
                <AlertDescription>
                  Este valor também é definido em (`src/lib/config.ts`) e afeta as sugestões de notificação de ausência e previsões.
                </AlertDescription>
              </Alert>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
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

        <Card className="md:col-span-2 lg:col-span-3">
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
    </div>
  );
}

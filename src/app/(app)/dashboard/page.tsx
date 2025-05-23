
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Activity, FileText } from "lucide-react"; // Removido BarChart3 pois não está sendo usado aqui
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Painel" description="Bem-vindo ao Amigos Fitness!" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div> {/* Placeholder, idealmente viria do Firestore */}
            <p className="text-xs text-muted-foreground">Atualize para ver novos alunos</p>
            <Link href="/students" className="text-sm text-primary hover:underline mt-2 block">Ver Alunos</Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins Hoje</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div> {/* Placeholder */}
            <p className="text-xs text-muted-foreground">Dados de check-in seriam agregados aqui</p>
            <Link href="/checkin" className="text-sm text-primary hover:underline mt-2 block">Ver Check-ins / Registrar Presença</Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesquisas Ativas</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Pesquisa de Satisfação Trimestral</p>
             <Link href="/surveys" className="text-sm text-primary hover:underline mt-2 block">Ver Pesquisas</Link>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-3 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Visão Geral da Amigos Fitness</CardTitle>
            <CardDescription>Acompanhe o progresso e engajamento dos seus alunos.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Recursos Principais</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Gerenciamento completo de perfis de alunos.</li>
                <li>Registro diário de check-ins de frequência.</li>
                <li>Previsão de desistências com IA.</li>
                <li>Notificações de ausência (geradas manualmente).</li>
                <li>Pesquisas de satisfação personalizáveis (no código).</li>
              </ul>
            </div>
            <div className="flex-shrink-0">
              <Image 
                src="https://placehold.co/300x200.png?text=Amigos+Fitness" 
                alt="Logo ou imagem da Amigos Fitness" 
                data-ai-hint="fitness app brand" 
                width={300} 
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    
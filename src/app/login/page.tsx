// src/app/login/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, LogIn, Loader2, MailQuestion } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth'; // Importar sendPasswordResetEmail
import { auth } from '@/lib/firebaseConfig'; // Importar a instância auth

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { loginWithEmail, currentUser, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading local para o processo de login
  const [isResettingPassword, setIsResettingPassword] = useState(false); // Loading para reset de senha

  useEffect(() => {
    if (!authLoading && currentUser) {
      console.log("[LoginPage] Usuário já logado, redirecionando para /dashboard");
      router.push('/dashboard');
    } else {
      console.log("[LoginPage] Auth state verificado. AuthLoading:", authLoading, "CurrentUser:", currentUser);
    }
  }, [currentUser, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[LoginPage] Tentando fazer login com:", email);
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Campos Obrigatórios",
        description: "Por favor, preencha o email e a senha.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      toast({
        title: "Login Bem-sucedido!",
        description: "Redirecionando para o painel...",
      });
      // O AuthContext e o useEffect acima cuidarão do redirecionamento
    } catch (error) {
      console.error("Erro de login:", error);
      let errorMessage = "Ocorreu um erro ao tentar fazer login. Tente novamente.";
      if (error instanceof Error) {
        const firebaseError = error as FirebaseError;
        switch (firebaseError.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = 'Email ou senha inválidos.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'O formato do email é inválido.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Este usuário foi desabilitado.';
            break;
          default:
            errorMessage = firebaseError.message || 'Falha no login. Verifique suas credenciais e tente novamente.';
        }
      }
      toast({
        variant: "destructive",
        title: "Falha no Login",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Necessário",
        description: "Por favor, insira seu email no campo acima para redefinir a senha.",
      });
      return;
    }
    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Link Enviado!",
        description: `Se uma conta existir para ${email}, um link para redefinição de senha foi enviado. Verifique sua caixa de entrada (e spam).`,
        duration: 7000,
      });
    } catch (error) {
      console.error("Erro ao enviar email de redefinição de senha:", error);
      let errorMessage = "Ocorreu um erro ao tentar enviar o link de redefinição.";
      if (error instanceof Error) {
        const firebaseError = error as FirebaseError;
        if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'O formato do email fornecido é inválido.';
        } else if (firebaseError.code === 'auth/user-not-found') {
          // Para não revelar se um email existe ou não, podemos usar uma mensagem genérica
           toast({
            title: "Link Enviado (se aplicável)",
            description: `Se uma conta existir para ${email}, um link para redefinição de senha foi enviado. Verifique sua caixa de entrada (e spam).`,
            duration: 7000,
          });
          setIsResettingPassword(false);
          return; // Sai da função para não mostrar o toast de erro genérico
        }
      }
      toast({
        variant: "destructive",
        title: "Falha ao Enviar Link",
        description: errorMessage,
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (authLoading || (!authLoading && currentUser)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Dumbbell className="h-12 w-12 text-primary animate-pulse" />
        <p className="mt-4 text-lg text-muted-foreground">Carregando aplicação...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Dumbbell className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Amigos Fitness</CardTitle>
          <CardDescription className="text-md">
            Acesse o painel administrativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isResettingPassword}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isResettingPassword}
              />
            </div>
            <Button type="submit" className="w-full text-lg" disabled={isLoading || isResettingPassword} size="lg">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={handlePasswordReset}
              disabled={isResettingPassword || isLoading}
              className="text-sm text-primary hover:underline px-0"
            >
              {isResettingPassword ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MailQuestion className="mr-2 h-4 w-4" />
              )}
              {isResettingPassword ? "Enviando link..." : "Esqueceu sua senha?"}
            </Button>
          </div>
        </CardContent>
      </Card>
       <p className="mt-8 text-center text-xs text-muted-foreground">
        Use o email e senha cadastrados no Firebase Authentication.
      </p>
    </div>
  );
}

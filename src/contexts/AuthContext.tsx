// src/contexts/AuthContext.tsx
"use client";

import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  // createUserWithEmailAndPassword // Para registrar novos usuários no futuro
} from 'firebase/auth';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseConfig'; // Importa a instância de auth
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  // signupWithEmail: (email: string, password: string) => Promise<void>; // Para registrar no futuro
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user && (router as any).pathname === '/login') { // Redireciona do login se já estiver logado
        router.push('/dashboard');
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O onAuthStateChanged cuidará de atualizar currentUser e setLoading,
      // e o useEffect no AppLayout cuidará do redirecionamento.
    } catch (error) {
      setLoading(false);
      throw error; // Relança o erro para ser tratado no componente de login
    }
  };

  // Exemplo de função de signup (não usada por enquanto)
  // const signupWithEmail = async (email: string, password: string) => {
  //   setLoading(true);
  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password);
  //   } catch (error) {
  //     setLoading(false);
  //     throw error;
  //   }
  // };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(null); // Garante que o estado seja atualizado imediatamente
      router.push('/login'); // Redireciona para login após sair
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, tentar limpar o usuário e redirecionar
      setCurrentUser(null);
      router.push('/login');
    } finally {
      // setLoading(false); // setLoading(false) já é feito pelo onAuthStateChanged
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    loginWithEmail,
    // signupWithEmail,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

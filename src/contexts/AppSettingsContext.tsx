// src/contexts/AppSettingsContext.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { AppSettings } from '@/lib/configService';
import { getAppSettings } from '@/lib/configService';

interface AppSettingsContextType {
  settings: AppSettings | null;
  isLoadingSettings: boolean;
  errorSettings: string | null;
  refetchSettings: () => Promise<void>;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [errorSettings, setErrorSettings] = useState<string | null>(null);

  const fetchSettings = async () => {
    console.log("[AppSettingsContext] Fetching app settings...");
    setIsLoadingSettings(true);
    setErrorSettings(null);
    try {
      const loadedSettings = await getAppSettings();
      console.log("[AppSettingsContext] Settings loaded:", loadedSettings);
      setSettings(loadedSettings);
    } catch (err) {
      console.error("[AppSettingsContext] Error loading app settings:", err);
      setErrorSettings(err instanceof Error ? err.message : "Erro desconhecido ao carregar configurações.");
      // Em caso de erro, podemos definir settings para null ou manter os padrões,
      // dependendo de como getAppSettings lida com erros (ela já retorna padrões).
      // Para garantir, podemos tentar buscar padrões aqui também, mas getAppSettings já faz isso.
      setSettings(await getAppSettings()); // Tenta buscar padrões em caso de erro
    } finally {
      setIsLoadingSettings(false);
      console.log("[AppSettingsContext] Fetching complete. Loading state:", false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <AppSettingsContext.Provider value={{ settings, isLoadingSettings, errorSettings, refetchSettings: fetchSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings deve ser usado dentro de um AppSettingsProvider');
  }
  return context;
};

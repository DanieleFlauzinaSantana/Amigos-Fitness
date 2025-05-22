
// src/lib/configService.ts
// "use server"; // REMOVIDO

import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

export interface AppSettings {
  gymName: string;
  gymContactInfo: string;
  absenceThreshold: number;
}

const SETTINGS_DOC_ID = "global_settings";
const SETTINGS_COLLECTION_NAME = "app_settings";

const DEFAULT_SETTINGS: AppSettings = {
  gymName: "Academia Força Local (Padrão)",
  gymContactInfo: "contato@padrao.com / (00) 00000-0000",
  absenceThreshold: 3,
};

export async function getAppSettings(): Promise<AppSettings> {
  console.log("[ConfigService-Firestore] getAppSettings: Tentando buscar configurações.");
  if (!db) {
    console.error("[ConfigService-Firestore] getAppSettings: Instância 'db' do Firestore não está definida!");
    return { ...DEFAULT_SETTINGS };
  }
  try {
    const settingsDocRef = doc(db, SETTINGS_COLLECTION_NAME, SETTINGS_DOC_ID);
    const docSnap = await getDoc(settingsDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("[ConfigService-Firestore] getAppSettings: Configurações encontradas no Firestore:", data);
      const settings: AppSettings = {
        gymName: data.gymName || DEFAULT_SETTINGS.gymName,
        gymContactInfo: data.gymContactInfo || DEFAULT_SETTINGS.gymContactInfo,
        absenceThreshold: typeof data.absenceThreshold === 'number' ? data.absenceThreshold : DEFAULT_SETTINGS.absenceThreshold,
      };
      return settings;
    } else {
      console.warn("[ConfigService-Firestore] getAppSettings: Documento de configurações não encontrado. Usando e salvando padrões.");
      // Na primeira vez, cria o documento com os padrões
      await setDoc(settingsDocRef, DEFAULT_SETTINGS);
      return { ...DEFAULT_SETTINGS };
    }
  } catch (error) {
    console.error("[ConfigService-Firestore] getAppSettings: Erro ao buscar configurações do Firestore:", error);
    console.warn("[ConfigService-Firestore] getAppSettings: Retornando configurações padrão devido a erro.");
    return { ...DEFAULT_SETTINGS };
  }
}

export async function updateAppSettings(settingsData: Partial<AppSettings>): Promise<boolean> {
  console.log("[ConfigService-Firestore] updateAppSettings: Tentando atualizar com dados:", settingsData);
  if (!db) {
    console.error("[ConfigService-Firestore] updateAppSettings: Instância 'db' do Firestore não está definida!");
    return false;
  }

  const cleanedSettingsData: { [key: string]: any } = {};
  for (const key in settingsData) {
    if (Object.prototype.hasOwnProperty.call(settingsData, key)) {
      const value = (settingsData as any)[key];
      if (value !== undefined) {
        cleanedSettingsData[key] = value;
      } else {
        // Firestore não aceita 'undefined', então não incluímos ou convertemos para null
        // Para um update, omitir o campo é o ideal se o valor for undefined e não queremos apagar.
        // Se quiséssemos apagar, usaríamos FieldValue.delete() ou null, dependendo do caso.
        console.warn(`[ConfigService-Firestore] updateAppSettings: Campo '${key}' era undefined e não será enviado para update.`);
      }
    }
  }

  if (Object.keys(cleanedSettingsData).length === 0) {
    console.warn("[ConfigService-Firestore] updateAppSettings: Nenhum dado válido para atualizar após limpeza de 'undefined'.");
    return true; 
  }
  
  console.log("[ConfigService-Firestore] updateAppSettings: Dados que serão enviados para updateDoc:", cleanedSettingsData);

  try {
    const settingsDocRef = doc(db, SETTINGS_COLLECTION_NAME, SETTINGS_DOC_ID);
    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
      await updateDoc(settingsDocRef, cleanedSettingsData);
      console.log("[ConfigService-Firestore] updateAppSettings: Configurações atualizadas com sucesso no Firestore (updateDoc).");
    } else {
      const initialData = {
        ...DEFAULT_SETTINGS,
        ...cleanedSettingsData,
      };
      await setDoc(settingsDocRef, initialData);
      console.log("[ConfigService-Firestore] updateAppSettings: Documento de configurações não existia, criado com sucesso no Firestore (setDoc).");
    }
    return true;
  } catch (error) {
    console.error("[ConfigService-Firestore] updateAppSettings: Erro ao atualizar/criar configurações no Firestore:", error);
    return false;
  }
}


// src/app/(app)/surveys/components/SimulatedSurveyResults.tsx
"use client";

import type { Survey } from '@/lib/types';
import * as React from 'react';

interface SimulatedSurveyResultsProps {
  survey: Survey;
}

// Este componente não é mais usado para exibir resultados detalhados.
// As respostas são visualizadas no perfil do aluno e usadas pela IA.
export function SimulatedSurveyResults({ survey }: SimulatedSurveyResultsProps) {
  return null;
}

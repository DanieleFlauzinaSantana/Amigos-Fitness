
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Student } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

const studentFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  membershipType: z.enum(["Basico", "Premium", "Experimental"]),
  joinDate: z.string().min(1, {message: "Data de início é obrigatória"}),
  likesWinter: z.enum(["sim", "nao", "nao_informado"]).optional(),
  hasChildren: z.enum(["sim", "nao", "nao_informado"]).optional(),

  // ROTINA E DISPONIBILIDADE
  bestTrainingTime: z.enum(["manha", "tarde", "noite", "nao_informado"]).optional(),
  daysPerWeek: z.string().optional(),
  workSchedule: z.enum(["turnos", "fixos", "flexivel", "nao_trabalha", "nao_informado"]).optional(),
  commuteTime: z.string().optional(),

  // MOTIVAÇÃO E OBJETIVOS
  mainGoal: z.enum(["emagrecimento", "massa_muscular", "qualidade_vida", "reabilitacao", "socializacao", "outro"]).optional(),
  otherGoalDetail: z.string().optional(),
  attendedGymBefore: z.enum(["sim", "nao", "nao_informado"]).optional(),
  previousGymDuration: z.string().optional(),
  reasonForLeavingPreviousGym: z.string().optional(),
  trainingDifficulties: z.string().optional(),

  // SAÚDE E CONDIÇÃO FÍSICA
  medicalRestrictions: z.enum(["sim", "nao", "nao_informado"]).optional(),
  medicalRestrictionsDetail: z.string().optional(),
  professionalFollowUp: z.enum(["sim", "nao", "nao_informado"]).optional(),
  currentHealthStatus: z.enum(["excelente", "bom", "regular", "ruim", "nao_informado"]).optional(),

  // ENGAJAMENTO E EXPECTATIVA
  motivationSource: z.string().optional(),
  potentialQuitFactors: z.string().optional(),
  wantsFollowUpApp: z.enum(["sim", "nao", "talvez", "nao_informado"]).optional(),

  // DADOS DE CONTRATO
  contractPlan: z.enum(["mensal", "trimestral", "semestral", "anual", "nao_informado"]).optional(),
  paymentMethod: z.enum(["cartao_credito", "cartao_debito", "pix", "boleto", "dinheiro", "nao_informado"]).optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: StudentFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-primary pt-4 col-span-1 md:col-span-2">{children}</h3>
);

export function StudentForm({ student, onSubmit, onCancel, isSubmitting }: StudentFormProps) {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: student ? {
      ...student,
      dateOfBirth: student.dateOfBirth || '',
      phone: student.phone || '',
      emergencyContactName: student.emergencyContactName || '',
      emergencyContactPhone: student.emergencyContactPhone || '',
      likesWinter: student.likesWinter || "nao_informado",
      hasChildren: student.hasChildren || "nao_informado",
      bestTrainingTime: student.bestTrainingTime || "nao_informado",
      daysPerWeek: student.daysPerWeek || "",
      workSchedule: student.workSchedule || "nao_informado",
      commuteTime: student.commuteTime || "",
      mainGoal: student.mainGoal || "qualidade_vida",
      otherGoalDetail: student.otherGoalDetail || "",
      attendedGymBefore: student.attendedGymBefore || "nao_informado",
      previousGymDuration: student.previousGymDuration || "",
      reasonForLeavingPreviousGym: student.reasonForLeavingPreviousGym || "",
      trainingDifficulties: student.trainingDifficulties || "",
      medicalRestrictions: student.medicalRestrictions || "nao_informado",
      medicalRestrictionsDetail: student.medicalRestrictionsDetail || "",
      professionalFollowUp: student.professionalFollowUp || "nao_informado",
      currentHealthStatus: student.currentHealthStatus || "nao_informado",
      motivationSource: student.motivationSource || "",
      potentialQuitFactors: student.potentialQuitFactors || "",
      wantsFollowUpApp: student.wantsFollowUpApp || "nao_informado",
      contractPlan: student.contractPlan || "nao_informado",
      paymentMethod: student.paymentMethod || "nao_informado",
    } : {
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      membershipType: "Basico",
      joinDate: new Date().toISOString().split('T')[0], // Default to today
      likesWinter: "nao_informado",
      hasChildren: "nao_informado",
      bestTrainingTime: "nao_informado",
      daysPerWeek: "",
      workSchedule: "nao_informado",
      commuteTime: "",
      mainGoal: "qualidade_vida",
      otherGoalDetail: "",
      attendedGymBefore: "nao_informado",
      previousGymDuration: "",
      reasonForLeavingPreviousGym: "",
      trainingDifficulties: "",
      medicalRestrictions: "nao_informado",
      medicalRestrictionsDetail: "",
      professionalFollowUp: "nao_informado",
      currentHealthStatus: "nao_informado",
      motivationSource: "",
      potentialQuitFactors: "",
      wantsFollowUpApp: "nao_informado",
      contractPlan: "nao_informado",
      paymentMethod: "nao_informado",
    },
  });

  const mainGoalValue = form.watch("mainGoal");
  const attendedGymBeforeValue = form.watch("attendedGymBefore");
  const medicalRestrictionsValue = form.watch("medicalRestrictions");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionTitle>Informações Pessoais</SectionTitle>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do aluno" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="joinDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="membershipType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Plano (Academia)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de plano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Basico">Básico</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Experimental">Experimental</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergencyContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Contato de Emergência</FormLabel>
                <FormControl>
                  <Input placeholder="Contato de emergência" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergencyContactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone de Emergência</FormLabel>
                <FormControl>
                  <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="likesWinter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gosta de Inverno?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasChildren"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tem Filhos?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="md:col-span-2 my-4" />
          <SectionTitle>🕒 Rotina e Disponibilidade</SectionTitle>

          <FormField
            control={form.control}
            name="bestTrainingTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Melhor horário para frequentar?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="manha">Manhã</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                    <SelectItem value="noite">Noite</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="daysPerWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantos dias por semana pretende treinar?</FormLabel>
                <FormControl><Input placeholder="Ex: 3 dias" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workSchedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trabalha em turnos ou horários fixos?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="turnos">Turnos</SelectItem>
                    <SelectItem value="fixos">Horários Fixos</SelectItem>
                    <SelectItem value="flexivel">Horários Flexíveis</SelectItem>
                    <SelectItem value="nao_trabalha">Não trabalha atualmente</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commuteTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo de deslocamento até a academia?</FormLabel>
                <FormControl><Input placeholder="Ex: 15 minutos" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Separator className="md:col-span-2 my-4" />
          <SectionTitle>🧠 Motivação e Objetivos</SectionTitle>

          <FormField
            control={form.control}
            name="mainGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Principal objetivo com a academia?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "qualidade_vida"}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                    <SelectItem value="massa_muscular">Ganho de massa muscular</SelectItem>
                    <SelectItem value="qualidade_vida">Qualidade de vida</SelectItem>
                    <SelectItem value="reabilitacao">Reabilitação/condicionamento</SelectItem>
                    <SelectItem value="socializacao">Socialização</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {mainGoalValue === "outro" && (
            <FormField
              control={form.control}
              name="otherGoalDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual outro objetivo?</FormLabel>
                  <FormControl><Textarea placeholder="Descreva seu outro objetivo" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="attendedGymBefore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Já frequentou academia antes?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {attendedGymBeforeValue === "sim" && (
            <>
              <FormField
                control={form.control}
                name="previousGymDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Por quanto tempo permaneceu?</FormLabel>
                    <FormControl><Input placeholder="Ex: 1 ano" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reasonForLeavingPreviousGym"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Por que saiu da academia anterior?</FormLabel>
                    <FormControl><Textarea placeholder="Descreva o motivo" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="trainingDifficulties"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Já teve dificuldades em manter uma rotina de treinos? Quais?</FormLabel>
                <FormControl><Textarea placeholder="Descreva as dificuldades" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="md:col-span-2 my-4" />
          <SectionTitle>🩺 Saúde e Condição Física</SectionTitle>
          
          <FormField
            control={form.control}
            name="medicalRestrictions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Possui alguma restrição médica?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {medicalRestrictionsValue === "sim" && (
            <FormField
              control={form.control}
              name="medicalRestrictionsDetail"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Detalhe as restrições médicas</FormLabel>
                  <FormControl><Textarea placeholder="Descreva as restrições" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="professionalFollowUp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faz acompanhamento profissional (nutri, médico)?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentHealthStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avalia seu estado de saúde atual como:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="excelente">Excelente</SelectItem>
                    <SelectItem value="bom">Bom</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="ruim">Ruim</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="md:col-span-2 my-4" />
          <SectionTitle>💬 Engajamento e Expectativa</SectionTitle>

          <FormField
            control={form.control}
            name="motivationSource"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>O que te motiva a continuar treinando regularmente?</FormLabel>
                <FormControl><Textarea placeholder="Descreva suas motivações" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="potentialQuitFactors"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Quais fatores poderiam fazer você desistir da academia?</FormLabel>
                <FormControl><Textarea placeholder="Descreva os fatores" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wantsFollowUpApp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gostaria de acompanhamento por app/mensagens?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="talvez">Talvez</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Separator className="md:col-span-2 my-4" />
          <SectionTitle>🧾 Dados de Contrato (Opcional)</SectionTitle>

          <FormField
            control={form.control}
            name="contractPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano Contratado (Duração)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "nao_informado"}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                    <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                    <SelectItem value="pix">Pix</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="nao_informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-6">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : (student ? "Salvar Alterações" : "Adicionar Aluno")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // For potential student ID
import type { Survey, SurveyQuestion, SurveyResponse, SurveyAnswer } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { useState } from "react";

interface SurveySubmissionFormProps {
  survey: Survey;
  studentId?: string; // Optional: if survey is not anonymous / pre-filled
}

const createSurveySchema = (questions: SurveyQuestion[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {
    studentIdentifier: z.string().optional(), // e.g. email or ID if not anonymous
  };

  questions.forEach(q => {
    if (q.type === 'rating') {
      schemaShape[q.id] = z.number().min(1, "Avaliação é obrigatória").max(5, "Avaliação máxima é 5");
    } else if (q.type === 'text') {
      schemaShape[q.id] = z.string().min(1, "Resposta é obrigatória");
    } else if (q.type === 'multiple-choice') {
      schemaShape[q.id] = z.string({ required_error: "Seleção é obrigatória." });
    }
  });
  return z.object(schemaShape);
};


export function SurveySubmissionForm({ survey, studentId }: SurveySubmissionFormProps) {
  const { toast } = useToast();
  const surveySchema = createSurveySchema(survey.questions);
  type SurveyFormValues = z.infer<typeof surveySchema>;

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      studentIdentifier: studentId || "",
      ...survey.questions.reduce((acc, q) => {
        if (q.type === 'rating') acc[q.id] = 0; // Default to 0, user must select
        else acc[q.id] = "";
        return acc;
      }, {} as any),
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: SurveyFormValues) => {
    setIsSubmitting(true);
    const answers: SurveyAnswer[] = survey.questions.map(q => ({
      questionId: q.id,
      value: data[q.id],
    }));

    const response: SurveyResponse = {
      surveyId: survey.id,
      studentId: data.studentIdentifier || undefined,
      answers,
      submittedAt: new Date().toISOString(),
    };

    // Simulate API call
    console.log("Survey Response:", response);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    toast({
      title: "Pesquisa Enviada!",
      description: "Obrigado por sua avaliação. Seu feedback é muito importante!",
    });
    form.reset(); 
  };

  const RatingInput = ({ value, onChange }: { value: number, onChange: (rating: number) => void }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`cursor-pointer h-6 w-6 ${
              (hoverRating || value) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
            }`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{survey.title}</CardTitle>
        <CardDescription>{survey.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            {survey.questions.map((question) => (
              <FormField
                key={question.id}
                control={form.control}
                name={question.id as keyof SurveyFormValues}
                render={({ field }) => (
                  <FormItem className="p-4 border rounded-lg shadow-sm bg-background">
                    <FormLabel className="text-lg font-semibold text-foreground">{question.text}</FormLabel>
                    <FormControl className="mt-2">
                      {question.type === 'rating' ? (
                        <RatingInput value={field.value as number} onChange={field.onChange} />
                      ) : question.type === 'text' ? (
                        <Textarea placeholder="Sua resposta..." {...field as any} />
                      ) : question.type === 'multiple-choice' && question.options ? (
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value as string}
                          className="flex flex-col space-y-1"
                        >
                          {question.options.map((option) => (
                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal text-foreground">
                                {option}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      ) : null}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {!studentId && ( // Only show if studentId is not pre-filled (anonymous or identified by email)
              <FormField
                control={form.control}
                name="studentIdentifier"
                render={({ field }) => (
                  <FormItem className="p-4 border rounded-lg shadow-sm bg-background">
                    <FormLabel className="text-lg font-semibold text-foreground">Seu Email (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seuemail@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


// src/app/(app)/chat-ia/page.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { adminChat, type AdminChatInput, type AdminChatOutput } from '@/ai/flows/admin-chat-flow';
import { useAuth } from '@/contexts/AuthContext'; // Para obter o avatar do admin

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  avatar?: string;
}

export default function ChatIAPage() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      sender: 'user',
      text: inputValue,
      avatar: currentUser?.photoURL || undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const inputForAI: AdminChatInput = { userMessage: currentInput };
      const result: AdminChatOutput = await adminChat(inputForAI);
      
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        text: result.aiResponse,
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Erro ao comunicar com a IA:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        sender: 'ai',
        text: "Desculpe, ocorreu um erro ao tentar obter uma resposta. Tente novamente.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Chat com Assistente IA"
        description="Pergunte sobre o Amigos Fitness, gestão de academias, ou peça conselhos."
      />
      <Card className="h-[calc(100vh-200px)] flex flex-col"> {/* Altura ajustável */}
        <CardHeader>
          <CardTitle>Assistente Virtual da Academia</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'ai' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm shadow-md ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    {msg.text.split('\\n').map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                     ))}
                  </div>
                  {msg.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.avatar} alt="Admin" data-ai-hint="admin avatar"/>
                      <AvatarFallback>
                        {currentUser?.email ? currentUser.email[0].toUpperCase() : <User className="h-5 w-5"/>}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] rounded-lg px-3 py-2 text-sm shadow-md bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Digite sua mensagem aqui..."
              className="flex-1"
              autoComplete="off"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Enviar mensagem</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

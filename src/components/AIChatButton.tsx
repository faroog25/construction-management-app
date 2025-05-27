import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Bot, Send, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface AIResponse {
  question: string;
  answer: string | object;
  timestamp: Date;
}

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [responses, isLoading]);

  const askQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please write a question",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `https://constructionmanagementassitantapi.runasp.net/api/v1/Reports/askQuestion?question=${encodeURIComponent(question)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorResponse: AIResponse = {
          question: question,
          answer: "Sorry, I couldn't understand your question. Please be more specific and try again.",
          timestamp: new Date()
        };
        setResponses(prev => [...prev, errorResponse]);
        setQuestion('');
        return;
      }

      const data = await response.json();
      
      if (data.message && data.message.includes("Sorry, I couldn't understand")) {
        const newResponse: AIResponse = {
          question: question,
          answer: data.message,
          timestamp: new Date()
        };
        setResponses(prev => [...prev, newResponse]);
      } else {
        const newResponse: AIResponse = {
          question: question,
          answer: data,
          timestamp: new Date()
        };
        setResponses(prev => [...prev, newResponse]);
      }
      
      setQuestion('');
      
      toast({
        title: "Success",
        description: "Answer received successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error asking question:', error);
      
      const errorResponse: AIResponse = {
        question: question,
        answer: "Sorry, I couldn't understand your question. Please be more specific and try again.",
        timestamp: new Date()
      };
      setResponses(prev => [...prev, errorResponse]);
      setQuestion('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      askQuestion();
    }
  };

  const isArray = (data: any): data is any[] => {
    return Array.isArray(data);
  };

  const isObjectWithKeys = (data: any): data is Record<string, any> => {
    return typeof data === 'object' && data !== null && !Array.isArray(data);
  };

  const renderTable = (data: any[], title?: string) => {
    if (!data || data.length === 0) {
      return <p className="text-sm text-muted-foreground">No data to display</p>;
    }

    const firstItem = data[0];
    const columns = Object.keys(firstItem);

    return (
      <div className="space-y-3">
        {title && <h4 className="font-medium text-sm">{title}</h4>}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="font-medium">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column} className="text-sm">
                      {typeof row[column] === 'object' && row[column] !== null
                        ? JSON.stringify(row[column])
                        : String(row[column] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const formatResponse = (answer: string | object) => {
    if (typeof answer === 'string') {
      return (
        <div className="prose prose-sm max-w-none">
          <p className="text-sm leading-relaxed">{answer}</p>
        </div>
      );
    }

    if (isArray(answer)) {
      return renderTable(answer, "Data");
    }

    if (isObjectWithKeys(answer)) {
      if (answer.data && isArray(answer.data)) {
        return renderTable(answer.data, "Results");
      }
      
      if (answer.items && isArray(answer.items)) {
        return renderTable(answer.items, "Items");
      }

      const arrayKeys = Object.keys(answer).filter(key => isArray(answer[key]));
      if (arrayKeys.length > 0) {
        return (
          <div className="space-y-4">
            {arrayKeys.map((key) => (
              <div key={key}>
                {renderTable(answer[key], key)}
              </div>
            ))}
          </div>
        );
      }

      const entries = Object.entries(answer).filter(([_, value]) => 
        typeof value !== 'object' || value === null
      );
      
      if (entries.length > 0) {
        return (
          <div className="space-y-2">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableBody>
                  {entries.map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{String(value || '')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto border">
            {JSON.stringify(answer, null, 2)}
          </pre>
        </div>
      );
    }

    return <p className="text-sm text-muted-foreground">No data to display</p>;
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Bot className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <MessageCircle className="h-5 w-5 text-primary" />
                AI Assistant
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1 px-1">
                <div className="space-y-4 pb-4">
                  {responses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bot className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p>Ask any question about projects or data</p>
                    </div>
                  ) : (
                    responses.map((response, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-end">
                          <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                            <p className="text-sm">{response.question}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {response.timestamp.toLocaleTimeString('en-US')}
                            </p>
                          </div>
                        </div>
                        
                        {/* AI Response */}
                        <div className="flex justify-start">
                          <Card className="max-w-[90%] border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Bot className="h-4 w-4 text-blue-500" />
                                <Badge variant="secondary" className="text-xs">
                                  AI Assistant
                                </Badge>
                              </div>
                              {formatResponse(response.answer)}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input Area */}
              <div className="flex gap-2 pt-4 border-t bg-background">
                <Input
                  placeholder="Type your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={askQuestion} 
                  disabled={isLoading || !question.trim()}
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AIChatButton;

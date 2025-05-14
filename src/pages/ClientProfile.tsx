
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Loader2, 
  AlertCircle, 
  ChevronLeft,
  ArrowLeft,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import ClientProfile from '@/components/ClientProfile';
import { getClientById } from '@/services/clientService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const ClientProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(id || ''),
    enabled: !!id,
  });

  const handleGoBack = () => {
    navigate('/team');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-8">
        <div className="w-full max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back_to_team')}
          </Button>
          
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mt-4 text-lg text-muted-foreground">{t('loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    toast.error(error instanceof Error ? error.message : t('error.loading_client'));
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-8">
        <div className="w-full max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-1 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back_to_team')}
          </Button>
          
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Alert variant="destructive" className="max-w-lg w-full">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                {error instanceof Error ? error.message : t('error.loading_client')}
              </AlertDescription>
            </Alert>
            <Button variant="outline" onClick={handleGoBack}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('back_to_team')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const initials = client.fullName.split(' ').slice(0, 2).map(name => name[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-1 mb-6 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back_to_team')}
        </Button>

        {/* Client Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-card rounded-lg p-6 shadow-md border mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{client.fullName}</h1>
              <div className="flex items-center mt-1">
                <Building className="h-4 w-4 text-muted-foreground mr-1" />
                <p className="text-muted-foreground">{client.clientType}</p>
              </div>
            </div>
          </div>
          <Badge className="bg-amber-500/90 hover:bg-amber-500 mt-4 md:mt-0">
            {t('client')}
          </Badge>
        </div>

        <ClientProfile client={client} />
      </div>
    </div>
  );
};

export default ClientProfilePage;

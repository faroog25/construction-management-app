import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Loader2, 
  AlertCircle, 
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ClientProfile from '@/components/ClientProfile';
import { getClientById } from '@/services/clientService';
import { useLanguage } from '@/contexts/LanguageContext';

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
      <div className="flex flex-col justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-4 text-lg text-muted-foreground">{t('loading')}</span>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="flex items-center text-destructive">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{error instanceof Error ? error.message : t('error.loading_client')}</p>
        </div>
        <Button variant="outline" onClick={handleGoBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t('back_to_team')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground" 
                onClick={handleGoBack}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t('team')}
              </Button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mt-2">{client.fullName}</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <p className="text-muted-foreground">{t('client.id')}: {client.id}</p>
              <p className="text-muted-foreground">{t('client.type')}: {client.clientType}</p>
            </div>
          </div>
        </div>

        <ClientProfile client={client} />
      </main>
    </div>
  );
};

export default ClientProfilePage; 

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSiteEngineerById } from '@/services/siteEngineerService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Calendar, Mail, MapPin, Phone, User, Users, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export default function SiteEngineerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { t, isRtl } = useLanguage();
  const navigate = useNavigate();

  const { data: engineer, isLoading, error } = useQuery({
    queryKey: ['siteEngineer', id],
    queryFn: () => getSiteEngineerById(id!),
    enabled: !!id
  });

  const handleGoBack = () => {
    navigate('/team');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back_to_team')}
        </Button>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
              <Skeleton className="h-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(error instanceof Error ? error.message : t('error.unknown'));
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back_to_team')}
        </Button>
        
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : t('error.unknown')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!engineer) {
    toast.error(t('error.not_found'));
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back_to_team')}
        </Button>
        
        <Alert>
          <AlertDescription>{t('error.not_found')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const fullName = `${engineer.firstName} ${engineer.secondName} ${engineer.thirdName} ${engineer.lastName}`.trim();
  const hireDate = new Date(engineer.hireDate);
  const formattedHireDate = format(hireDate, 'PPP', { locale: isRtl ? ar : undefined });
  const initials = `${engineer.firstName?.charAt(0) || ''}${engineer.lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Back button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-1 mb-2 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back_to_team')}
        </Button>

        {/* Engineer header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-card rounded-lg p-6 shadow-md border mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
              <div className="flex items-center mt-1">
                <Building2 className="h-4 w-4 text-muted-foreground mr-1" />
                <p className="text-muted-foreground">{t('site_engineer')}</p>
              </div>
            </div>
          </div>
          <Badge variant={engineer.isAvailable ? "success" : "destructive"} className="px-3 py-1 mt-4 md:mt-0">
            {engineer.isAvailable ? t('status.available') : t('status.unavailable')}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t('contact_information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('table.email')}</p>
                    <p className="font-medium">{engineer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('table.phone')}</p>
                    <p className="font-medium">{engineer.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('table.national_number')}</p>
                    <p className="font-medium">{engineer.nationalNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('table.address')}</p>
                    <p className="font-medium">{engineer.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('table.hire_date')}</p>
                    <p className="font-medium">{formattedHireDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                {t('table.projects')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {engineer.projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                  <Building2 className="mx-auto h-12 w-12 mb-3 text-muted-foreground/50" />
                  <p>{t('search.no_projects')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {engineer.projects.map((project) => (
                    <Card key={project.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-500" />
                          <p className="font-medium">{project.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

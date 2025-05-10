import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSiteEngineerById } from '@/services/siteEngineerService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Calendar, Mail, MapPin, Phone, User, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function SiteEngineerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { t, isRtl } = useLanguage();

  const { data: engineer, isLoading, error } = useQuery({
    queryKey: ['siteEngineer', id],
    queryFn: () => getSiteEngineerById(id!),
    enabled: !!id
  });

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : t('error.unknown')}
        </AlertDescription>
      </Alert>
    );
  }

  if (!engineer) {
    return (
      <Alert>
        <AlertDescription>{t('error.not_found')}</AlertDescription>
      </Alert>
    );
  }

  const fullName = `${engineer.firstName} ${engineer.secondName} ${engineer.thirdName} ${engineer.lastName}`.trim();
  const hireDate = new Date(engineer.hireDate);
  const formattedHireDate = format(hireDate, 'PPP', { locale: isRtl ? ar : undefined });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 py-12">
      <div className="w-full max-w-5xl mx-auto px-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              {fullName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('table.email')}</p>
                        <p className="font-medium">{engineer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('table.phone')}</p>
                        <p className="font-medium">{engineer.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('table.national_number')}</p>
                        <p className="font-medium">{engineer.nationalNumber}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('table.address')}</p>
                        <p className="font-medium">{engineer.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('table.hire_date')}</p>
                        <p className="font-medium">{formattedHireDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('table.status')}</p>
                        <p className="font-medium">
                          {engineer.isAvailable ? t('status.available') : t('status.unavailable')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {t('table.projects')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {engineer.projects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="mx-auto h-12 w-12 mb-3 text-muted-foreground/50" />
                    <p>{t('search.no_projects')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {engineer.projects.map((project) => (
                      <Card key={project.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <p className="font-medium">{project.name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
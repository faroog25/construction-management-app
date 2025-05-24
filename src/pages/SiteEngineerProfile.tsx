
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEngineerById } from '@/services/engineerService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Mail, Phone, User, ArrowLeft, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function SiteEngineerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: engineer, isLoading, error } = useQuery({
    queryKey: ['siteEngineer', id],
    queryFn: () => getEngineerById(id!),
    enabled: !!id
  });

  const handleGoBack = () => {
    navigate('/team');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        <div className="h-16"></div>
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة للفريق
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
      </div>
    );
  }

  if (error) {
    toast.error(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        <div className="h-16"></div>
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-1 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة للفريق
          </Button>
          
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'حدث خطأ غير متوقع'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!engineer) {
    toast.error('لم يتم العثور على المهندس');
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        <div className="h-16"></div>
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-1 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة للفريق
          </Button>
          
          <Alert>
            <AlertDescription>لم يتم العثور على المهندس</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const initials = engineer.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="h-16"></div>
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Back button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-1 mb-2 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة للفريق
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
              <h1 className="text-2xl font-bold tracking-tight">{engineer.name}</h1>
              <div className="flex items-center mt-1">
                <Building2 className="h-4 w-4 text-muted-foreground mr-1" />
                <p className="text-muted-foreground">مهندس موقع</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                معلومات الاتصال
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">اسم المستخدم</p>
                    <p className="font-medium">{engineer.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-medium">{engineer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                    <p className="font-medium">{engineer.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                معلومات إضافية
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                <Building2 className="mx-auto h-12 w-12 mb-3 text-muted-foreground/50" />
                <p>لا توجد معلومات إضافية متاحة</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getWorkerById } from '../services/workerService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle2, XCircle, User, Mail, Phone, MapPin, Briefcase, Calendar, ListTodo, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

export function WorkerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workerId = parseInt(id || '0');

  const { data: worker, isLoading, error } = useQuery({
    queryKey: ['worker', workerId],
    queryFn: () => getWorkerById(workerId),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[280px]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[250px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل بيانات العامل'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>لم يتم العثور على العامل</AlertDescription>
        </Alert>
      </div>
    );
  }

  const fullName = `${worker.firstName} ${worker.secondName} ${worker.thirdName} ${worker.lastName}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>البريد الإلكتروني:</span>
                  </div>
                  <p className="text-sm font-medium">{worker.email || '-'}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>رقم الهاتف:</span>
                  </div>
                  <p className="text-sm font-medium">{worker.phoneNumber}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    <span>الرقم الوطني:</span>
                  </div>
                  <p className="text-sm font-medium">{worker.nationalNumber || '-'}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>العنوان:</span>
                  </div>
                  <p className="text-sm font-medium">{worker.address || '-'}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>التخصص:</span>
                  </div>
                  <p className="text-sm font-medium">{worker.specialty || '-'}</p>
                </div>

                <Badge variant={worker.isAvailable ? "success" : "destructive"} className="px-3 py-1">
                  {worker.isAvailable ? (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>متاح</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <XCircle className="h-4 w-4" />
                      <span>غير متاح</span>
                    </div>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-primary" />
                المهام المسندة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {worker.tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ListTodo className="mx-auto h-12 w-12 mb-3 text-muted-foreground/50" />
                  <p>لا توجد مهام مسندة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {worker.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{task.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{task.projectName}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        عرض التفاصيل
                      </Button>
                    </div>
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
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getWorkerById } from '../services/workerService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle2, XCircle, User, Mail, Phone, MapPin, Briefcase, Calendar, ListTodo } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function WorkerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const workerId = parseInt(id || '0');

  const { data: worker, isLoading, error } = useQuery({
    queryKey: ['worker', workerId],
    queryFn: () => getWorkerById(workerId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[280px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل بيانات العامل'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!worker) {
    return (
      <Alert>
        <AlertDescription>لم يتم العثور على العامل</AlertDescription>
      </Alert>
    );
  }

  const fullName = `${worker.firstName} ${worker.secondName} ${worker.thirdName} ${worker.lastName}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            {fullName}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span>البريد الإلكتروني:</span>
              </div>
              <p className="text-sm">{worker.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>رقم الهاتف:</span>
              </div>
              <p className="text-sm">{worker.phoneNumber}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                <span>الرقم الوطني:</span>
              </div>
              <p className="text-sm">{worker.nationalNumber}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>العنوان:</span>
              </div>
              <p className="text-sm">{worker.address}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>التخصص:</span>
              </div>
              <p className="text-sm">{worker.specialty}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <span>الحالة:</span>
              </div>
              <div className="flex items-center">
                {worker.isAvailable ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">متاح</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">غير متاح</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            المهام
          </CardTitle>
        </CardHeader>
        <CardContent>
          {worker.tasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">لا توجد مهام مسندة</p>
          ) : (
            <div className="space-y-4">
              {worker.tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{task.name}</h4>
                    <p className="text-sm text-muted-foreground">{task.projectName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getWorkerById } from '../services/workerService';
import { getTasksForWorker, WorkerAssignment } from '../services/taskService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle2, XCircle, User, Mail, Phone, MapPin, Briefcase, Calendar, ListTodo, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

export function WorkerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workerId = parseInt(id || '0');

  const { data: worker, isLoading: isWorkerLoading, error: workerError } = useQuery({
    queryKey: ['worker', workerId],
    queryFn: () => getWorkerById(workerId),
  });

  const { data: workerTasks, isLoading: isTasksLoading, error: tasksError } = useQuery({
    queryKey: ['workerTasks', workerId],
    queryFn: () => getTasksForWorker(workerId),
    enabled: !!workerId,
  });

  const handleGoBack = () => {
    navigate('/team');
  };

  const isLoading = isWorkerLoading || isTasksLoading;
  const error = workerError || tasksError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        <div className="h-16"></div>
        <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Team
          </Button>
          
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
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error", 
      description: "Error loading worker data",
      variant: "destructive"
    });
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
            Back to Team
          </Button>
          
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Error loading worker data'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!worker) {
    toast({
      title: "Error",
      description: "Worker not found",
      variant: "destructive"
    });
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
            Back to Team
          </Button>
          
          <Alert>
            <AlertDescription>Worker not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const fullName = `${worker.firstName} ${worker.secondName} ${worker.thirdName} ${worker.lastName}`;
  const initials = `${worker.firstName?.charAt(0) || ''}${worker.lastName?.charAt(0) || ''}`.toUpperCase();

  const tasks = workerTasks || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="h-16"></div>
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-1 mb-2 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Team
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-card rounded-lg p-6 shadow-md border mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
              <div className="flex items-center mt-1">
                <Briefcase className="h-4 w-4 text-muted-foreground mr-1" />
                <p className="text-muted-foreground">{worker.specialty || 'Worker'}</p>
              </div>
            </div>
          </div>
          <Badge variant={worker.isAvailable ? "success" : "destructive"} className="px-3 py-1 text-sm">
            {worker.isAvailable ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Available</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4" />
                <span>Unavailable</span>
              </div>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Email:</span>
                  </div>
                  <p className="text-sm font-medium">{worker.email || '-'}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Phone:</span>
                  </div>
                  <p className="text-sm font-medium">{worker.phoneNumber}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    <span>National ID:</span>
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
                    <span>Specialty:</span>
                  </div>
                  <p className="text-sm font-medium">{worker.specialty || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-blue-500" />
                Assigned Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                  <ListTodo className="mx-auto h-12 w-12 mb-3 text-muted-foreground/50" />
                  <p>No assigned tasks</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task: WorkerAssignment) => (
                    <div 
                      key={task.taskId} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{task.taskName}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Assignment Date: {new Date(task.assignedDate).toLocaleDateString()}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary"
                        onClick={() => navigate(`/projects/tasks/${task.taskId}`)}
                      >
                        View Details
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

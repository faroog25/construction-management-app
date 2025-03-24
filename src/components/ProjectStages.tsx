
import React from 'react';
import { Project } from '@/services/projectService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface ProjectStagesProps {
  project: Project;
}

// Dummy data for project stages with Arabic content
const dummyStages = [
  {
    id: 1,
    name: 'التخطيط والتصميم',
    status: 'completed',
    startDate: '2023-09-01',
    endDate: '2023-10-15',
    tasks: [
      { id: 1, name: 'تحليل متطلبات المشروع', status: 'completed' },
      { id: 2, name: 'إعداد المخططات الأولية', status: 'completed' },
      { id: 3, name: 'الحصول على موافقة العميل', status: 'completed' },
      { id: 4, name: 'إعداد المخططات التفصيلية', status: 'completed' },
    ]
  },
  {
    id: 2,
    name: 'أعمال الحفر والأساسات',
    status: 'completed',
    startDate: '2023-10-16',
    endDate: '2023-11-30',
    tasks: [
      { id: 5, name: 'حفر الموقع', status: 'completed' },
      { id: 6, name: 'وضع الأساسات', status: 'completed' },
      { id: 7, name: 'صب الخرسانة', status: 'completed' },
      { id: 8, name: 'فحص الأساسات', status: 'completed' },
    ]
  },
  {
    id: 3,
    name: 'الهيكل والبناء',
    status: 'active',
    startDate: '2023-12-01',
    endDate: '2024-02-28',
    tasks: [
      { id: 9, name: 'بناء الهيكل الرئيسي', status: 'completed' },
      { id: 10, name: 'تركيب الأعمدة والجدران', status: 'completed' },
      { id: 11, name: 'أعمال السقف', status: 'active' },
      { id: 12, name: 'التمديدات الكهربائية والسباكة', status: 'pending' },
    ]
  },
  {
    id: 4,
    name: 'التشطيبات الداخلية',
    status: 'pending',
    startDate: '2024-03-01',
    endDate: '2024-05-15',
    tasks: [
      { id: 13, name: 'تركيب الجبس والأسقف المعلقة', status: 'pending' },
      { id: 14, name: 'تبليط الأرضيات', status: 'pending' },
      { id: 15, name: 'دهان الجدران', status: 'pending' },
      { id: 16, name: 'تركيب الأبواب والنوافذ', status: 'pending' },
    ]
  },
  {
    id: 5,
    name: 'التشطيبات الخارجية',
    status: 'pending',
    startDate: '2024-05-16',
    endDate: '2024-06-30',
    tasks: [
      { id: 17, name: 'تركيب الواجهات', status: 'pending' },
      { id: 18, name: 'أعمال تنسيق الموقع', status: 'pending' },
      { id: 19, name: 'إنشاء المسارات والطرق', status: 'pending' },
      { id: 20, name: 'الزراعة والتشجير', status: 'pending' },
    ]
  }
];

const ProjectStages = ({ project }: ProjectStagesProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <h2 className="text-2xl font-bold">مراحل المشروع والمهام</h2>
      
      {dummyStages.map((stage) => (
        <Card key={stage.id} className="overflow-hidden border-l-4" 
          style={{ borderLeftColor: 
            stage.status === 'completed' ? '#22c55e' : 
            stage.status === 'active' ? '#3b82f6' : '#f59e0b' 
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">{stage.name}</CardTitle>
              <Badge
                variant="outline"
                className={
                  stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                  stage.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'
                }
              >
                {stage.status === 'completed' ? 'مكتمل' :
                 stage.status === 'active' ? 'قيد التنفيذ' : 'قيد الانتظار'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(stage.startDate)} - {formatDate(stage.endDate)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stage.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                  {task.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : task.status === 'active' ? (
                    <Clock className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span>{task.name}</span>
                  <Badge 
                    variant="outline" 
                    className={
                      task.status === 'completed' ? 'ml-auto bg-green-100 text-green-800' :
                      task.status === 'active' ? 'ml-auto bg-blue-100 text-blue-800' : 
                      'ml-auto bg-yellow-100 text-yellow-800'
                    }
                  >
                    {task.status === 'completed' ? 'مكتمل' :
                     task.status === 'active' ? 'قيد التنفيذ' : 'قيد الانتظار'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectStages;

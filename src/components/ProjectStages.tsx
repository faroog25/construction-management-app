
import React from 'react';
import { Project } from '@/services/projectService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { CircleDot, CircleHalf, CirclePercent } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectStagesProps {
  project: Project;
}

// Mock data for stages and tasks
const projectStages = [
  {
    id: 1,
    name: "Planning Phase",
    nameAr: "مرحلة التخطيط",
    description: "Initial planning and requirements gathering",
    progress: 100,
    status: 'completed',
    tasks: [
      { id: 101, name: "Requirement Analysis", nameAr: "تحليل المتطلبات", progress: 100, status: 'completed' },
      { id: 102, name: "Site Survey", nameAr: "مسح الموقع", progress: 100, status: 'completed' },
      { id: 103, name: "Initial Design", nameAr: "التصميم الأولي", progress: 100, status: 'completed' }
    ]
  },
  {
    id: 2,
    name: "Foundation Work",
    nameAr: "أعمال الأساسات",
    description: "Excavation and foundation preparation",
    progress: 100,
    status: 'completed',
    tasks: [
      { id: 201, name: "Excavation", nameAr: "الحفر", progress: 100, status: 'completed' },
      { id: 202, name: "Foundation Layout", nameAr: "تخطيط الأساس", progress: 100, status: 'completed' },
      { id: 203, name: "Concrete Pouring", nameAr: "صب الخرسانة", progress: 100, status: 'completed' },
      { id: 204, name: "Curing", nameAr: "المعالجة", progress: 100, status: 'completed' }
    ]
  },
  {
    id: 3,
    name: "Main Structure",
    nameAr: "الهيكل الرئيسي", 
    description: "Construction of the main building structure",
    progress: 75,
    status: 'in-progress',
    tasks: [
      { id: 301, name: "Framing", nameAr: "هيكلة", progress: 100, status: 'completed' },
      { id: 302, name: "Wall Construction", nameAr: "بناء الجدران", progress: 100, status: 'completed' },
      { id: 303, name: "Roofing", nameAr: "السقف", progress: 30, status: 'delayed' },
      { id: 304, name: "Structural Inspection", nameAr: "فحص الهيكل", progress: 0, status: 'not-started' }
    ]
  },
  {
    id: 4,
    name: "Interior Finishing",
    nameAr: "التشطيبات الداخلية",
    description: "Interior work and finishes",
    progress: 0,
    status: 'not-started',
    tasks: [
      { id: 401, name: "Plumbing", nameAr: "السباكة", progress: 0, status: 'not-started' },
      { id: 402, name: "Electrical", nameAr: "الكهرباء", progress: 0, status: 'not-started' },
      { id: 403, name: "Drywall", nameAr: "الجدران الجافة", progress: 0, status: 'not-started' },
      { id: 404, name: "Flooring", nameAr: "الأرضيات", progress: 0, status: 'not-started' },
      { id: 405, name: "Painting", nameAr: "الدهان", progress: 0, status: 'not-started' }
    ]
  },
  {
    id: 5,
    name: "Exterior Finishing",
    nameAr: "التشطيبات الخارجية",
    description: "External finishing work",
    progress: 0,
    status: 'not-started',
    tasks: [
      { id: 501, name: "Facade", nameAr: "الواجهة", progress: 0, status: 'not-started' },
      { id: 502, name: "Landscaping", nameAr: "تنسيق الحدائق", progress: 0, status: 'not-started' },
      { id: 503, name: "Final Inspection", nameAr: "الفحص النهائي", progress: 0, status: 'not-started' }
    ]
  }
];

// Status configuration
const statusConfig = {
  'completed': { label: 'Completed', className: 'bg-green-100 text-green-800' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
  'delayed': { label: 'Delayed', className: 'bg-red-100 text-red-800' },
  'not-started': { label: 'Not Started', className: 'bg-gray-100 text-gray-800' },
};

// Progress icon based on progress percentage
const getProgressIcon = (progress: number) => {
  if (progress === 0) return <CircleDot className="h-4 w-4 text-gray-400" />;
  if (progress < 50) return <CircleHalf className="h-4 w-4 text-blue-500" />;
  if (progress < 100) return <CirclePercent className="h-4 w-4 text-amber-500" />;
  return <CircleDot className="h-4 w-4 text-green-500" />;
};

const ProjectStages = ({ project }: ProjectStagesProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Project Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Accordion type="multiple" className="w-full">
              {projectStages.map((stage) => {
                const stageStatus = statusConfig[stage.status as keyof typeof statusConfig];
                
                return (
                  <AccordionItem key={stage.id} value={`stage-${stage.id}`} className="border rounded-lg px-2 py-1 mb-4">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          {getProgressIcon(stage.progress)}
                          <span className="font-medium text-left">{stage.name}</span>
                          <span className="text-muted-foreground text-sm">{stage.nameAr}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 flex items-center gap-1">
                            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full",
                                  stage.progress === 100 ? "bg-green-500" : 
                                  stage.progress > 50 ? "bg-blue-500" : 
                                  stage.progress > 0 ? "bg-amber-500" : "bg-gray-300"
                                )}
                                style={{ width: `${stage.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{stage.progress}%</span>
                          </div>
                          <Badge className={stageStatus.className}>{stageStatus.label}</Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                        <div className="border-t pt-3">
                          <h4 className="font-medium mb-3">Tasks</h4>
                          <ul className="space-y-2">
                            {stage.tasks.map((task) => {
                              const taskStatus = statusConfig[task.status as keyof typeof statusConfig];
                              return (
                                <li key={task.id} className="border rounded-md p-3">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                      {getProgressIcon(task.progress)}
                                      <span>{task.name}</span>
                                      <span className="text-muted-foreground text-sm">{task.nameAr}</span>
                                    </div>
                                    <Badge className={taskStatus.className}>{taskStatus.label}</Badge>
                                  </div>
                                  <div className="mt-2">
                                    <div className="flex items-center gap-3">
                                      <Progress 
                                        value={task.progress} 
                                        className={cn(
                                          "h-2",
                                          task.progress === 100 ? "bg-muted [&>div]:bg-green-500" : 
                                          task.progress > 0 ? "bg-muted [&>div]:bg-blue-500" : 
                                          "bg-muted [&>div]:bg-gray-400"
                                        )} 
                                      />
                                      <span className="text-sm font-medium">{task.progress}%</span>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectStages;

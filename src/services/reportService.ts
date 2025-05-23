
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ApiStage } from '@/services/stageService';
import { ApiTask } from '@/services/taskService';
import { Project } from '@/types/project';
import { ProjectEquipment } from '@/services/equipmentAssignmentService';
import { getProjectStages } from '@/services/stageService';
import { getStageTasks } from '@/services/taskService';
import { getProjectEquipment } from '@/services/equipmentAssignmentService';

// تنسيق التاريخ للعرض
const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return 'غير محدد';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd');
  } catch (error) {
    return dateString;
  }
};

// تحويل حالة المشروع إلى اللغة العربية
const getArabicProjectStatus = (status: string | undefined) => {
  if (!status) return 'غير محدد';
  return status;
};

export async function generateProjectReport(project: Project): Promise<string> {
  try {
    console.log('بدء إنشاء تقرير للمشروع:', project.id);
    
    // إنشاء وثيقة PDF جديدة
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // تمكين دعم اللغة العربية
    doc.setFont("helvetica");
    doc.setLanguage("ar");
    doc.setR2L(true);

    // إضافة عنوان للتقرير
    doc.setFontSize(22);
    doc.text(`تقرير المشروع: ${project.projectName}`, doc.internal.pageSize.width / 2, 20, { align: 'center' });
    
    // إضافة التاريخ والوقت
    doc.setFontSize(10);
    doc.text(`تاريخ التقرير: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, doc.internal.pageSize.width - 20, 30, { align: 'right' });
    
    // إضافة القسم الأول - معلومات المشروع الأساسية
    doc.setFontSize(16);
    doc.text('معلومات المشروع الأساسية', 20, 40);
    
    const projectData = [
      ['اسم المشروع', project.projectName || 'غير محدد'],
      ['العميل', project.clientName || 'غير محدد'],
      ['عنوان الموقع', project.siteAddress || 'غير محدد'],
      ['مهندس الموقع', project.siteEngineerName || 'غير محدد'],
      ['تاريخ البدء', formatDate(project.startDate?.toString())],
      ['تاريخ الانتهاء المتوقع', formatDate(project.expectedEndDate?.toString())],
      ['حالة المشروع', getArabicProjectStatus(project.projectStatus)],
      ['نسبة الإنجاز', `${project.progress || 0}%`],
      ['الإحداثيات الجغرافية', project.geographicalCoordinates || 'غير محددة'],
    ];
    
    // إذا كان المشروع مكتملاً، أضف تاريخ الإكمال
    if (project.completionDate) {
      projectData.push(['تاريخ الإكمال', formatDate(project.completionDate)]);
    }
    
    // إذا كان المشروع تم تسليمه، أضف تاريخ التسليم
    if (project.handoverDate) {
      projectData.push(['تاريخ التسليم', formatDate(project.handoverDate)]);
    }
    
    // إذا كان المشروع ملغياً، أضف سبب وتاريخ الإلغاء
    if (project.cancellationDate) {
      projectData.push(['تاريخ الإلغاء', formatDate(project.cancellationDate)]);
      if (project.cancellationReason) {
        projectData.push(['سبب الإلغاء', project.cancellationReason]);
      }
    }
    
    // إضافة جدول معلومات المشروع
    autoTable(doc, {
      startY: 45,
      head: [['الوصف', 'القيمة']],
      body: projectData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { font: 'helvetica', halign: 'right' },
    });

    // جلب مراحل المشروع
    let currentY = (doc as any).lastAutoTable.finalY + 15;
    
    try {
      // جلب المراحل من API
      const stages = await getProjectStages(project.id);
      
      if (stages && stages.length > 0) {
        doc.setFontSize(16);
        doc.text('مراحل المشروع', 20, currentY);
        currentY += 5;
        
        const stagesData = stages.map(stage => [
          stage.id.toString(),
          stage.name,
          formatDate(stage.startDate),
          formatDate(stage.endDate),
          `${stage.progress}%`
        ]);
        
        autoTable(doc, {
          startY: currentY,
          head: [['رقم المرحلة', 'اسم المرحلة', 'تاريخ البدء', 'تاريخ الانتهاء', 'نسبة الإنجاز']],
          body: stagesData,
          theme: 'grid',
          headStyles: { fillColor: [46, 204, 113], textColor: 255 },
          styles: { font: 'helvetica', halign: 'right' },
        });
        
        currentY = (doc as any).lastAutoTable.finalY + 15;
        
        // جلب مهام لكل مرحلة
        for (const stage of stages) {
          try {
            const tasks = await getStageTasks(stage.id);
            
            if (tasks && tasks.length > 0) {
              doc.setFontSize(14);
              doc.text(`المهام في مرحلة: ${stage.name}`, 20, currentY);
              currentY += 5;
              
              const tasksData = tasks.map(task => [
                task.id.toString(),
                task.name,
                task.description || 'لا يوجد وصف',
                formatDate(task.startDate),
                formatDate(task.endDate),
                task.isCompleted ? 'مكتملة' : 'قيد التنفيذ'
              ]);
              
              autoTable(doc, {
                startY: currentY,
                head: [['رقم المهمة', 'اسم المهمة', 'الوصف', 'تاريخ البدء', 'تاريخ الانتهاء', 'الحالة']],
                body: tasksData,
                theme: 'grid',
                headStyles: { fillColor: [241, 196, 15], textColor: 0 },
                styles: { font: 'helvetica', halign: 'right' },
              });
              
              currentY = (doc as any).lastAutoTable.finalY + 10;
            }
          } catch (error) {
            console.error(`خطأ في جلب مهام المرحلة ${stage.id}:`, error);
          }
          
          // التحقق من الحاجة إلى إضافة صفحة جديدة
          if (currentY > doc.internal.pageSize.height - 40) {
            doc.addPage();
            currentY = 20;
          }
        }
      }
    } catch (error) {
      console.error('خطأ في جلب مراحل المشروع:', error);
    }
    
    // التحقق من الحاجة إلى إضافة صفحة جديدة
    if (currentY > doc.internal.pageSize.height - 60) {
      doc.addPage();
      currentY = 20;
    }
    
    // جلب المعدات المحجوزة للمشروع
    try {
      const equipment = await getProjectEquipment(project.id);
      
      if (equipment && equipment.length > 0) {
        doc.setFontSize(16);
        doc.text('المعدات المحجوزة للمشروع', 20, currentY);
        currentY += 5;
        
        const equipmentData = equipment.map(item => [
          item.id.toString(),
          item.equipmentName,
          formatDate(item.startDate),
          formatDate(item.endDate),
          item.reservationStatus !== undefined ? 
            (item.reservationStatus === 0 ? 'لم يبدأ' : 
             item.reservationStatus === 1 ? 'بدأ' : 
             item.reservationStatus === 2 ? 'انتهى' : 'غير معروف') : 'غير معروف'
        ]);
        
        autoTable(doc, {
          startY: currentY,
          head: [['رقم الحجز', 'اسم المعدة', 'تاريخ البدء', 'تاريخ الانتهاء', 'الحالة']],
          body: equipmentData,
          theme: 'grid',
          headStyles: { fillColor: [155, 89, 182], textColor: 255 },
          styles: { font: 'helvetica', halign: 'right' },
        });
      }
    } catch (error) {
      console.error('خطأ في جلب معدات المشروع:', error);
    }
    
    // إضافة رقم الصفحة في أسفل كل صفحة
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`الصفحة ${i} من ${totalPages}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    // حفظ الملف باسم يتضمن اسم المشروع والتاريخ
    const fileName = `تقرير_${project.projectName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
    
    console.log('تم إنشاء التقرير بنجاح:', fileName);
    
    // إرجاع رابط تنزيل PDF كـ data URL
    return doc.output('datauristring');
  } catch (error) {
    console.error('خطأ في إنشاء تقرير المشروع:', error);
    throw new Error('فشل في إنشاء تقرير المشروع');
  }
}

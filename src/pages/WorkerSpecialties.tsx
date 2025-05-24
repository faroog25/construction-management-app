
import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NewSpecialtyModal } from '@/components/specialty/NewSpecialtyModal';
import { EditSpecialtyModal } from '@/components/specialty/EditSpecialtyModal';
import { DeleteSpecialtyDialog } from '@/components/specialty/DeleteSpecialtyDialog';
import { useToast } from '@/hooks/use-toast';

export default function WorkerSpecialties() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // حالات فتح وغلق النوافذ المنبثقة
  const [isNewModalOpen, setIsNewModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<Specialty | null>(null);

  // استعلام لجلب بيانات التخصصات
  const { data: specialties = [], isLoading, isError, error } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
  });

  // عرض رسالة خطأ عند فشل تحميل البيانات - في useEffect لتجنب infinite loop
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل التخصصات'
      });
    }
  }, [isError, error, toast]);

  // فتح مودال التعديل مع تحديد التخصص
  const handleEditClick = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsEditModalOpen(true);
  };

  // فتح حوار الحذف مع تحديد التخصص
  const handleDeleteClick = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsDeleteDialogOpen(true);
  };

  // تحديث البيانات بعد إضافة أو تعديل أو حذف
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['specialties'] });
  };

  return (
    <div className="container mx-auto py-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تخصصات العمال</h1>
        <Button onClick={() => setIsNewModalOpen(true)}>
          <Plus className="mr-2" /> إضافة تخصص
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader">جاري التحميل...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>اسم التخصص</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialties.length > 0 ? (
                specialties.map((specialty) => (
                  <TableRow key={specialty.id}>
                    <TableCell>{specialty.id}</TableCell>
                    <TableCell>{specialty.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(specialty)}
                          className="ml-2"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="mr-1">تعديل</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteClick(specialty)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="mr-1">حذف</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    لا توجد تخصصات مسجلة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* مودال إضافة تخصص جديد */}
      <NewSpecialtyModal 
        isOpen={isNewModalOpen}
        setIsOpen={setIsNewModalOpen}
        onSuccess={refreshData}
      />

      {/* مودال تعديل تخصص */}
      <EditSpecialtyModal 
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        specialty={selectedSpecialty}
        onSuccess={refreshData}
      />

      {/* حوار تأكيد حذف تخصص */}
      <DeleteSpecialtyDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        specialty={selectedSpecialty}
        onSuccess={refreshData}
      />
    </div>
  );
}

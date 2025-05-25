
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { updateWorker, getSpecialties, getWorkerById, Specialty, Worker } from '@/services/workerService';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface EditWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkerUpdated: () => void;
  worker: Worker | null;
}

export function EditWorkerModal({ isOpen, onClose, onWorkerUpdated, worker }: EditWorkerModalProps) {
  const { isRtl } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [fetchingWorker, setFetchingWorker] = useState(false);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    thirdName: '',
    lastName: '',
    nationalNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    specialtyId: 0
  });

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await getSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error('Error fetching specialties:', error);
        toast.error(error instanceof Error ? error.message : 'فشل في جلب التخصصات');
      }
    };

    if (isOpen) {
      fetchSpecialties();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      if (!worker || !isOpen) return;
      
      setFetchingWorker(true);
      try {
        const workerDetails = await getWorkerById(worker.id);
        console.log('Worker details fetched:', workerDetails);
        
        setFormData({
          firstName: workerDetails.firstName || '',
          secondName: workerDetails.secondName || '',
          thirdName: workerDetails.thirdName || '',
          lastName: workerDetails.lastName || '',
          nationalNumber: workerDetails.nationalNumber || '',
          phoneNumber: workerDetails.phoneNumber || '',
          email: workerDetails.email || '',
          address: workerDetails.address || '',
          specialtyId: workerDetails.specialtyId || 0
        });
      } catch (error) {
        console.error('Error fetching worker details:', error);
        toast.error('فشل في جلب بيانات العامل');
      } finally {
        setFetchingWorker(false);
      }
    };

    fetchWorkerDetails();
  }, [worker, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker) return;

    setLoading(true);
    try {
      await updateWorker(worker.id, formData);
      toast.success('تم تحديث العامل بنجاح');
      onWorkerUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating worker:', error);
      toast.error(error instanceof Error ? error.message : 'فشل في تحديث العامل');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            تعديل العامل
          </DialogTitle>
        </DialogHeader>
        {fetchingWorker ? (
          <div className="text-center py-4">جاري تحميل بيانات العامل...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondName">الاسم الثاني</Label>
                <Input
                  id="secondName"
                  name="secondName"
                  value={formData.secondName}
                  onChange={handleChange}
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thirdName">الاسم الثالث</Label>
                <Input
                  id="thirdName"
                  name="thirdName"
                  value={formData.thirdName}
                  onChange={handleChange}
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">الاسم الأخير</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalNumber">الرقم الوطني</Label>
                <Input
                  id="nationalNumber"
                  name="nationalNumber"
                  value={formData.nationalNumber}
                  onChange={handleChange}
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialtyId">التخصص</Label>
              <Select
                value={formData.specialtyId ? formData.specialtyId.toString() : ""}
                onValueChange={(value) => setFormData(prev => ({ ...prev, specialtyId: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التخصص" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.id.toString()}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                إلغاء
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

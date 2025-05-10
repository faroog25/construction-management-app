import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { updateWorker, getSpecialties, Specialty, Worker, CreateWorkerRequest } from '@/services/workerService';
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
  const { t, isRtl } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [formData, setFormData] = useState<CreateWorkerRequest>({
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
    if (worker) {
      // Split the full name into its components
      const nameParts = worker.fullName.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        secondName: nameParts[1] || '',
        thirdName: nameParts[2] || '',
        lastName: nameParts[3] || '',
        nationalNumber: '', // These fields need to be fetched from the API
        phoneNumber: '',   // as they're not included in the Worker interface
        email: '',         // You might need to update the Worker interface
        address: '',       // to include these fields
        specialtyId: 0     // This needs to be fetched from the API
      });
    }
  }, [worker]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker) return;

    setLoading(true);
    try {
      await updateWorker(worker.id, formData);
      toast.success(t('workers.update_success'));
      onWorkerUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating worker:', error);
      toast.error(error instanceof Error ? error.message : t('workers.update_error'));
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t('workers.edit')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="specialtyId">التخصص</Label>
            <Select
              value={formData.specialtyId.toString()}
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
      </DialogContent>
    </Dialog>
  );
} 
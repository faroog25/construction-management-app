
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { createWorker, CreateWorkerRequest, getSpecialties, Specialty } from '@/services/workerService';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FormErrors {
  firstName?: string;
  secondName?: string;
  thirdName?: string;
  lastName?: string;
  nationalNumber?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  specialtyId?: string;
}

interface NewWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkerCreated: () => void;
}

export function NewWorkerModal({ isOpen, onClose, onWorkerCreated }: NewWorkerModalProps) {
  const { isRtl } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب';
    }

    // Validate second name
    if (!formData.secondName.trim()) {
      newErrors.secondName = 'الاسم الثاني مطلوب';
    }

    // Validate third name
    if (!formData.thirdName.trim()) {
      newErrors.thirdName = 'الاسم الثالث مطلوب';
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'الاسم الأخير مطلوب';
    }

    // Validate national number
    if (!formData.nationalNumber.trim()) {
      newErrors.nationalNumber = 'الرقم الوطني مطلوب';
    } else if (!/^\d{10}$/.test(formData.nationalNumber)) {
      newErrors.nationalNumber = 'الرقم الوطني يجب أن يتكون من 10 أرقام';
    }

    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'رقم الهاتف مطلوب';
    } else if (!/^07\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 10 أرقام';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }

    // Validate specialty
    if (!formData.specialtyId) {
      newErrors.specialtyId = 'التخصص مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    setLoading(true);

    try {
      await createWorker(formData);
      toast.success('تم إضافة العامل بنجاح');
      onWorkerCreated();
      onClose();
      setFormData({
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
      setErrors({});
    } catch (error) {
      console.error('Error creating worker:', error);
      toast.error(error instanceof Error ? error.message : 'فشل في إضافة العامل');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            إضافة عامل جديد
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">الاسم الأول</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? "border-red-500" : ""}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondName">الاسم الثاني</Label>
              <Input
                id="secondName"
                name="secondName"
                value={formData.secondName}
                onChange={handleChange}
                className={errors.secondName ? "border-red-500" : ""}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.secondName && (
                <p className="text-sm text-red-500">{errors.secondName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thirdName">الاسم الثالث</Label>
              <Input
                id="thirdName"
                name="thirdName"
                value={formData.thirdName}
                onChange={handleChange}
                className={errors.thirdName ? "border-red-500" : ""}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.thirdName && (
                <p className="text-sm text-red-500">{errors.thirdName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">الاسم الأخير</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? "border-red-500" : ""}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalNumber">الرقم الوطني</Label>
              <Input
                id="nationalNumber"
                name="nationalNumber"
                value={formData.nationalNumber}
                onChange={handleChange}
                className={errors.nationalNumber ? "border-red-500" : ""}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.nationalNumber && (
                <p className="text-sm text-red-500">{errors.nationalNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">رقم الهاتف</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? "border-red-500" : ""}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "border-red-500" : ""}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialtyId">التخصص</Label>
            <Select
              value={formData.specialtyId.toString()}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, specialtyId: parseInt(value) }));
                if (errors.specialtyId) {
                  setErrors(prev => ({ ...prev, specialtyId: undefined }));
                }
              }}
            >
              <SelectTrigger className={errors.specialtyId ? "border-red-500" : ""}>
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
            {errors.specialtyId && (
              <p className="text-sm text-red-500">{errors.specialtyId}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

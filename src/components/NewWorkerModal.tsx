import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface NewWorkerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkerCreated: () => void;
}

export function NewWorkerModal({ isOpen, onOpenChange, onWorkerCreated }: NewWorkerModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalNumber, setNationalNumber] = useState('');
  const [address, setAddress] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !phoneNumber || !nationalNumber || !address || !hireDate) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }

    try {
      setIsSubmitting(true);
      const worker = {
        firstName,
        lastName,
        email,
        phoneNumber,
        nationalNumber,
        address,
        hireDate,
      };

      // TODO: Implement createWorker service call
      // await createWorker(worker);
      
      toast.success('تمت الإضافة بنجاح');
      onOpenChange(false);
      onWorkerCreated();
    } catch (error: unknown) {
      console.error('Error creating worker:', error);
      const errorMessage = error instanceof Error ? error.message : 'فشلت الإضافة';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة عامل جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">الاسم الأول *</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="أدخل الاسم الأول"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">الاسم الأخير *</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="أدخل الاسم الأخير"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل البريد الإلكتروني"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">رقم الهاتف *</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="أدخل رقم الهاتف"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationalNumber">الرقم الوطني *</Label>
            <Input
              id="nationalNumber"
              value={nationalNumber}
              onChange={(e) => setNationalNumber(e.target.value)}
              placeholder="أدخل الرقم الوطني"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">العنوان *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="أدخل العنوان"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hireDate">تاريخ التعيين *</Label>
            <Input
              id="hireDate"
              type="date"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإضافة...' : 'إضافة العامل'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
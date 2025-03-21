import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Client, createClient, ClientType } from '@/services/clientService';

interface NewClientModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated: () => void;
}

export function NewClientModal({ isOpen, onOpenChange, onClientCreated }: NewClientModalProps) {
  const [newClient, setNewClient] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    clientType: ClientType.Individual,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form data
    if (!newClient.fullName.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }
    if (!newClient.email.trim()) {
      toast.error('البريد الإلكتروني مطلوب');
      return;
    }
    if (!newClient.phoneNumber.trim()) {
      toast.error('رقم الهاتف مطلوب');
      return;
    }

    try {
      await createClient(newClient);
      toast.success('تمت الإضافة بنجاح');
      onClientCreated();
      onOpenChange(false);
      setNewClient({
        fullName: '',
        email: '',
        phoneNumber: '',
        clientType: ClientType.Individual,
      });
    } catch (error: unknown) {
      console.error('Error creating client:', error);
      const errorMessage = error instanceof Error ? error.message : 'فشلت الإضافة';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة عميل جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <Input
                id="fullName"
                value={newClient.fullName}
                onChange={(e) => setNewClient({ ...newClient, fullName: e.target.value.trim() })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value.trim() })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">رقم الهاتف</Label>
              <Input
                id="phoneNumber"
                value={newClient.phoneNumber}
                onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value.trim() })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientType">نوع العميل</Label>
              <Select
                value={newClient.clientType}
                onValueChange={(value) => setNewClient({ ...newClient, clientType: value as ClientType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع العميل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ClientType.Individual}>فرد</SelectItem>
                  <SelectItem value={ClientType.Corporate}>شركة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">إضافة العميل</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
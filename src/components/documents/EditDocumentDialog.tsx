
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Document } from '@/types/document';
import { editDocument } from '@/services/documentService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';

// Define validation schema
const documentSchema = z.object({
  name: z.string().min(1, { message: 'اسم المستند مطلوب' }),
  description: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

interface EditDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onDocumentUpdated: () => void;
}

export function EditDocumentDialog({
  isOpen,
  onClose,
  document,
  onDocumentUpdated,
}: EditDocumentDialogProps) {
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: document?.name || '',
      description: document?.description || '',
    },
  });

  React.useEffect(() => {
    if (document) {
      form.reset({
        name: document.name || '',
        description: document.description || '',
      });
    }
  }, [document, form]);

  const { isSubmitting, isDirty } = form.formState;

  async function onSubmit(values: DocumentFormValues) {
    if (!document) return;
    
    try {
      const result = await editDocument(document.id, {
        name: values.name,
        description: values.description || '',
      });
      
      if (result.success) {
        toast.success('تم تعديل المستند بنجاح');
        onDocumentUpdated();
        onClose();
      } else {
        toast.error(result.message || 'فشل في تعديل المستند');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('فشل في تعديل المستند');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right text-xl">تعديل المستند</DialogTitle>
          <DialogDescription className="text-right">
            قم بتعديل معلومات المستند الأساسية
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المستند</FormLabel>
                  <FormControl>
                    <Input dir="rtl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف المستند</FormLabel>
                  <FormControl>
                    <Textarea
                      dir="rtl"
                      placeholder="إضافة وصف للمستند (اختياري)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations/auth";
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from '@/config/api';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // استخراج البريد الإلكتروني والتوكن من URL parameters
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  
  // التحقق من وجود المعاملات المطلوبة
  useEffect(() => {
    if (!email || !token) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: t('Invalid reset link. Please request a new password reset email.'),
      });
      navigate('/login');
    }
  }, [email, token, navigate, toast, t]);

  // استخدام React Hook Form مع مخطط التحقق Zod
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    if (!email || !token) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: t('Invalid reset link. Please request a new password reset email.'),
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resetPassword?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&newPassowrd=${encodeURIComponent(values.password)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('Failed to reset password. Please try again.'));
      }

      toast({
        title: t('Success'),
        description: t('Your password has been reset successfully.'),
        variant: "success",
      });

      // توجيه المستخدم إلى صفحة تسجيل الدخول
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: error.message || t('Failed to reset password. Please try again.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إذا لم تكن هناك معاملات صالحة، لا نعرض شيئاً (سيتم التوجيه)
  if (!email || !token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-2xl">C</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            {t('Reset Your Password')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('Enter a new password for your account')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>{t('New Password')}</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t('Enter your new password')}
                          className="pl-10"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>{t('Confirm New Password')}</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t('Confirm your new password')}
                          className="pl-10"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('Resetting...') : t('Reset Password')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            {t('Back to Login')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;

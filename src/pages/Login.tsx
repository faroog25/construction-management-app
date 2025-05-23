
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from '@/config/api';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Login = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  // Always reset form values when component mounts to ensure email is never pre-filled
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    // Add this to prevent browser auto-fill
    shouldUnregister: true,
  });

  // Reset login form when the component mounts
  React.useEffect(() => {
    form.reset({
      email: "",
      password: ""
    });
  }, [form]);

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || t('Invalid email or password. Please try again.'));
      }

      // حفظ بيانات المستخدم وتوكن التسجيل في localStorage
      if (data.success && data.data.accessToken) {
        // حفظ التوكن والمعلومات الأساسية
        localStorage.setItem('authToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refereshToken);
        localStorage.setItem('user', JSON.stringify({
          email: data.data.email,
          name: data.data.name,
          userName: data.data.userName,
        }));
        localStorage.setItem('isAuthenticated', 'true');
        
        toast({
          title: t('Success'),
          description: t('You have been successfully logged in.'),
          variant: "success",
        });
        
        // توجيه المستخدم إلى الصفحة الرئيسية
        navigate('/dashboard');
      } else {
        throw new Error(t('Authentication failed. Please try again.'));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: error.message || t('Invalid email or password. Please try again.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues('email');
    
    if (!email) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: t('Please enter your email first'),
      });
      return;
    }

    // التحقق من صحة الإيميل
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: t('Please enter a valid email'),
      });
      return;
    }

    setIsForgotPasswordLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgotPassword?email=${encodeURIComponent(email)}`, {
        method: 'POST',
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
        description: t('Password reset email has been sent to your email address.'),
        variant: "success",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: error.message || t('Failed to reset password. Please try again.'),
      });
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

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
            {t('Welcome to Construction Pro')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('Enter your credentials to login')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>{t('Email')}</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder={t('Enter your email')}
                          className="pl-10"
                          disabled={isLoading}
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>{t('Password')}</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t('Enter your password')}
                          className="pl-10"
                          disabled={isLoading}
                          autoComplete="off"
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
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Optional: Remember me checkbox */}
                </div>
                <Button 
                  variant="link" 
                  className="px-0 text-sm" 
                  disabled={isLoading || isForgotPasswordLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    handleForgotPassword();
                  }}
                >
                  {isForgotPasswordLoading ? t('Submitting...') : t('Forgot Password?')}
                </Button>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading || isForgotPasswordLoading}>
                {isLoading ? t('Signing in...') : t('Login')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            {t('No account?')}{' '}
            <Button 
              variant="link" 
              className="px-1" 
              disabled={isLoading || isForgotPasswordLoading}
              onClick={() => navigate('/register')}
            >
              {t('Sign Up')}
            </Button>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/welcome')}
            disabled={isLoading || isForgotPasswordLoading}
          >
            {t('Back to Home')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

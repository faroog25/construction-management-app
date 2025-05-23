
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { Check, AlertCircle } from 'lucide-react';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const email = searchParams.get('email');
  const errorMessage = searchParams.get('message');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // محاكاة وقت التحميل لتحسين تجربة المستخدم
    const timer = setTimeout(() => {
      setLoading(false);
      
      if (success) {
        toast({
          title: t('Success'),
          description: t('Email verified successfully'),
          variant: "success",
        });
      } else {
        toast({
          variant: "destructive",
          title: t('Error'),
          description: errorMessage ? decodeURIComponent(errorMessage) : t('Email verification failed'),
        });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [success, errorMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {loading ? (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : success ? (
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900 p-3">
                <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
            </div>
          )}
          <CardTitle className="text-2xl text-center font-bold">
            {loading ? t('Verifying Your Email') : (
              success ? t('Email Verified') : t('Verification Failed')
            )}
          </CardTitle>
          <CardDescription className="text-center">
            {loading ? t('Please wait while we verify your email address') : (
              success 
                ? t('Your email {{email}} has been successfully verified. You can now sign in to your account.', { email: email || '' })
                : t('There was an issue verifying your email address')
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="text-center py-4">
              {success ? (
                <p className="text-green-600 dark:text-green-400">
                  {t('Thank you for verifying your email address. You now have full access to all features.')}
                </p>
              ) : (
                <p className="text-red-600 dark:text-red-400">
                  {errorMessage 
                    ? decodeURIComponent(errorMessage).replace(/"/g, '') 
                    : t('Your verification link may be expired or invalid. Please request a new verification email.')}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!loading && (
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full"
              variant={success ? "default" : "outline"}
            >
              {success ? t('Go to Login') : t('Back to Login')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerification;

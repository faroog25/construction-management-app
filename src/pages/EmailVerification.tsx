
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from "@/components/ui/use-toast";
import { Check } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setVerifying(false);
      toast({
        variant: "destructive",
        title: t('Error'),
        description: t('Email verification link is invalid or expired'),
      });
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      // In a real app, you would make an API call to verify the email
      // For demo purposes, we're simulating a successful verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulating successful verification
      setSuccess(true);
      toast({
        title: t('Success'),
        description: t('Email verified successfully'),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('Error'),
        description: t('Failed to verify email'),
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {success && (
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
          )}
          <CardTitle className="text-2xl text-center font-bold">
            {verifying ? t('Verifying Your Email') : (
              success ? t('Email Verified') : t('Verification Failed')
            )}
          </CardTitle>
          <CardDescription className="text-center">
            {verifying ? t('Please wait while we verify your email address') : (
              success ? t('Your email has been successfully verified. You can now sign in to your account.') : t('There was an issue verifying your email address')
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verifying ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="text-center py-4">
              {success ? (
                <p>{t('Thank you for verifying your email address. You now have full access to all features.')}</p>
              ) : (
                <p>{t('Your verification link may be expired or invalid. Please request a new verification email.')}</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!verifying && (
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

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Gift, ArrowLeft, Check } from 'lucide-react';
import { api, tokenManager } from '@/lib/api';
import { appConfig } from '@/config';
import toast from 'react-hot-toast';

// Validation schema
const registerSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(appConfig.validation.name.minLength, `First name must be at least ${appConfig.validation.name.minLength} characters`)
    .max(appConfig.validation.name.maxLength, `First name must not exceed ${appConfig.validation.name.maxLength} characters`)
    .regex(appConfig.validation.name.pattern, 'First name contains invalid characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(appConfig.validation.name.minLength, `Last name must be at least ${appConfig.validation.name.minLength} characters`)
    .max(appConfig.validation.name.maxLength, `Last name must not exceed ${appConfig.validation.name.maxLength} characters`)
    .regex(appConfig.validation.name.pattern, 'Last name contains invalid characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .regex(appConfig.validation.email.pattern, 'Please enter a valid email address'),
  password: z
    .string()
    .min(appConfig.validation.password.minLength, `Password must be at least ${appConfig.validation.password.minLength} characters`)
    .refine(
      (password) => !appConfig.validation.password.requireUppercase || /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter'
    )
    .refine(
      (password) => !appConfig.validation.password.requireLowercase || /[a-z]/.test(password),
      'Password must contain at least one lowercase letter'
    )
    .refine(
      (password) => !appConfig.validation.password.requireNumbers || /\d/.test(password),
      'Password must contain at least one number'
    )
    .refine(
      (password) => !appConfig.validation.password.requireSpecialChars || /[!@#$%^&*(),.?":{}|<>]/.test(password),
      'Password must contain at least one special character'
    ),
  confirm_password: z.string().min(1, 'Please confirm your password'),
  date_of_birth: z.string().optional(),
  marketing_consent: z.boolean().optional(),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      marketing_consent: true,
      terms_accepted: false,
    },
    mode: 'onChange',
  });

  const watchedPassword = watch('password');

  // Check if user is already authenticated
  useEffect(() => {
    // Only run on client side and after initial mount
    if (typeof window !== 'undefined') {
      const token = tokenManager.getAccessToken();
      if (token) {
        router.replace('/dashboard');
      }
    }
  }, [router]);

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(watchedPassword || '');

  // Handle step navigation
  const handleNext = async () => {
    const fieldsToValidate = step === 1 
      ? ['first_name', 'last_name', 'email'] 
      : ['password', 'confirm_password'];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Prepare registration data
      const registerData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        date_of_birth: data.date_of_birth || undefined,
        marketing_consent: data.marketing_consent || false,
      };

      const response = await api.register(registerData);
      const { access_token, refresh_token, user } = response.data;

      // Store tokens
      tokenManager.setTokens(access_token, refresh_token);

      // Store user data
      if (typeof window !== 'undefined') {
        localStorage.setItem(appConfig.storage.user, JSON.stringify(user));
      }

      // Track registration event with PostHog
      const { trackEvent, identifyUser } = await import('@/lib/analytics');
      
      // Identify the user
      identifyUser(user.id, {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
        subscription_tier: user.subscription_tier,
      });

      // Track registration event
      trackEvent('user_register', {
        method: 'email',
        marketing_consent: data.marketing_consent,
        user_id: user.id,
        source: 'web',
        timestamp: new Date().toISOString(),
      });

      // Show success message
      toast.success('Account created successfully! Welcome to GiftSync.');

      // Redirect to onboarding or dashboard
      setTimeout(() => {
        router.push('/onboarding');
      }, 100);
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.status === 422) {
        // Handle validation errors
        if (error.details?.email) {
          setError('email', { message: error.details.email[0] });
          setStep(1); // Go back to email step
        }
        if (error.details?.password) {
          setError('password', { message: error.details.password[0] });
          setStep(2); // Go back to password step
        }
        if (error.details?.first_name) {
          setError('first_name', { message: error.details.first_name[0] });
          setStep(1);
        }
        if (error.details?.last_name) {
          setError('last_name', { message: error.details.last_name[0] });
          setStep(1);
        }
      } else if (error.status === 409) {
        setError('email', { message: 'An account with this email already exists' });
        setStep(1);
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        toast.error('Network error: Unable to connect to server. Please check your connection and try again.');
      } else if (error.status >= 500) {
        toast.error('Server error: The service is temporarily unavailable. Please try again later.');
      } else {
        toast.error(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social registration (placeholder)
  const handleSocialRegistration = (provider: string) => {
    toast.error(`${provider} registration coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">GiftSync</h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Start discovering perfect gifts with AI
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    stepNumber <= step
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber < step ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <div className="text-sm text-gray-600">
                Step {step} of 3
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <p className="text-sm text-gray-600">Tell us a bit about yourself</p>
                  </div>

                  {/* First Name */}
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                      First name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('first_name')}
                        type="text"
                        id="first_name"
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                          errors.first_name 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Enter your first name"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Last name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('last_name')}
                        type="text"
                        id="last_name"
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                          errors.last_name 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Enter your last name"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                          errors.email 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Enter your email"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Date of Birth (Optional) */}
                  <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of birth <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      {...register('date_of_birth')}
                      type="date"
                      id="date_of_birth"
                      lang="en-GB"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400"
                      disabled={isLoading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This helps us provide age-appropriate gift recommendations. Use DD/MM/YYYY format.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Password */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Create Password</h3>
                    <p className="text-sm text-gray-600">Choose a strong password for your account</p>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                          errors.password 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Create a password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {watchedPassword && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded ${
                                level <= passwordStrength
                                  ? passwordStrength <= 2
                                    ? 'bg-red-500'
                                    : passwordStrength <= 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Password strength: {
                            passwordStrength <= 2 ? 'Weak' :
                            passwordStrength <= 3 ? 'Medium' : 'Strong'
                          }
                        </p>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('confirm_password')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm_password"
                        className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                          errors.confirm_password 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Confirm your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Terms and Marketing */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Almost done!</h3>
                    <p className="text-sm text-gray-600">Review and accept our terms</p>
                  </div>

                  {/* Marketing Consent */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        {...register('marketing_consent')}
                        id="marketing_consent"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketing_consent" className="text-gray-700">
                        I'd like to receive emails about new features, gift recommendations, and special offers
                      </label>
                      <p className="text-gray-500 text-xs mt-1">
                        You can unsubscribe at any time
                      </p>
                    </div>
                  </div>

                  {/* Terms Acceptance */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        {...register('terms_accepted')}
                        id="terms_accepted"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms_accepted" className="text-gray-700">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                  {errors.terms_accepted && (
                    <p className="text-sm text-red-600">{errors.terms_accepted.message}</p>
                  )}
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                )}
                
                {step < 3 ? (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    Continue
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      'Create account'
                    )}
                  </motion.button>
                )}
              </div>
            </form>

            {/* Social Registration (only on step 1) */}
            {step === 1 && (
              <>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSocialRegistration('Google')}
                    disabled={isLoading}
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>

                  <button
                    onClick={() => handleSocialRegistration('Facebook')}
                    disabled={isLoading}
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>

          {/* Sign In Link */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
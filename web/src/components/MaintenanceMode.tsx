import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Mail, Sparkles, Heart, Clock, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface MaintenanceModeProps {
  onSignup?: (email: string) => void;
}

export default function MaintenanceMode({ onSignup }: MaintenanceModeProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the optional onSignup callback
      if (onSignup) {
        await onSignup(email);
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      toast.success('Thanks! We\'ll notify you when we\'re back online.');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col items-center justify-center px-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary-500 rounded-full blur-3xl" />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-20 bg-yellow-400 rounded-full p-3 shadow-lg"
      >
        <Gift className="w-6 h-6 text-white" />
      </motion.div>
      
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-40 right-20 bg-pink-400 rounded-full p-3 shadow-lg"
      >
        <Heart className="w-6 h-6 text-white" />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-40 left-40 bg-blue-400 rounded-full p-3 shadow-lg"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-bold text-gray-900">GiftSync</span>
        </motion.div>

        {/* Maintenance Icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 text-amber-600 rounded-full mb-8"
        >
          <Clock className="w-10 h-10" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          We're making things even{' '}
          <span className="text-primary-600">better</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          GiftSync is temporarily offline while we upgrade our AI recommendation engine 
          and add exciting new features. We'll be back soon with an even more magical gift discovery experience!
        </p>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: 'Enhanced AI',
              description: 'Smarter recommendations than ever'
            },
            {
              icon: <Heart className="w-6 h-6" />,
              title: 'Better UX',
              description: 'Improved swipe experience'
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: 'Social Features',
              description: 'Gift together with friends'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Email Signup */}
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl mb-4">
              <Mail className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Be the first to know
            </h3>
            <p className="text-gray-600 mb-6">
              Get notified as soon as we're back online with exclusive early access to new features.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  disabled={isSubmitting}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing up...
                  </>
                ) : (
                  <>
                    Notify Me
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-md mx-auto"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-xl mb-4">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              You're all set!
            </h3>
            <p className="text-green-700">
              We'll send you an email as soon as GiftSync is back online with exciting new features.
            </p>
          </motion.div>
        )}

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 mb-4">
            Join over 50,000 users who trust GiftSync
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
            <span>• AI-Powered Recommendations</span>
            <span>• 1M+ Products Curated</span>
            <span>• 95% Satisfaction Rate</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
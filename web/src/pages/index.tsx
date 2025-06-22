import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  Gift, 
  Sparkles, 
  Heart, 
  Zap, 
  Users, 
  Star, 
  ArrowRight, 
  Play,
  CheckCircle,
  Smartphone,
  Monitor,
  Globe,
  LogOut,
  User
} from 'lucide-react';
import { tokenManager } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check authentication status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = tokenManager.getAccessToken();
      const userData = localStorage.getItem('giftsync_user');
      
      if (token) {
        setIsLoggedIn(true);
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (error) {
            console.warn('Invalid user data in localStorage, clearing it');
            localStorage.removeItem('giftsync_user');
            setUser(null);
          }
        }
      }
    }
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout(); // Use AuthContext logout method for complete cleanup
      // AuthContext logout already handles:
      // - Backend API call
      // - Clear all localStorage data  
      // - Update global auth state
      // - Show success toast
      // - Redirect to homepage
      
      // Update local state to reflect logout immediately
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Recommendations',
      description: 'Our advanced ML algorithms learn your preferences to suggest perfect gifts every time.',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Swipe-Based Discovery',
      description: 'Like Tinder for gifts! Swipe through products to train our AI and discover what you love.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Gift Links',
      description: 'Create shareable gift links in seconds. Perfect for wishlists and gift exchanges.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Social Gifting',
      description: 'Share with friends and family. Collaborate on gift ideas and never give duplicate gifts.',
    },
  ];

  const stats = [
    { number: '1M+', label: 'Products Curated' },
    { number: '50K+', label: 'Happy Users' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'AI Learning' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Gift Enthusiast',
      avatar: '/images/testimonials/sarah.jpg',
      content: 'GiftSync helped me find the perfect birthday gift for my sister. The AI recommendations were spot-on!',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Busy Professional',
      avatar: '/images/testimonials/mike.jpg',
      content: 'As someone who struggles with gift-giving, this app is a lifesaver. Quick, easy, and always great suggestions.',
      rating: 5,
    },
    {
      name: 'Emma Davis',
      role: 'Mother of 3',
      avatar: '/images/testimonials/emma.jpg',
      content: 'Love how it learns what my kids like. No more guessing what toys they actually want!',
      rating: 5,
    },
  ];

  return (
    <>
      <Head>
        <title>GiftSync - AI-Powered Gift Recommendations</title>
        <meta
          name="description"
          content="Discover perfect gifts with AI. Swipe through products, get personalised recommendations, and create shareable gift links. Make gift-giving effortless with GiftSync."
        />
        <meta name="keywords" content="gifts, AI recommendations, gift ideas, personalised gifts, gift finder" />
        <meta property="og:title" content="GiftSync - AI-Powered Gift Recommendations" />
        <meta
          property="og:description"
          content="Discover perfect gifts with AI. Swipe through products, get personalised recommendations, and create shareable gift links."
        />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://giftsync.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://giftsync.com" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GiftSync</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                How it Works
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors">
                Reviews
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-primary-600 transition-colors">
                Pricing
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="font-medium">
                      {user?.first_name || 'User'}
                    </span>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/dashboard"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/auth/register"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Gift Discovery
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Find the{' '}
                <span className="text-primary-600">perfect gift</span>{' '}
                with AI
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Swipe through products, train our AI to understand your taste, and get personalised 
                gift recommendations that actually make sense. No more guessing, no more gift fails.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Start Discovering
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white mb-6">
                    <h3 className="text-lg font-semibold mb-2">Your Perfect Match</h3>
                    <p className="text-primary-100">AI found the perfect gift based on your swipes!</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">97% match confidence</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Based on 50+ swipes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Free shipping included</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-4 -left-8 bg-yellow-400 rounded-full p-3 z-20 shadow-lg"
              >
                <Gift className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute bottom-4 -right-8 bg-pink-400 rounded-full p-3 z-20 shadow-lg"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary-500 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why GiftSync Works Better
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've reinvented gift discovery using cutting-edge AI and intuitive design. 
              Here's what makes us different.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get personalised gift recommendations in three simple steps
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {[
              {
                step: '01',
                title: 'Swipe & Discover',
                description: 'Browse through curated products and swipe right on items you love, left on items you don\'t.',
                icon: <Heart className="w-8 h-8" />,
              },
              {
                step: '02',
                title: 'AI Learns Your Taste',
                description: 'Our machine learning algorithms analyse your preferences to understand your unique style.',
                icon: <Sparkles className="w-8 h-8" />,
              },
              {
                step: '03',
                title: 'Get Perfect Matches',
                description: 'Receive personalised recommendations and create shareable gift links for any occasion.',
                icon: <Gift className="w-8 h-8" />,
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-4 border-primary-200 rounded-full mb-6 relative z-10">
                  <div className="text-primary-600">
                    {step.icon}
                  </div>
                </div>
                
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-primary-100 -z-10">
                  {step.step}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 relative">
                  {step.title}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>

                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-primary-200 transform translate-x-8" />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Try It Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy users who've discovered the joy of perfect gift-giving
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                    <span className="text-primary-800 font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Available Everywhere
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              Access GiftSync on all your devices. Seamless sync across platforms means your preferences travel with you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <Globe className="w-12 h-12" />,
                title: 'Web App',
                description: 'Full-featured experience in your browser',
              },
              {
                icon: <Smartphone className="w-12 h-12" />,
                title: 'Mobile Apps',
                description: 'Native iOS and Android applications',
              },
              {
                icon: <Monitor className="w-12 h-12" />,
                title: 'Desktop',
                description: 'Coming soon to Windows and macOS',
              },
            ].map((platform, index) => (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6">
                  {platform.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {platform.title}
                </h3>
                <p className="text-primary-100">
                  {platform.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to revolutionize your gift-giving?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who've discovered the perfect way to find and give gifts. 
              Start your free account today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 bg-white border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                >
                  Try Demo
                  <Play className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl opacity-20 blur-sm"></div>
                  </div>
                  <span className="text-2xl font-bold text-white">GiftSync</span>
                </div>
                
                <p className="text-slate-300 mb-8 text-lg leading-relaxed max-w-md">
                  AI-powered gift recommendations that understand your style and surprise your loved ones.
                </p>
                
                {/* Social Links */}
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm font-medium">Follow us</span>
                  <div className="flex gap-3">
                    {[
                      { name: 'Twitter', icon: '𝕏', href: '#' },
                      { name: 'Instagram', icon: '📷', href: '#' },
                      { name: 'LinkedIn', icon: '💼', href: '#' }
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        aria-label={social.name}
                      >
                        <span className="text-lg">{social.icon}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Navigation Columns */}
              <div className="grid sm:grid-cols-3 gap-8 lg:col-span-3">
                {/* Product */}
                <div>
                  <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Product</h3>
                  <ul className="space-y-4">
                    {[
                      { name: 'How it Works', href: '/help' },
                      { name: 'Try Demo', href: '/discover' },
                      { name: 'Pricing', href: '/pricing' },
                      { name: 'Mobile App', href: '#', badge: 'Soon' }
                    ].map((item) => (
                      <li key={item.name}>
                        <Link 
                          href={item.href}
                          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
                        >
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full font-medium">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Company */}
                <div>
                  <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Company</h3>
                  <ul className="space-y-4">
                    {[
                      { name: 'About Us', href: '/about' },
                      { name: 'Contact', href: '/contact' },
                      { name: 'Careers', href: '/careers', badge: 'Hiring' },
                      { name: 'Press Kit', href: '#' }
                    ].map((item) => (
                      <li key={item.name}>
                        <Link 
                          href={item.href}
                          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
                        >
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-medium">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Support & Legal */}
                <div>
                  <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Support</h3>
                  <ul className="space-y-4">
                    {[
                      { name: 'Help Centre', href: '/help' },
                      { name: 'Privacy Policy', href: '/privacy' },
                      { name: 'Terms of Service', href: '/terms' },
                      { name: 'Accessibility', href: '/accessibility' },
                      { name: 'Cookie Policy', href: '/cookie-policy' }
                    ].map((item) => (
                      <li key={item.name}>
                        <Link 
                          href={item.href}
                          className="text-slate-400 hover:text-white transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-700/50">
            <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
                <span>&copy; 2025 GiftSync. All rights reserved.</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span>🇬🇧</span>
                  <span>Made in the UK</span>
                </div>
                <span>•</span>
                <Link 
                  href="/affiliate-disclosure" 
                  className="hover:text-slate-300 transition-colors"
                >
                  Amazon Associate Programme
                </Link>
                <span>•</span>
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
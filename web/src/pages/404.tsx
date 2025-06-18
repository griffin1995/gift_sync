import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, Home, Search, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page Not Found - GiftSync</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col items-center justify-center px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 w-32 h-32 gradient-primary rounded-full opacity-10 blur-3xl"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-20 w-48 h-48 gradient-secondary rounded-full opacity-10 blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 gradient-warm rounded-full opacity-5 blur-3xl"
          />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              bounce: 0.4
            }}
            className="relative mb-8"
          >
            <div className="w-32 h-32 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow-lg">
              <Gift className="w-16 h-16 text-white" />
            </div>
            
            {/* Floating sparkles */}
            <motion.div
              animate={{ 
                y: [-10, -20, -10],
                x: [0, 5, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-6 h-6 text-primary-400" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                x: [0, -8, 0],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-2 -left-6"
            >
              <Sparkles className="w-4 h-4 text-secondary-400" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [-5, -25, -5],
                x: [0, 3, 0],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-0 right-8"
            >
              <Sparkles className="w-5 h-5 text-primary-300" />
            </motion.div>
          </motion.div>

          {/* 404 Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-8xl font-bold text-gradient mb-4">404</h1>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Gift Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Looks like this page went gift hunting and got lost! Don't worry, 
              we'll help you find exactly what you're looking for.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="btn-primary btn-hover-lift">
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/discover" className="btn-secondary btn-hover-lift">
                <Gift className="w-5 h-5" />
                Discover Gifts
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/search" className="btn-outline btn-hover-lift">
                <Search className="w-5 h-5" />
                Search
              </Link>
            </motion.div>
          </motion.div>

          {/* Popular Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-light rounded-2xl p-6 max-w-md mx-auto border border-white/20"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
            <div className="space-y-3">
              <Link
                href="/discover"
                className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors group"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <Gift className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium">Discover Gifts</span>
              </Link>
              
              <Link
                href="/auth/register"
                className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors group"
              >
                <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                  <Sparkles className="w-4 h-4 text-secondary-600" />
                </div>
                <span className="font-medium">Sign Up Free</span>
              </Link>
              
              <Link
                href="/dashboard"
                className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors group"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Home className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium">Dashboard</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">Contact us</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
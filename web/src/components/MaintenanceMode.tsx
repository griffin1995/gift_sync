import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Mail, Sparkles, Heart, Clock, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface MaintenanceModeProps {
  onSignup?: (email: string) => void;
}

// Neural Network Animation Component
const NeuralNetwork = () => {
  const [nodes, setNodes] = useState<Array<{id: string, x: number, y: number}>>([]);
  const [connections, setConnections] = useState<Array<{from: string, to: string}>>([]);

  useEffect(() => {
    // Generate neural network nodes
    const nodeCount = 25;
    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: `node-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));

    // Generate connections between nearby nodes
    const newConnections: Array<{from: string, to: string}> = [];
    newNodes.forEach((node, i) => {
      const nearbyNodes = newNodes.filter((otherNode, j) => {
        if (i === j) return false;
        const distance = Math.sqrt(
          Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
        );
        return distance < 25; // Connect nodes within 25% distance
      });
      
      // Connect to 2-4 nearby nodes
      const connectionsToMake = Math.min(Math.floor(Math.random() * 3) + 2, nearbyNodes.length);
      nearbyNodes.slice(0, connectionsToMake).forEach(nearbyNode => {
        newConnections.push({ from: node.id, to: nearbyNode.id });
      });
    });

    setNodes(newNodes);
    setConnections(newConnections);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connections */}
        {connections.map((connection, i) => {
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <motion.line
              key={`connection-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="url(#gradient)"
              strokeWidth="0.1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ 
                duration: 2, 
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 3
              }}
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="0.3"
            fill="url(#nodeGradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ 
              duration: 0.6, 
              delay: i * 0.05,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 4
            }}
          />
        ))}
        
        {/* Gradients */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f03dff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f03dff" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#f03dff" stopOpacity="1" />
            <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f03dff" stopOpacity="0.6" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

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
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Neural Network Background */}
      <NeuralNetwork />
      
      {/* Subtle overlay for better content readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 z-10" />

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-20 bg-primary-500/30 backdrop-blur-sm rounded-full p-3 shadow-lg z-20"
      >
        <Gift className="w-5 h-5 text-primary-300" />
      </motion.div>
      
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-20 right-20 bg-secondary-500/30 backdrop-blur-sm rounded-full p-3 shadow-lg z-20"
      >
        <Heart className="w-5 h-5 text-secondary-300" />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-20 bg-primary-500/30 backdrop-blur-sm rounded-full p-3 shadow-lg z-20"
      >
        <Sparkles className="w-5 h-5 text-primary-300" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center relative z-20 flex flex-col h-full justify-center py-8"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">GiftSync</span>
        </motion.div>

        {/* Maintenance Icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/50 backdrop-blur-sm text-primary-400 rounded-full mb-6"
        >
          <Clock className="w-8 h-8" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          We're making things even{' '}
          <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">better</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-300 mb-6 leading-relaxed max-w-2xl mx-auto">
          GiftSync is temporarily offline while we upgrade our AI recommendation engine 
          and add exciting new features. We'll be back soon with an even more magical gift discovery experience!
        </p>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: <Sparkles className="w-5 h-5" />,
              title: 'Enhanced AI',
              description: 'Smarter recommendations than ever'
            },
            {
              icon: <Heart className="w-5 h-5" />,
              title: 'Better UX',
              description: 'Improved swipe experience'
            },
            {
              icon: <Users className="w-5 h-5" />,
              title: 'Social Features',
              description: 'Gift together with friends'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-primary-500/50 transition-all"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 rounded-lg mb-3">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white mb-1 text-sm">{feature.title}</h3>
              <p className="text-xs text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Email Signup */}
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 max-w-md mx-auto"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 rounded-lg mb-4">
              <Mail className="w-5 h-5" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">
              Be the first to know
            </h3>
            <p className="text-slate-400 mb-4 text-sm">
              Get notified as soon as we're back online with exclusive early access to new features.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-white placeholder-slate-400"
                  disabled={isSubmitting}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing up...
                  </>
                ) : (
                  <>
                    Notify Me
                    <ArrowRight className="w-4 h-4" />
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
            className="bg-green-900/30 border border-green-500/30 rounded-xl p-6 max-w-md mx-auto"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-500/20 text-green-400 rounded-lg mb-4">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-green-300 mb-2">
              You're all set!
            </h3>
            <p className="text-green-400 text-sm">
              We'll send you an email as soon as GiftSync is back online with exciting new features.
            </p>
          </motion.div>
        )}

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-slate-400 mb-3">
            Join over 50,000 users who trust GiftSync
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <span>• AI-Powered Recommendations</span>
            <span>• 1M+ Products Curated</span>
            <span>• 95% Satisfaction Rate</span>
          </div>
        </motion.div>

        {/* Alpha Access Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-4 text-center"
        >
          <a
            href="/?alpha=true"
            className="text-xs text-slate-500 hover:text-primary-400 transition-colors underline"
          >
            Developer/Alpha Access
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
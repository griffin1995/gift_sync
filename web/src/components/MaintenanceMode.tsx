import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Mail, Sparkles, Heart, Clock, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface MaintenanceModeProps {
  onSignup?: (email: string) => void;
}

// Neural Network Animation Component
const NeuralNetwork = () => {
  const [nodes, setNodes] = useState<Array<{id: string, x: number, y: number, layer: number, size: number}>>([]);
  const [connections, setConnections] = useState<Array<{from: string, to: string, strength: number}>>([]);

  useEffect(() => {
    // Generate neural network nodes in layers for more structure
    const nodeCount = 35;
    const newNodes = Array.from({ length: nodeCount }, (_, i) => {
      // Create layered structure with some randomness
      const layer = Math.floor(i / 7); // 5 layers of 7 nodes each
      const nodeInLayer = i % 7;
      
      return {
        id: `node-${i}`,
        x: (layer * 20) + (Math.random() * 15) + 5, // Spread across width with randomness
        y: (nodeInLayer * 14) + (Math.random() * 10) + 5, // Vertical distribution with randomness
        layer: layer,
        size: Math.random() * 0.4 + 0.3 // Varied node sizes
      };
    });

    // Generate connections with triangular patterns and layer connections
    const newConnections: Array<{from: string, to: string, strength: number}> = [];
    
    newNodes.forEach((node, i) => {
      // Connect to nodes in same layer (horizontal connections)
      const sameLayerNodes = newNodes.filter((otherNode, j) => {
        if (i === j) return false;
        return Math.abs(otherNode.layer - node.layer) === 0 && 
               Math.abs(otherNode.y - node.y) < 20;
      });
      
      // Connect to next layer nodes (forward connections)
      const nextLayerNodes = newNodes.filter((otherNode, j) => {
        if (i === j) return false;
        return otherNode.layer === node.layer + 1;
      });
      
      // Connect to nearby nodes for triangular patterns
      const nearbyNodes = newNodes.filter((otherNode, j) => {
        if (i === j) return false;
        const distance = Math.sqrt(
          Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
        );
        return distance < 30 && distance > 8; // Connect nodes within range but not too close
      });

      // Add same layer connections (1-2 per node)
      sameLayerNodes.slice(0, Math.floor(Math.random() * 2) + 1).forEach(targetNode => {
        newConnections.push({ 
          from: node.id, 
          to: targetNode.id, 
          strength: Math.random() * 0.8 + 0.4 
        });
      });
      
      // Add forward layer connections (2-3 per node)
      nextLayerNodes.slice(0, Math.floor(Math.random() * 2) + 2).forEach(targetNode => {
        newConnections.push({ 
          from: node.id, 
          to: targetNode.id, 
          strength: Math.random() * 1.0 + 0.6 
        });
      });
      
      // Add triangular connections (1-2 per node)
      nearbyNodes.slice(0, Math.floor(Math.random() * 2) + 1).forEach(targetNode => {
        newConnections.push({ 
          from: node.id, 
          to: targetNode.id, 
          strength: Math.random() * 0.6 + 0.3 
        });
      });
    });

    setNodes(newNodes);
    setConnections(newConnections);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-40">
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
              stroke={`url(#gradient-${Math.floor(connection.strength * 3)})`}
              strokeWidth={connection.strength * 0.3}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: [0.3, connection.strength, 0.3]
              }}
              transition={{ 
                duration: 3 + (connection.strength * 2), 
                delay: i * 0.05,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1
              }}
            />
          );
        })}
        
        {/* Triangular Highlights */}
        {connections.slice(0, 8).map((connection, i) => {
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);
          if (!fromNode || !toNode) return null;
          
          // Find third node to create triangle
          const thirdNode = nodes.find(n => 
            n.id !== fromNode.id && n.id !== toNode.id &&
            connections.some(c => 
              (c.from === fromNode.id && c.to === n.id) ||
              (c.from === n.id && c.to === fromNode.id) ||
              (c.from === toNode.id && c.to === n.id) ||
              (c.from === n.id && c.to === toNode.id)
            )
          );
          
          if (!thirdNode) return null;
          
          return (
            <motion.polygon
              key={`triangle-${i}`}
              points={`${fromNode.x},${fromNode.y} ${toNode.x},${toNode.y} ${thirdNode.x},${thirdNode.y}`}
              fill="url(#triangleGradient)"
              stroke="url(#triangleStroke)"
              strokeWidth="0.1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.15, 0],
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{ 
                duration: 6, 
                delay: i * 0.8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g key={node.id}>
            {/* Node glow */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size * 1.5}
              fill="url(#nodeGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{ 
                duration: 4, 
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            {/* Main node */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="url(#nodeGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.03,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 3
              }}
            />
          </motion.g>
        ))}
        
        {/* Enhanced Gradients */}
        <defs>
          <linearGradient id="gradient-0" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f03dff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f03dff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f03dff" stopOpacity="1" />
            <stop offset="25%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#0ea5e9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f03dff" stopOpacity="0.7" />
          </linearGradient>
          
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#f03dff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6" />
          </radialGradient>
          
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="#f03dff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
          </radialGradient>
          
          <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f03dff" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.03" />
          </linearGradient>
          
          <linearGradient id="triangleStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f03dff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
          </linearGradient>
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
          <span className="text-2xl font-bold text-white">prznt</span>
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
          prznt is temporarily offline while we upgrade our AI recommendation engine 
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
              We'll send you an email as soon as prznt is back online with exciting new features.
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
            Join over 50,000 users who trust prznt
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
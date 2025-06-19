import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Sparkles, 
  Users, 
  Crown, 
  Gift,
  ArrowRight,
  Zap,
  Shield,
  Headphones,
  BarChart3,
  Settings
} from 'lucide-react';
import { appConfig } from '@/config';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return isAnnual ? Math.round(monthlyPrice * 12 * 0.8) : monthlyPrice; // 20% discount for annual
  };

  const getPriceLabel = (tier: any) => {
    if (tier.price === 0) return 'Free';
    const price = getPrice(tier.price);
    if (isAnnual) {
      return `£${price}/year`;
    }
    return `£${price}/month`;
  };

  const tiers = [
    {
      ...appConfig.subscriptionTiers.free,
      icon: <Gift className="w-8 h-8" />,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      popular: false,
    },
    {
      ...appConfig.subscriptionTiers.premium,
      icon: <Star className="w-8 h-8" />,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-white',
      borderColor: 'border-primary-200',
      popular: true,
    },
    {
      ...appConfig.subscriptionTiers.enterprise,
      icon: <Crown className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-white',
      borderColor: 'border-purple-200',
      popular: false,
    },
  ];

  const features = [
    {
      category: 'AI Recommendations',
      icon: <Sparkles className="w-5 h-5" />,
      items: [
        { name: 'Basic recommendations', free: true, premium: true, enterprise: true },
        { name: 'Advanced AI recommendations', free: false, premium: true, enterprise: true },
        { name: 'Personalised learning', free: false, premium: true, enterprise: true },
        { name: 'Custom recommendation models', free: false, premium: false, enterprise: true },
      ]
    },
    {
      category: 'Usage Limits',
      icon: <Zap className="w-5 h-5" />,
      items: [
        { name: 'Daily swipes', free: '50', premium: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Gift links per month', free: '5', premium: '100', enterprise: 'Unlimited' },
        { name: 'Recommendations', free: '10/day', premium: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Export data', free: false, premium: true, enterprise: true },
      ]
    },
    {
      category: 'Support & Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      items: [
        { name: 'Email support', free: true, premium: true, enterprise: true },
        { name: 'Priority support', free: false, premium: true, enterprise: true },
        { name: 'Basic analytics', free: true, premium: true, enterprise: true },
        { name: 'Advanced analytics', free: false, premium: true, enterprise: true },
        { name: 'Dedicated support', free: false, premium: false, enterprise: true },
      ]
    },
    {
      category: 'Enterprise Features',
      icon: <Users className="w-5 h-5" />,
      items: [
        { name: 'Team collaboration', free: false, premium: false, enterprise: true },
        { name: 'Bulk gift management', free: false, premium: false, enterprise: true },
        { name: 'Custom branding', free: false, premium: false, enterprise: true },
        { name: 'API access', free: false, premium: false, enterprise: true },
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Pricing - GiftSync</title>
        <meta
          name="description"
          content="Choose the perfect plan for your gifting needs. Start free, upgrade when you're ready. Transparent pricing, no hidden fees."
        />
        <meta name="keywords" content="pricing, subscription, gift recommendations, premium features" />
        <meta property="og:title" content="Pricing - GiftSync" />
        <meta
          property="og:description"
          content="Choose the perfect plan for your gifting needs. Start free, upgrade when you're ready."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">GiftSync</span>
              </Link>
              
              <Link
                href="/"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Start with our free plan and upgrade as your gifting needs grow. 
              All plans include our core AI recommendations and no hidden fees.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center mb-12"
          >
            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    !isAnnual
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                    isAnnual
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Annual
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    20% off
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className={`relative ${tier.bgColor} rounded-2xl shadow-xl border-2 ${tier.borderColor} overflow-hidden ${
                  tier.popular ? 'transform scale-105' : ''
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${tier.color} rounded-2xl text-white mb-4`}>
                      {tier.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {tier.price === 0 ? (
                        'Free'
                      ) : (
                        <>
                          £{getPrice(tier.price)}
                          <span className="text-lg text-gray-500 font-normal">
                            /{isAnnual ? 'year' : 'month'}
                          </span>
                        </>
                      )}
                    </div>
                    {tier.price > 0 && isAnnual && (
                      <p className="text-sm text-green-600 font-medium">
                        Save £{Math.round(tier.price * 12 * 0.2)} per year
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href={tier.price === 0 ? '/auth/register' : '/auth/register?plan=' + tier.name.toLowerCase()}
                      className={`block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all ${
                        tier.popular
                          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {tier.price === 0 ? 'Get Started Free' : `Start ${tier.name} Plan`}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Compare All Features
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 pr-6">
                        <span className="text-lg font-semibold text-gray-900">Features</span>
                      </th>
                      <th className="text-center py-4 px-4">
                        <span className="text-lg font-semibold text-gray-900">Free</span>
                      </th>
                      <th className="text-center py-4 px-4">
                        <span className="text-lg font-semibold text-primary-600">Premium</span>
                      </th>
                      <th className="text-center py-4 pl-4">
                        <span className="text-lg font-semibold text-purple-600">Enterprise</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((category, categoryIndex) => (
                      <React.Fragment key={category.category}>
                        <tr className="border-b border-gray-100">
                          <td colSpan={4} className="py-6">
                            <div className="flex items-center gap-3">
                              <div className="text-primary-600">
                                {category.icon}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {category.category}
                              </h3>
                            </div>
                          </td>
                        </tr>
                        {category.items.map((item, itemIndex) => (
                          <tr key={itemIndex} className="border-b border-gray-50">
                            <td className="py-3 pr-6">
                              <span className="text-gray-700">{item.name}</span>
                            </td>
                            <td className="text-center py-3 px-4">
                              {typeof item.free === 'boolean' ? (
                                item.free ? (
                                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                <span className="text-gray-700">{item.free}</span>
                              )}
                            </td>
                            <td className="text-center py-3 px-4">
                              {typeof item.premium === 'boolean' ? (
                                item.premium ? (
                                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                <span className="text-gray-700">{item.premium}</span>
                              )}
                            </td>
                            <td className="text-center py-3 pl-4">
                              {typeof item.enterprise === 'boolean' ? (
                                item.enterprise ? (
                                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )
                              ) : (
                                <span className="text-gray-700">{item.enterprise}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I change plans anytime?
                </h3>
                <p className="text-gray-600">
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time. 
                  Changes take effect at your next billing cycle.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  Our Free plan gives you access to core features indefinitely. 
                  Premium plans include a 14-day money-back guarantee.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you offer discounts?
                </h3>
                <p className="text-gray-600">
                  Yes! Annual plans save 20%, and we offer special pricing for students, 
                  nonprofits, and educational institutions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Find the Perfect Gift?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who've discovered the joy of perfect gift-giving with AI-powered recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Start Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-2 bg-white/10 text-white border-2 border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    Try Demo
                    <Sparkles className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
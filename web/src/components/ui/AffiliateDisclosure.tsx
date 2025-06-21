/**
 * Affiliate Disclosure Component
 * 
 * Industry-standard affiliate disclosure component that meets FTC guidelines
 * and Amazon Associates Operating Agreement requirements. Provides clear,
 * prominent disclosure of affiliate relationships.
 */

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ExternalLink, Info } from 'lucide-react';

export interface AffiliateDisclosureProps {
  variant?: 'banner' | 'inline' | 'footer' | 'product' | 'modal';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  customText?: string;
  productName?: string;
  isDismissible?: boolean;
  onDismiss?: () => void;
}

const disclosureTexts = {
  banner: {
    title: 'Amazon Associate Disclosure',
    content: 'As an Amazon Associate, GiftSync earns from qualifying purchases. This means we may receive a small commission when you click on our Amazon links and make a purchase, at no additional cost to you. This helps support our platform and allows us to continue providing free gift recommendations.',
  },
  inline: {
    title: '',
    content: 'As an Amazon Associate, we earn from qualifying purchases.',
  },
  footer: {
    title: '',
    content: 'GiftSync is a participant in the Amazon Associates Programme, an affiliate advertising programme designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.co.uk.',
  },
  product: {
    title: 'Affiliate Link Notice',
    content: 'This product link is an affiliate link. If you purchase through this link, we may earn a small commission at no additional cost to you.',
  },
  modal: {
    title: 'About Our Affiliate Links',
    content: 'GiftSync participates in the Amazon Associates Programme and other affiliate programs. When you click on product links from our recommendations and make a purchase, we may earn a commission. This commission comes at no additional cost to you and helps us maintain and improve our free service. Our recommendations are based on our AI analysis of your preferences and are not influenced by commission rates.',
  },
};

export const AffiliateDisclosure: React.FC<AffiliateDisclosureProps> = ({
  variant = 'banner',
  size = 'md',
  showIcon = true,
  className = '',
  customText,
  productName,
  isDismissible = false,
  onDismiss,
}) => {
  const [isDismissed, setIsDismissed] = React.useState(false);
  
  React.useEffect(() => {
    // Check if user has previously dismissed this disclosure
    if (isDismissible && typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('giftsync_affiliate_disclosure_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    }
  }, [isDismissible]);
  
  const handleDismiss = () => {
    if (isDismissible) {
      setIsDismissed(true);
      localStorage.setItem('giftsync_affiliate_disclosure_dismissed', 'true');
      onDismiss?.();
    }
  };
  
  if (isDismissed) {
    return null;
  }
  
  const disclosure = disclosureTexts[variant];
  const text = customText || disclosure.content;
  const title = disclosure.title;
  
  // Replace placeholder text if product name is provided
  const finalText = productName ? text.replace(/this product/gi, productName) : text;
  
  const baseClasses = 'affiliate-disclosure';
  const sizeClasses = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
    lg: 'text-base p-4',
  };
  
  const variantClasses = {
    banner: 'bg-blue-50 border-l-4 border-blue-400 rounded-r-lg',
    inline: 'bg-gray-50 rounded-md border border-gray-200',
    footer: 'bg-transparent border-t border-gray-200 pt-4',
    product: 'bg-yellow-50 border border-yellow-200 rounded-lg',
    modal: 'bg-white rounded-lg shadow-lg border border-gray-200',
  };
  
  const iconMap = {
    banner: AlertCircle,
    inline: Info,
    footer: Info,
    product: AlertCircle,
    modal: Info,
  };
  
  const Icon = iconMap[variant];
  
  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim();
  
  if (variant === 'inline') {
    return (
      <div className={combinedClasses}>
        <div className="flex items-start gap-2">
          {showIcon && (
            <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          )}
          <span className="text-gray-700 text-xs italic">
            {finalText}
            <Link 
              href="/affiliate-disclosure" 
              className="ml-1 text-blue-600 hover:text-blue-800 underline"
            >
              Learn more
            </Link>
          </span>
        </div>
      </div>
    );
  }
  
  if (variant === 'footer') {
    return (
      <div className={combinedClasses}>
        <div className="text-center text-gray-600">
          <p className="text-sm">
            {finalText}
          </p>
          <div className="mt-2 flex justify-center items-center gap-4 text-xs">
            <Link 
              href="/affiliate-disclosure" 
              className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
            >
              Full Disclosure <ExternalLink className="w-3 h-3" />
            </Link>
            <Link 
              href="/privacy" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={combinedClasses}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {showIcon && (
            <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            {title && (
              <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
            )}
            <p className="text-gray-700 leading-relaxed">
              {finalText}
            </p>
            <div className="mt-2">
              <Link 
                href="/affiliate-disclosure" 
                className="text-blue-600 hover:text-blue-800 underline text-sm flex items-center gap-1"
              >
                Read our full affiliate disclosure <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
        
        {isDismissible && (
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Dismiss disclosure"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AffiliateDisclosure;
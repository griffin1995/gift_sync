import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface GiftLink {
  id: string;
  token: string;
  title: string;
  description: string;
  userId: string;
  products: Product[];
  preferences: any;
  isPublic: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  analytics: {
    views: number;
    clicks: number;
    shares: number;
    conversions: number;
  };
  customization: {
    theme: 'default' | 'minimal' | 'festive' | 'elegant';
    backgroundColor: string;
    accentColor: string;
    showBranding: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  affiliateUrl: string;
  brand: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}

export interface CreateGiftLinkRequest {
  title: string;
  description?: string;
  productIds: string[];
  preferences?: any;
  isPublic?: boolean;
  expiresAt?: Date;
  customization?: Partial<GiftLink['customization']>;
}

export interface ShareOptions {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email' | 'copy' | 'qr';
  message?: string;
  hashtags?: string[];
}

interface UseGiftLinksReturn {
  giftLinks: GiftLink[];
  isLoading: boolean;
  error: string | null;
  createGiftLink: (data: CreateGiftLinkRequest) => Promise<GiftLink>;
  updateGiftLink: (id: string, data: Partial<GiftLink>) => Promise<GiftLink>;
  deleteGiftLink: (id: string) => Promise<void>;
  getGiftLink: (token: string) => Promise<GiftLink>;
  shareGiftLink: (giftLink: GiftLink, options: ShareOptions) => Promise<void>;
  generateQRCode: (giftLink: GiftLink) => Promise<string>;
  trackAnalytics: (token: string, event: 'view' | 'click' | 'share' | 'conversion') => Promise<void>;
  getShareUrl: (giftLink: GiftLink) => string;
  loadUserGiftLinks: () => Promise<void>;
}

export function useGiftLinks(): UseGiftLinksReturn {
  const [giftLinks, setGiftLinks] = useState<GiftLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGiftLink = useCallback(async (data: CreateGiftLinkRequest): Promise<GiftLink> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.giftLinks.create(data);
      const newGiftLink = response.giftLink;
      
      setGiftLinks(prev => [newGiftLink, ...prev]);
      return newGiftLink;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create gift link';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateGiftLink = useCallback(async (id: string, data: Partial<GiftLink>): Promise<GiftLink> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.giftLinks.update(id, data);
      const updatedGiftLink = response.giftLink;
      
      setGiftLinks(prev =>
        prev.map(link => link.id === id ? updatedGiftLink : link)
      );
      
      return updatedGiftLink;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update gift link';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteGiftLink = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.giftLinks.delete(id);
      setGiftLinks(prev => prev.filter(link => link.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete gift link';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGiftLink = useCallback(async (token: string): Promise<GiftLink> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.giftLinks.getByToken(token);
      return response.giftLink;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load gift link';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserGiftLinks = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.giftLinks.getUserGiftLinks();
      setGiftLinks(response.giftLinks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load gift links';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getShareUrl = useCallback((giftLink: GiftLink): string => {
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://giftsync.app';
    return `${baseUrl}/gift/${giftLink.token}`;
  }, []);

  const shareGiftLink = useCallback(async (giftLink: GiftLink, options: ShareOptions): Promise<void> => {
    const shareUrl = getShareUrl(giftLink);
    const defaultMessage = `Check out these amazing gift recommendations I found on GiftSync: ${giftLink.title}`;
    const message = options.message || defaultMessage;

    try {
      switch (options.platform) {
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`,
            '_blank',
            'width=600,height=400'
          );
          break;

        case 'twitter':
          const hashtags = options.hashtags ? `&hashtags=${options.hashtags.join(',')}` : '';
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}${hashtags}`,
            '_blank',
            'width=600,height=400'
          );
          break;

        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=400'
          );
          break;

        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${message} ${shareUrl}`)}`,
            '_blank'
          );
          break;

        case 'email':
          const subject = encodeURIComponent(giftLink.title);
          const body = encodeURIComponent(`${message}\n\n${shareUrl}`);
          window.open(`mailto:?subject=${subject}&body=${body}`);
          break;

        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          break;

        case 'qr':
          // QR code sharing handled separately
          break;

        default:
          throw new Error(`Unsupported platform: ${options.platform}`);
      }

      // Track share analytics
      await trackAnalytics(giftLink.token, 'share');
    } catch (err) {
      throw new Error(`Failed to share on ${options.platform}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [getShareUrl]);

  const generateQRCode = useCallback(async (giftLink: GiftLink): Promise<string> => {
    const shareUrl = getShareUrl(giftLink);
    
    try {
      // Use a QR code generation service or library
      const response = await fetch(`/api/qr-code?url=${encodeURIComponent(shareUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      throw new Error(`Failed to generate QR code: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [getShareUrl]);

  const trackAnalytics = useCallback(async (token: string, event: 'view' | 'click' | 'share' | 'conversion'): Promise<void> => {
    try {
      await api.giftLinks.trackAnalytics(token, { event, timestamp: new Date() });
    } catch (err) {
      // Silently fail analytics tracking
      console.warn('Failed to track analytics:', err);
    }
  }, []);

  return {
    giftLinks,
    isLoading,
    error,
    createGiftLink,
    updateGiftLink,
    deleteGiftLink,
    getGiftLink,
    shareGiftLink,
    generateQRCode,
    trackAnalytics,
    getShareUrl,
    loadUserGiftLinks,
  };
}
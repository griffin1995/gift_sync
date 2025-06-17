import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SwipeCard } from '../SwipeCard';
import { Product } from '@/types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useMotionValue: () => ({ set: jest.fn(), get: jest.fn() }),
  useTransform: () => ({ set: jest.fn(), get: jest.fn() }),
  useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'A test product description',
  price: 29.99,
  currency: 'USD',
  imageUrl: 'https://example.com/image.jpg',
  category: 'Electronics',
  subcategory: 'Gadgets',
  brand: 'TestBrand',
  rating: 4.5,
  reviewCount: 100,
  availability: 'in_stock',
  affiliateUrl: 'https://example.com/affiliate',
  features: ['Feature 1', 'Feature 2'],
  tags: ['tag1', 'tag2'],
  priceHistory: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockOnSwipe = jest.fn();
const mockOnLike = jest.fn();
const mockOnPass = jest.fn();

describe('SwipeCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(
      <SwipeCard
        product={mockProduct}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('A test product description')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('TestBrand')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(100 reviews)')).toBeInTheDocument();
  });

  it('displays product image with correct alt text', () => {
    render(
      <SwipeCard
        product={mockProduct}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('shows features list when product has features', () => {
    render(
      <SwipeCard
        product={mockProduct}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    expect(screen.getByText('Features:')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
  });

  it('renders like and pass buttons', () => {
    render(
      <SwipeCard
        product={mockProduct}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    const likeButton = screen.getByLabelText('Like this product');
    const passButton = screen.getByLabelText('Pass on this product');

    expect(likeButton).toBeInTheDocument();
    expect(passButton).toBeInTheDocument();
  });

  it('calls onLike when like button is clicked', () => {
    render(
      <SwipeCard
        product={mockProduct}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    const likeButton = screen.getByLabelText('Like this product');
    fireEvent.click(likeButton);

    expect(mockOnLike).toHaveBeenCalledWith(mockProduct);
  });

  it('calls onPass when pass button is clicked', () => {
    render(
      <SwipeCard
        product={mockProduct}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    const passButton = screen.getByLabelText('Pass on this product');
    fireEvent.click(passButton);

    expect(mockOnPass).toHaveBeenCalledWith(mockProduct);
  });

  it('handles keyboard interactions', () => {
    render(
      <SwipeCard
        product={mockProduct}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    const card = screen.getByRole('article');
    
    // Test right arrow key (like)
    fireEvent.keyDown(card, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(mockOnLike).toHaveBeenCalledWith(mockProduct);

    // Test left arrow key (pass)
    fireEvent.keyDown(card, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(mockOnPass).toHaveBeenCalledWith(mockProduct);
  });

  it('shows availability status correctly', () => {
    render(
      <SwipeCard
        product={mockProduct}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('handles product without features gracefully', () => {
    const productWithoutFeatures = { ...mockProduct, features: [] };
    
    render(
      <SwipeCard
        product={productWithoutFeatures}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    expect(screen.queryByText('Features:')).not.toBeInTheDocument();
  });

  it('handles missing product image gracefully', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: '' };
    
    render(
      <SwipeCard
        product={productWithoutImage}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    // Should still render the product name
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('formats price correctly for different currencies', () => {
    const eurProduct = { ...mockProduct, price: 25.50, currency: 'EUR' };
    
    render(
      <SwipeCard
        product={eurProduct}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    expect(screen.getByText('€25.50')).toBeInTheDocument();
  });

  it('shows correct rating stars', () => {
    render(
      <SwipeCard
        product={mockProduct}
        onSwipe={mockOnSwipe}
        onLike={mockOnLike}
        onPass={mockOnPass}
      />
    );

    // Check for rating display (4.5 stars)
    const ratingElement = screen.getByText('4.5');
    expect(ratingElement).toBeInTheDocument();
  });
});
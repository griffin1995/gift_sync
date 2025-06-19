// Base API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location?: string;
  timezone?: string;
  subscription_tier: 'free' | 'premium' | 'enterprise';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  preferences?: UserPreferences;
  statistics?: UserStatistics;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  budget_min?: number;
  budget_max?: number;
  preferred_categories: string[];
  excluded_categories: string[];
  preferred_brands: string[];
  excluded_brands: string[];
  style_preferences: Record<string, any>;
  notification_settings: NotificationSettings;
  privacy_settings: PrivacySettings;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  recommendation_updates: boolean;
  gift_link_interactions: boolean;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  show_activity: boolean;
  allow_friend_requests: boolean;
  data_sharing: boolean;
}

export interface UserStatistics {
  total_swipes: number;
  total_likes: number;
  total_dislikes: number;
  recommendations_generated: number;
  gift_links_created: number;
  gift_links_shared: number;
  total_savings: number;
  favourite_categories: string[];
  activity_score: number;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  date_of_birth?: string;
  marketing_consent?: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  original_price?: number;
  discount_percentage?: number;
  brand: string;
  category_id: string;
  category: Category;
  image_url: string;
  additional_images: string[];
  affiliate_url: string;
  affiliate_source: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited' | 'discontinued';
  rating?: number;
  review_count?: number;
  features: Record<string, any>;
  tags: string[];
  is_featured: boolean;
  is_trending: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  parent?: Category;
  children?: Category[];
  icon?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  product_count?: number;
  created_at: string;
  updated_at: string;
}

// Swipe Types
export interface SwipeSession {
  id: string;
  user_id: string;
  session_type: 'onboarding' | 'discovery' | 'category_exploration' | 'gift_selection';
  category_focus?: string;
  target_recipient?: string;
  context?: Record<string, any>;
  is_completed: boolean;
  completed_at?: string;
  swipe_count: number;
  like_count: number;
  dislike_count: number;
  skip_count: number;
  session_duration?: number;
  created_at: string;
  updated_at: string;
}

export interface SwipeInteraction {
  id: string;
  session_id: string;
  product_id: string;
  product: Product;
  direction: 'left' | 'right' | 'up' | 'down';
  interaction_type: 'swipe' | 'click' | 'keyboard';
  timing_ms: number;
  context?: Record<string, any>;
  created_at: string;
}

export interface SwipeRequest {
  product_id: string;
  direction: 'left' | 'right' | 'up' | 'down';
  content_type: 'product' | 'category' | 'brand';
  session_context?: Record<string, any>;
}

// Recommendation Types
export interface Recommendation {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  score: number;
  confidence: number;
  reasoning: string[];
  algorithm_used: string;
  category_match: number;
  price_match: number;
  style_match: number;
  popularity_score: number;
  is_viewed: boolean;
  is_clicked: boolean;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecommendationRequest {
  category?: string;
  budget_min?: number;
  budget_max?: number;
  occasion?: string;
  recipient_age?: number;
  recipient_gender?: string;
  limit?: number;
  exclude_seen?: boolean;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  total_count: number;
  algorithm_info: {
    primary_algorithm: string;
    fallback_used: boolean;
    confidence_threshold: number;
    personalization_score: number;
  };
  metadata: {
    processing_time_ms: number;
    cache_hit: boolean;
    last_updated: string;
  };
}

// Gift Link Types
export interface GiftLink {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  recipient_name?: string;
  occasion?: string;
  budget_range?: string;
  products: Product[];
  custom_message?: string;
  share_token: string;
  qr_code_url: string;
  is_public: boolean;
  expires_at?: string;
  view_count: number;
  click_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
}

export interface GiftLinkInteraction {
  id: string;
  gift_link_id: string;
  interaction_type: 'view' | 'click' | 'share' | 'product_click';
  product_id?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  location?: string;
  created_at: string;
}

export interface CreateGiftLinkRequest {
  title: string;
  description?: string;
  recipient_name?: string;
  occasion?: string;
  budget_range?: string;
  product_ids: string[];
  custom_message?: string;
  is_public?: boolean;
  expires_in_days?: number;
}

// Swipe Interface Types
export interface SwipeCard {
  id: string;
  product: Product;
  position: number;
  isVisible: boolean;
  isAnimating: boolean;
}

export interface SwipeState {
  cards: SwipeCard[];
  currentIndex: number;
  isLoading: boolean;
  hasMore: boolean;
  sessionId: string | null;
  swipeCount: number;
  likeCount: number;
  dislikeCount: number;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  velocity: number;
  distance: number;
  duration: number;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  details?: any;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Form Types
export interface FormValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState<T = any> {
  data: T;
  errors: FormValidationError[];
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  touchedFields: Set<string>;
}

// Search Types
export interface SearchFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  rating?: number;
  availability?: string[];
  tags?: string[];
  is_featured?: boolean;
  is_trending?: boolean;
  is_new?: boolean;
}

export interface SearchQuery {
  q?: string;
  filters?: SearchFilters;
  sort_by?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'trending';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: Product[];
  total_count: number;
  facets: {
    categories: Array<{ name: string; count: number }>;
    brands: Array<{ name: string; count: number }>;
    price_ranges: Array<{ range: string; count: number }>;
  };
  suggestions: string[];
  query_info: {
    original_query: string;
    corrected_query?: string;
    processing_time_ms: number;
  };
}

// Analytics Types
export interface AnalyticsEvent {
  event_name: string;
  properties: Record<string, any>;
  user_id?: string;
  session_id?: string;
  timestamp?: string;
}

export interface UserEngagement {
  page_views: number;
  session_duration: number;
  bounce_rate: number;
  interactions: number;
  conversion_rate: number;
  last_active: string;
}

// API Error Types
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
  timestamp: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Component Prop Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// Environment Types
export interface EnvironmentConfig {
  apiUrl: string;
  webUrl: string;
  mixpanelToken?: string;
  sentryDsn?: string;
  googleAnalyticsId?: string;
  isProduction: boolean;
  isDevelopment: boolean;
  version: string;
}
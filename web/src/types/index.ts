/**
 * GiftSync Frontend Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout the
 * GiftSync frontend application. These types ensure type safety and provide
 * clear contracts between components, API calls, and data structures.
 * 
 * Type Organization:
 * - API Response Types: Standard response formats from backend
 * - Domain Models: Core business entities (User, Product, etc.)
 * - UI State Types: Component state and form management
 * - Utility Types: Generic helpers and transformations
 * 
 * Usage:
 * - Import specific types: `import { User, Product } from '@/types';`
 * - Use in components: `const [user, setUser] = useState<User | null>(null);`
 * - API typing: `const response: ApiResponse<User> = await api.getCurrentUser();`
 */

// ==============================================================================
// API RESPONSE TYPES
// ==============================================================================
// Standard response formats from backend API endpoints

/**
 * Generic API response wrapper used by all backend endpoints.
 * 
 * Provides consistent response structure with success indication,
 * data payload, and optional messaging for user feedback.
 * 
 * Type Parameter:
 *   T: The type of data contained in the response
 * 
 * Usage:
 *   const userResponse: ApiResponse<User> = await api.login(credentials);
 *   if (userResponse.success) {
 *     setUser(userResponse.data);
 *   }
 */
export interface ApiResponse<T = any> {
  data: T;              // Main response payload
  message?: string;     // Optional success/info message for user display
  success: boolean;     // Indicates if operation succeeded
}

/**
 * Paginated API response for list endpoints with pagination metadata.
 * 
 * Extends ApiResponse to include pagination information for efficient
 * data loading and UI pagination controls.
 * 
 * Type Parameter:
 *   T: The type of items in the paginated list
 * 
 * Usage:
 *   const productsResponse: PaginatedResponse<Product> = await api.getProducts({ page: 2 });
 *   const { data: products, pagination } = productsResponse;
 *   const hasNextPage = pagination.page < pagination.total_pages;
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;        // Current page number (1-based)
    limit: number;       // Items per page
    total: number;       // Total items across all pages
    total_pages: number; // Total number of pages
  };
}

// ==============================================================================
// USER TYPES
// ==============================================================================
// User account and profile management types

/**
 * Complete user profile representing a registered GiftSync user.
 * 
 * Contains all user information including authentication status,
 * personalisation data, and subscription details.
 * 
 * Privacy & GDPR:
 *   - All personal data can be exported via data export endpoint
 *   - Optional fields support progressive profile completion
 *   - Subscription tier controls feature access and usage limits
 * 
 * Usage:
 *   - Authentication: Store in AuthContext after login
 *   - Profile display: Render user information in UI
 *   - Personalisation: Use preferences for recommendation targeting
 */
export interface User {
  id: string;                                                    // Unique user identifier (UUID)
  email: string;                                                 // Primary email address (required for auth)
  first_name: string;                                           // User's first name
  last_name: string;                                            // User's last name
  profile_picture?: string;                                     // Avatar image URL (optional)
  date_of_birth?: string;                                       // Birth date (ISO format, for age filtering)
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'; // Gender preference (for targeted recommendations)
  location?: string;                                            // User location (city, country)
  timezone?: string;                                            // User timezone (for local features)
  subscription_tier: 'free' | 'premium' | 'enterprise';       // Feature access level
  is_active: boolean;                                           // Account status (false = suspended)
  is_verified: boolean;                                         // Email verification status
  created_at: string;                                           // Account creation timestamp (ISO)
  updated_at: string;                                           // Last profile update timestamp (ISO)
  last_login?: string;                                          // Most recent login timestamp (ISO)
  preferences?: UserPreferences;                                // User customisation settings
  statistics?: UserStatistics;                                  // Usage analytics and metrics
}

/**
 * User personalisation preferences for recommendation targeting.
 * 
 * Stores user-specific settings that influence product recommendations,
 * notifications, and privacy controls. These preferences are learned
 * through user interactions and explicit settings.
 * 
 * Budget Handling:
 *   - Stored in lowest denomination (pence for GBP, cents for USD)
 *   - Used to filter products within user's price range
 * 
 * Category/Brand Preferences:
 *   - preferred_*: Positive signals for recommendation algorithms
 *   - excluded_*: Hard filters to never show these items
 * 
 * Usage:
 *   - Recommendation filtering: Apply budget and category constraints
 *   - UI personalisation: Show relevant categories first
 *   - Privacy controls: Respect notification and sharing preferences
 */
export interface UserPreferences {
  id: string;                              // Unique preferences identifier
  user_id: string;                         // Associated user UUID
  budget_min?: number;                     // Minimum budget in pence/cents
  budget_max?: number;                     // Maximum budget in pence/cents
  preferred_categories: string[];          // Liked category UUIDs
  excluded_categories: string[];           // Disliked category UUIDs
  preferred_brands: string[];              // Liked brand names
  excluded_brands: string[];               // Disliked brand names
  style_preferences: Record<string, any>;  // Flexible style attributes (colour, material, etc.)
  notification_settings: NotificationSettings; // Communication preferences
  privacy_settings: PrivacySettings;       // Data sharing and visibility controls
  created_at: string;                      // Preferences creation timestamp (ISO)
  updated_at: string;                      // Last modification timestamp (ISO)
}

/**
 * User notification preferences for communication channels.
 * 
 * Controls how and when the user receives different types of notifications.
 * Respects user preferences and regulatory requirements (GDPR, CAN-SPAM).
 * 
 * Notification Types:
 *   - Transactional: Account, security, order confirmations (always enabled)
 *   - Product: Recommendations, price drops, availability
 *   - Social: Gift link interactions, friend activities
 *   - Marketing: Promotional content, feature announcements
 */
export interface NotificationSettings {
  email_notifications: boolean;     // General email notifications (recommendations, updates)
  push_notifications: boolean;      // Browser/mobile push notifications
  sms_notifications: boolean;       // SMS notifications (urgent only)
  marketing_emails: boolean;        // Promotional and marketing emails
  recommendation_updates: boolean;  // New personalised recommendations
  gift_link_interactions: boolean;  // When someone views/uses your gift links
}

/**
 * User privacy controls for data sharing and social features.
 * 
 * Manages user privacy preferences and data sharing consent.
 * Ensures GDPR compliance and user control over personal information.
 * 
 * Privacy Levels:
 *   - public: Profile visible to all users
 *   - friends: Profile visible to connected users only
 *   - private: Profile hidden from other users
 */
export interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private'; // Who can see user profile
  show_activity: boolean;          // Display user activity (swipes, likes) to others
  allow_friend_requests: boolean;  // Accept friend/connection requests
  data_sharing: boolean;           // Share anonymised data for product improvement
}

/**
 * User engagement and usage statistics for analytics and gamification.
 * 
 * Tracks user activity metrics for:
 *   - Product analytics and user segmentation
 *   - Gamification features (badges, achievements)
 *   - Recommendation algorithm improvement
 *   - User engagement insights
 * 
 * Currency Handling:
 *   - total_savings: Calculated from affiliate discounts in pence/cents
 *   - Activity score: Normalised engagement metric (0-100)
 */
export interface UserStatistics {
  total_swipes: number;              // Total swipe interactions
  total_likes: number;               // Right swipes (positive signals)
  total_dislikes: number;            // Left swipes (negative signals)
  recommendations_generated: number; // Total recommendations received
  gift_links_created: number;        // Gift links created by user
  gift_links_shared: number;         // Times user shared gift links
  total_savings: number;             // Estimated savings from recommendations (pence/cents)
  favourite_categories: string[];    // Most liked categories (derived from swipes)
  activity_score: number;            // Engagement score (0-100, for gamification)
}

// ==============================================================================
// AUTHENTICATION TYPES
// ==============================================================================
// User authentication and session management types

/**
 * Login request payload for user authentication.
 * 
 * Contains credentials and optional session preferences for
 * authenticating existing users.
 * 
 * Security:
 *   - Password should be validated on frontend before sending
 *   - remember_me extends token expiration for convenience
 *   - Always sent over HTTPS in production
 */
export interface LoginRequest {
  email: string;          // User's registered email address
  password: string;       // User's password (plain text, encrypted in transit)
  remember_me?: boolean;  // Optional: extend session duration
}

/**
 * Registration request payload for new user creation.
 * 
 * Contains required and optional user information for account creation.
 * Follows GDPR requirements for consent and data minimisation.
 * 
 * Validation:
 *   - Email must be unique and valid format
 *   - Password must meet security requirements
 *   - marketing_consent required for promotional communications
 */
export interface RegisterRequest {
  first_name: string;         // User's first name (required)
  last_name: string;          // User's last name (required)
  email: string;              // Unique email address (required)
  password: string;           // Password meeting security requirements
  date_of_birth?: string;     // Birth date for age-appropriate filtering (optional)
  marketing_consent?: boolean; // Consent for marketing communications (GDPR)
}

/**
 * Authentication response containing JWT tokens and user data.
 * 
 * Returned by login and registration endpoints upon successful authentication.
 * Contains everything needed to establish and maintain user session.
 * 
 * Token Management:
 *   - access_token: Short-lived JWT for API requests (30 minutes)
 *   - refresh_token: Long-lived token for renewing access (30 days)
 *   - Store securely in localStorage with proper cleanup
 */
export interface AuthResponse {
  access_token: string;  // JWT access token for API authentication
  refresh_token: string; // JWT refresh token for session renewal
  token_type: string;    // Token type (always "Bearer")
  expires_in: number;    // Access token expiration in seconds
  user: User;           // Complete user profile data
}

/**
 * Token refresh request for renewing expired access tokens.
 * 
 * Used to obtain new access tokens without requiring re-authentication.
 * Part of the JWT refresh flow for seamless user experience.
 */
export interface RefreshTokenRequest {
  refresh_token: string; // Valid refresh token from previous authentication
}

// ==============================================================================
// PRODUCT TYPES
// ==============================================================================
// Product catalog and e-commerce types

/**
 * Complete product information for display and interaction.
 * 
 * Represents individual gift items that users can swipe on, purchase,
 * and receive as recommendations. Includes all data needed for:
 *   - Product display in swipe interface
 *   - Search and filtering
 *   - Affiliate link tracking
 *   - Recommendation algorithms
 * 
 * Price Structure:
 *   - price: Current selling price in pence/cents
 *   - original_price: Pre-discount price for comparison
 *   - currency: ISO currency code (GBP, USD, EUR)
 * 
 * Affiliate Integration:
 *   - affiliate_url: Purchase link with tracking parameters
 *   - affiliate_source: Partner network ("amazon", "ebay")
 *   - Revenue generated through commission on purchases
 */
export interface Product {
  id: string;                                                           // Unique product identifier (UUID)
  name: string;                                                         // Product name/title
  description: string;                                                  // Detailed product description
  price: number;                                                        // Current price in pence/cents
  currency: string;                                                     // ISO currency code (GBP, USD, EUR)
  original_price?: number;                                              // Original price before discounts
  discount_percentage?: number;                                         // Calculated discount percentage
  brand: string;                                                        // Product brand/manufacturer
  category_id: string;                                                  // Associated category UUID
  category: Category;                                                   // Full category object (populated)
  image_url: string;                                                    // Primary product image URL
  additional_images: string[];                                          // Additional product images
  affiliate_url: string;                                                // Purchase link with affiliate tracking
  affiliate_source: string;                                             // Affiliate network ("amazon", "ebay")
  availability: 'in_stock' | 'out_of_stock' | 'limited' | 'discontinued'; // Stock status
  rating?: number;                                                      // Average rating (1.0-5.0)
  review_count?: number;                                                // Number of reviews
  features: Record<string, any>;                                        // Structured product attributes
  tags: string[];                                                       // Searchable keywords
  is_featured: boolean;                                                 // Featured in collections
  is_trending: boolean;                                                 // Currently trending
  is_new: boolean;                                                      // Recently added
  created_at: string;                                                   // Product creation timestamp (ISO)
  updated_at: string;                                                   // Last modification timestamp (ISO)
}

/**
 * Product category for hierarchical organisation and filtering.
 * 
 * Categories form a tree structure enabling:
 *   - Hierarchical product organisation
 *   - Faceted search and filtering
 *   - Preference-based recommendations
 *   - Navigation and discovery
 * 
 * Hierarchy Examples:
 *   Electronics > Smartphones > iPhone Accessories
 *   Home & Garden > Furniture > Bedroom > Beds
 * 
 * Usage:
 *   - Product filtering: Filter products by category
 *   - Navigation: Build category tree for browsing
 *   - Preferences: Learn user preferences by category
 */
export interface Category {
  id: string;            // Unique category identifier (UUID)
  name: string;          // Category display name
  description?: string;  // Optional category description
  parent_id?: string;    // Parent category UUID (null for root categories)
  parent?: Category;     // Parent category object (populated)
  children?: Category[]; // Child categories (populated)
  icon?: string;         // Category icon name or URL
  image_url?: string;    // Category banner/image URL
  sort_order: number;    // Display order within parent category
  is_active: boolean;    // Category status (hidden if false)
  product_count?: number; // Number of products in category (calculated)
  created_at: string;    // Category creation timestamp (ISO)
  updated_at: string;    // Last modification timestamp (ISO)
}

// ==============================================================================
// SWIPE TYPES
// ==============================================================================
// User interaction and preference collection types

/**
 * Swipe session representing a period of product discovery.
 * 
 * Groups related swipe interactions for specific contexts like
 * onboarding, gift finding, or general discovery. Sessions capture
 * user intent and enable contextual product filtering.
 * 
 * Session Types:
 *   - onboarding: Initial preference discovery for new users
 *   - discovery: General product exploration
 *   - category_exploration: Deep dive into specific category
 *   - gift_selection: Targeted gift finding with recipient context
 * 
 * Analytics:
 *   - Track engagement metrics (swipe counts, duration)
 *   - Measure completion rates and user behavior
 *   - Generate session-based recommendations
 */
export interface SwipeSession {
  id: string;                                                                     // Unique session identifier (UUID)
  user_id: string;                                                                // Associated user UUID
  session_type: 'onboarding' | 'discovery' | 'category_exploration' | 'gift_selection'; // Session purpose
  category_focus?: string;                                                        // Focused category UUID (if applicable)
  target_recipient?: string;                                                      // Gift recipient context
  context?: Record<string, any>;                                                  // Additional session metadata
  is_completed: boolean;                                                          // Session completion status
  completed_at?: string;                                                          // Session completion timestamp (ISO)
  swipe_count: number;                                                            // Total swipes in session
  like_count: number;                                                             // Right swipes (positive signals)
  dislike_count: number;                                                          // Left swipes (negative signals)
  skip_count: number;                                                             // Down swipes (neutral signals)
  session_duration?: number;                                                      // Session length in seconds
  created_at: string;                                                             // Session start timestamp (ISO)
  updated_at: string;                                                             // Last interaction timestamp (ISO)
}

/**
 * Individual swipe gesture within a session.
 * 
 * Represents atomic user preference signals that drive the
 * recommendation engine. Each interaction provides training
 * data for machine learning algorithms.
 * 
 * Gesture Meanings:
 *   - left: Dislike/reject (negative preference)
 *   - right: Like/accept (positive preference)
 *   - up: Super like/bookmark (strong positive)
 *   - down: Skip/neutral (no preference signal)
 * 
 * Timing Analysis:
 *   - timing_ms: Time spent viewing before swipe
 *   - Longer times indicate more considered decisions
 *   - Used for preference confidence scoring
 */
export interface SwipeInteraction {
  id: string;                                      // Unique interaction identifier (UUID)
  session_id: string;                              // Parent session UUID
  product_id: string;                              // Swiped product UUID
  product: Product;                                // Full product object (populated)
  direction: 'left' | 'right' | 'up' | 'down';   // Swipe direction/gesture
  interaction_type: 'swipe' | 'click' | 'keyboard'; // Input method used
  timing_ms: number;                               // Time spent viewing product (milliseconds)
  context?: Record<string, any>;                   // Additional interaction metadata
  created_at: string;                              // Interaction timestamp (ISO)
}

/**
 * Swipe interaction request payload for API submission.
 * 
 * Sent to backend when user performs swipe gesture to record
 * preference signal and update recommendation algorithms.
 * 
 * Real-time Flow:
 *   1. User swipes on product in UI
 *   2. Frontend creates SwipeRequest
 *   3. POST to /api/v1/swipes/interactions
 *   4. Backend records interaction and updates preferences
 */
export interface SwipeRequest {
  product_id: string;                              // Product being swiped on
  direction: 'left' | 'right' | 'up' | 'down';   // User's swipe direction
  content_type: 'product' | 'category' | 'brand'; // Type of content swiped
  session_context?: Record<string, any>;          // Additional context data
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
  posthogKey?: string;
  posthogHost?: string;
  isProduction: boolean;
  isDevelopment: boolean;
  version: string;
}
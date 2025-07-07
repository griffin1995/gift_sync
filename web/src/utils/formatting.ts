/**
 * GiftSync Formatting Utilities
 * 
 * Comprehensive collection of formatting functions for data presentation
 * throughout the GiftSync application. Provides consistent formatting
 * for currencies, dates, numbers, and text across all components.
 * 
 * Key Features:
 *   - Internationalisation support with British English defaults
 *   - Currency formatting with proper symbols and precision
 *   - Date and time formatting with relative time support
 *   - Number formatting with locale-aware thousands separators
 *   - Text manipulation utilities for UI consistency
 * 
 * Localisation:
 *   - All functions default to British English (en-GB) locale
 *   - Currency symbols follow UK market standards
 *   - Date formats use DD/MM/YYYY British convention
 *   - Number formatting includes proper thousand separators
 * 
 * Usage:
 *   import { formatPrice, formatDate, formatRelativeTime } from '@/utils/formatting';
 *   
 *   const price = formatPrice(29.99, 'GBP');     // "£29.99"
 *   const date = formatDate(new Date());         // "04/07/2025"
 *   const time = formatRelativeTime(lastLogin);  // "2 hours ago"
 */

// ==============================================================================
// CURRENCY FORMATTING FUNCTIONS
// ==============================================================================

/**
 * Format a monetary amount with appropriate currency symbol and locale.
 * 
 * Provides consistent price formatting throughout the application with:
 *   - Proper currency symbols (£, $, €, etc.)
 *   - British English number formatting (e.g., 1,234.56)
 *   - Negative amount handling with minus sign prefix
 *   - Fixed decimal precision for consistent display
 * 
 * Examples:
 *   formatPrice(29.99, 'GBP')    // "£29.99"
 *   formatPrice(1234.5, 'USD')  // "$1,234.50"
 *   formatPrice(-50, 'EUR')     // "-€50.00"
 *   formatPrice(0, 'GBP')       // "£0.00"
 * 
 * Parameters:
 *   amount: Numerical price value (can be negative)
 *   currency: ISO currency code (e.g., 'GBP', 'USD', 'EUR')
 * 
 * Returns:
 *   string: Formatted price with currency symbol
 */
export function formatPrice(amount: number, currency: string): string {
  // STEP 1: Get currency symbol (£, $, €, etc.)
  const currencySymbol = formatCurrency(currency);              // VERIFIED: "GBP" → "£"
  
  // STEP 2: Format number with British English locale
  const formatted = new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 2,                                   // VERIFIED: Always shows 2 decimal places
    maximumFractionDigits: 2,                                   // VERIFIED: Never more than 2 decimals
  }).format(Math.abs(amount));                                  // VERIFIED: 1234.5 → "1,234.50"

  // STEP 3: Handle negative amounts with proper symbol placement
  return amount < 0 ? `-${currencySymbol}${formatted}` : `${currencySymbol}${formatted}`;  // VERIFIED: "£29.99" or "-£29.99"
  
  // VERIFIED TEST CASES (can be tested in browser console):
  // formatPrice(29.99, 'GBP')    // "£29.99"
  // formatPrice(1234.5, 'USD')  // "$1,234.50"
  // formatPrice(-50, 'EUR')     // "-€50.00"
  // formatPrice(0, 'GBP')       // "£0.00"
  // formatPrice(9999999, 'GBP') // "£9,999,999.00"
}

/**
 * Convert ISO currency code to appropriate symbol.
 * 
 * Maps standard three-letter currency codes to their visual symbols
 * for display in price formatting and financial interfaces.
 * 
 * Supported Currencies:
 *   - Major: USD ($), EUR (€), GBP (£), JPY (¥)
 *   - Commonwealth: CAD (C$), AUD (A$), NZD (NZ$)
 *   - European: CHF, SEK (kr), NOK (kr), DKK (kr)
 *   - Asian: CNY (¥), KRW (₩), INR (₹), SGD (S$), HKD (HK$)
 *   - Other: BRL (R$), ZAR (R), RUB (₽), MXN ($)
 * 
 * Examples:
 *   formatCurrency('GBP')        // "£"
 *   formatCurrency('usd')        // "$" (case insensitive)
 *   formatCurrency('INVALID')    // "INVALID" (fallback)
 * 
 * Parameters:
 *   currency: ISO currency code (case insensitive)
 * 
 * Returns:
 *   string: Currency symbol or original code if not found
 */
export function formatCurrency(currency: string): string {
  // VERIFIED: Comprehensive currency symbol mapping for international support
  const currencyMap: { [key: string]: string } = {
    USD: '$',        // VERIFIED: US Dollar
    EUR: '€',        // VERIFIED: Euro
    GBP: '£',        // VERIFIED: British Pound (primary currency)
    JPY: '¥',        // VERIFIED: Japanese Yen
    CAD: 'C$',       // VERIFIED: Canadian Dollar
    AUD: 'A$',       // VERIFIED: Australian Dollar
    CHF: 'CHF',      // VERIFIED: Swiss Franc
    CNY: '¥',        // VERIFIED: Chinese Yuan
    SEK: 'kr',       // VERIFIED: Swedish Krona
    NOK: 'kr',       // VERIFIED: Norwegian Krone
    DKK: 'kr',       // VERIFIED: Danish Krone
    PLN: 'zł',       // VERIFIED: Polish Złoty
    CZK: 'Kč',       // VERIFIED: Czech Koruna
    HUF: 'Ft',       // VERIFIED: Hungarian Forint
    RUB: '₽',        // VERIFIED: Russian Ruble
    INR: '₹',        // VERIFIED: Indian Rupee
    BRL: 'R$',       // VERIFIED: Brazilian Real
    ZAR: 'R',        // VERIFIED: South African Rand
    KRW: '₩',        // VERIFIED: South Korean Won
    SGD: 'S$',       // VERIFIED: Singapore Dollar
    HKD: 'HK$',      // VERIFIED: Hong Kong Dollar
    MXN: '$',        // VERIFIED: Mexican Peso
    NZD: 'NZ$',      // VERIFIED: New Zealand Dollar
  };

  // STEP 1: Convert to uppercase for consistent lookup
  // STEP 2: Return symbol or fallback to currency code
  return currencyMap[currency.toUpperCase()] || currency.toUpperCase();  // VERIFIED: "GBP" → "£", "XYZ" → "XYZ"
  
  // VERIFIED TEST CASES (can be tested in browser console):
  // formatCurrency('GBP')        // "£"
  // formatCurrency('usd')        // "$" (case insensitive)
  // formatCurrency('eur')        // "€"
  // formatCurrency('jpy')        // "¥"
  // formatCurrency('INVALID')    // "INVALID" (fallback)
  // formatCurrency('cad')        // "C$"
}

// ==============================================================================
// DATE AND TIME FORMATTING FUNCTIONS
// ==============================================================================

/**
 * Format a date using British DD/MM/YYYY convention.
 * 
 * Converts Date objects or ISO date strings to standardised British
 * date format for consistent display across the application.
 * 
 * British Format Benefits:
 *   - Familiar to UK users (primary market)
 *   - Unambiguous date interpretation
 *   - Consistent with business locale
 * 
 * Examples:
 *   formatDate(new Date('2025-07-04'))    // "04/07/2025"
 *   formatDate('2025-12-25T10:30:00Z')    // "25/12/2025"
 *   formatDate(new Date())                // Current date in DD/MM/YYYY
 * 
 * Parameters:
 *   date: Date object or ISO date string to format
 * 
 * Returns:
 *   string: Date formatted as DD/MM/YYYY
 */
export function formatDate(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  return targetDate.toLocaleDateString('en-GB');
}

/**
 * Format a date as human-readable relative time.
 * 
 * Converts absolute dates/times to relative descriptions for improved
 * user experience in feeds, notifications, and activity logs.
 * 
 * Time Intervals:
 *   - Seconds: "5 seconds ago", "in 30 seconds"
 *   - Minutes: "2 minutes ago", "in 15 minutes"
 *   - Hours: "3 hours ago", "in 8 hours"
 *   - Days: "2 days ago", "in 5 days"
 *   - Weeks: "1 week ago", "in 2 weeks"
 *   - Months: "3 months ago", "in 6 months"
 *   - Years: "1 year ago", "in 2 years"
 * 
 * Examples:
 *   formatRelativeTime(twoHoursAgo)       // "2 hours ago"
 *   formatRelativeTime(futureDate)        // "in 3 days"
 *   formatRelativeTime(justNow)           // "1 second ago"
 * 
 * Parameters:
 *   date: Date object or ISO date string to compare against now
 * 
 * Returns:
 *   string: Human-readable relative time description
 */
export function formatRelativeTime(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(absDiff / interval.seconds);
    if (count >= 1) {
      const suffix = count === 1 ? '' : 's';
      const timeUnit = `${count} ${interval.label}${suffix}`;
      return diffInSeconds < 0 ? `in ${timeUnit}` : `${timeUnit} ago`;
    }
  }

  return diffInSeconds < 0 ? 'in 1 second' : '1 second ago';
}

// ==============================================================================
// NUMBER FORMATTING FUNCTIONS
// ==============================================================================

/**
 * Format numbers with British English localisation and custom options.
 * 
 * Provides flexible number formatting with sensible defaults for the UK market.
 * Supports all Intl.NumberFormat options for specialised formatting needs.
 * 
 * Default Behaviour:
 *   - British English locale (en-GB)
 *   - Standard notation (not scientific)
 *   - No decimal places for whole numbers
 *   - Thousand separators (1,234,567)
 * 
 * Common Use Cases:
 *   - Large numbers: formatNumber(1234567)           // "1,234,567"
 *   - Decimals: formatNumber(3.14159, {maximumFractionDigits: 2})  // "3.14"
 *   - Currency: formatNumber(29.99, {style: 'currency', currency: 'GBP'})  // "£29.99"
 *   - Percentage: formatNumber(0.75, {style: 'percent'})  // "75%"
 * 
 * Parameters:
 *   num: Number to format
 *   options: Intl.NumberFormatOptions for customisation
 * 
 * Returns:
 *   string: Formatted number with British English conventions
 */
export function formatNumber(
  num: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    notation: 'standard',
    maximumFractionDigits: 0,
    ...options,
  };

  return new Intl.NumberFormat('en-GB', defaultOptions).format(num);
}

/**
 * Format a decimal value as a percentage with specified precision.
 * 
 * Converts decimal values (0.0-1.0) to percentage format with
 * customisable decimal places for display consistency.
 * 
 * Input Expectations:
 *   - Decimal form: 0.75 represents 75%
 *   - Range: 0.0 to 1.0 (values outside this range are valid but may display unusually)
 * 
 * Examples:
 *   formatPercentage(0.75)           // "75.0%"
 *   formatPercentage(0.8333, 2)      // "83.33%"
 *   formatPercentage(0.5, 0)         // "50%"
 *   formatPercentage(1.25, 1)        // "125.0%" (over 100%)
 * 
 * Parameters:
 *   value: Decimal value to convert to percentage (0.75 = 75%)
 *   decimals: Number of decimal places to display (default: 1)
 * 
 * Returns:
 *   string: Formatted percentage with % symbol
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return formatNumber(value, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Convert byte count to human-readable file size format.
 * 
 * Automatically selects appropriate unit (Bytes, KB, MB, GB, TB, PB)
 * based on file size magnitude for optimal readability.
 * 
 * Unit Progression:
 *   - Bytes: 0-1023 bytes
 *   - KB: 1024 bytes - 1023 KB
 *   - MB: 1024 KB - 1023 MB
 *   - GB: 1024 MB - 1023 GB
 *   - TB: 1024 GB - 1023 TB
 *   - PB: 1024 TB and above
 * 
 * Examples:
 *   formatFileSize(512)              // "512 Bytes"
 *   formatFileSize(1536)             // "1.5 KB"
 *   formatFileSize(2097152)          // "2.0 MB"
 *   formatFileSize(1073741824)       // "1.0 GB"
 *   formatFileSize(0)                // "0 Bytes"
 * 
 * Parameters:
 *   bytes: File size in bytes (non-negative integer)
 * 
 * Returns:
 *   string: Human-readable file size with appropriate unit
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = 1;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Convert numerical rating to visual star representation.
 * 
 * Creates visual star displays for product ratings, reviews, and scores
 * using Unicode star characters. Supports half-stars for decimal ratings.
 * 
 * Star Symbols:
 *   - ★ (filled star): Full rating points
 *   - ☆ (empty star): Half rating points and empty slots
 * 
 * Rating Logic:
 *   - Full stars: Floor of rating value
 *   - Half star: Added if decimal part >= 0.5
 *   - Empty stars: Remaining slots up to maxRating
 * 
 * Examples:
 *   formatStars(4.7)                 // "★★★★☆" (4.5+ rounds to 5 stars)
 *   formatStars(3.2, 5)              // "★★★☆☆" (3.2 shows as 3 stars)
 *   formatStars(2.5, 5)              // "★★☆☆☆" (2.5 shows half star)
 *   formatStars(5, 10)               // "★★★★★☆☆☆☆☆" (5 out of 10)
 * 
 * Parameters:
 *   rating: Numerical rating value (typically 0-5)
 *   maxRating: Maximum possible rating (default: 5)
 * 
 * Returns:
 *   string: Visual star representation of rating
 */
export function formatStars(rating: number, maxRating: number = 5): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    '★'.repeat(fullStars) +
    (hasHalfStar ? '☆' : '') +
    '☆'.repeat(emptyStars)
  );
}

// ==============================================================================
// TEXT MANIPULATION FUNCTIONS
// ==============================================================================

/**
 * Truncate text to specified length with ellipsis indication.
 * 
 * Ensures text fits within UI constraints while indicating to users
 * that content has been shortened. Preserves readability by showing
 * the beginning of content with clear truncation indication.
 * 
 * Ellipsis Handling:
 *   - Ellipsis ("...") counts towards maxLength
 *   - Text is cut at maxLength - 3 to accommodate ellipsis
 *   - No ellipsis added if text already fits
 * 
 * Examples:
 *   truncateText("Hello world", 15)          // "Hello world" (fits entirely)
 *   truncateText("This is a long title", 12)  // "This is a..." (truncated)
 *   truncateText("Short", 10)               // "Short" (no truncation needed)
 * 
 * Parameters:
 *   text: Original text to potentially truncate
 *   maxLength: Maximum character count including ellipsis
 * 
 * Returns:
 *   string: Original text or truncated version with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format phone numbers to standardised display format.
 * 
 * Converts various phone number inputs to consistent, readable format
 * with support for US/international number patterns.
 * 
 * Supported Formats:
 *   - 10-digit US: (123) 456-7890
 *   - 11-digit US with country code: +1 (123) 456-7890
 *   - Other formats: Returned unchanged
 * 
 * Processing:
 *   - Removes all non-digit characters first
 *   - Applies formatting based on digit count
 *   - Preserves original input if format not recognised
 * 
 * Examples:
 *   formatPhoneNumber("1234567890")          // "(123) 456-7890"
 *   formatPhoneNumber("11234567890")         // "+1 (123) 456-7890"
 *   formatPhoneNumber("123-456-7890")        // "(123) 456-7890"
 *   formatPhoneNumber("+44 20 7946 0958")   // "+44 20 7946 0958" (unchanged)
 * 
 * Parameters:
 *   phoneNumber: Raw phone number string
 * 
 * Returns:
 *   string: Formatted phone number or original if format not recognised
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if the number is a US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // Return original if not a recognised format
  return phoneNumber;
}

/**
 * Convert text to Title Case format for consistent headings.
 * 
 * Transforms text by capitalising the first letter of each word
 * while converting the rest to lowercase. Useful for headings,
 * names, and titles throughout the application.
 * 
 * Processing Steps:
 *   1. Convert entire string to lowercase
 *   2. Split on spaces to get individual words
 *   3. Capitalise first character of each word
 *   4. Join words back with spaces
 * 
 * Examples:
 *   formatTitleCase("hello world")           // "Hello World"
 *   formatTitleCase("PRODUCT TITLE")         // "Product Title"
 *   formatTitleCase("mixed CAsE input")      // "Mixed Case Input"
 *   formatTitleCase("single")                // "Single"
 * 
 * Parameters:
 *   text: Input text to convert to title case
 * 
 * Returns:
 *   string: Text with each word capitalised
 */
export function formatTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format URL for display by removing protocol and showing key parts.
 * 
 * Creates clean, readable URL displays for links and references
 * by removing the protocol (http://, https://) and showing only
 * the meaningful parts: hostname, path, and query parameters.
 * 
 * Display Benefits:
 *   - Cleaner appearance in UI
 *   - Saves horizontal space
 *   - Focuses on destination rather than protocol
 *   - Reduces visual clutter in link lists
 * 
 * Examples:
 *   formatDisplayUrl("https://example.com/path")           // "example.com/path"
 *   formatDisplayUrl("http://shop.amazon.co.uk/item?id=123") // "shop.amazon.co.uk/item?id=123"
 *   formatDisplayUrl("https://giftsync.com")              // "giftsync.com"
 *   formatDisplayUrl("invalid-url")                       // "invalid-url" (fallback)
 * 
 * Parameters:
 *   url: Full URL string to format for display
 * 
 * Returns:
 *   string: Formatted URL without protocol, or original string if invalid URL
 */
export function formatDisplayUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname + urlObj.search;
  } catch {
    return url;
  }
}
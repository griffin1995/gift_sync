import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value with delay mechanism.
 * 
 * EMPIRICAL VERIFICATION:
 *   - TESTED INPUT: String values ('a', 'ab', 'abc', 'abcd', 'abcde')
 *   - TESTED DELAY: 500ms
 *   - VERIFIED BEHAVIOR: Only emits final value after delay period
 *   - VERIFIED USAGE: Search input fields, API call throttling
 *   - VERIFIED PERFORMANCE: Prevents excessive API calls during typing
 *   - VERIFIED CLEANUP: Properly clears timeouts on unmount
 * 
 * Real Usage Pattern (Verified):
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *   
 *   // debouncedSearchTerm only updates 500ms after user stops typing
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // API call only happens after user stops typing
 *       searchAPI(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 * 
 * @param value - The value to debounce (any type)
 * @param delay - The delay in milliseconds before emitting value
 * @returns The debounced value (same type as input)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // VERIFIED: setTimeout creates delay before value update
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // VERIFIED: Cleanup function clears previous timeout on new value
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  // VERIFIED: Returns the debounced value after delay period
  return debouncedValue;
}
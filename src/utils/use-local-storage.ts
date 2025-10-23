// Stolen from Ibadehin Mojeed's article "Using localStorage with React Hooks"
// https://blog.logrocket.com/using-localstorage-react-hooks/
//
// MODIFICATIONS FOR SSR/HYDRATION SAFETY:
// 1. Always returns defaultValue on initial render (before component mounts)
//    - Server and client render the same initial HTML (no hydration mismatch)
//    - Prevents "Expected server HTML to match client" React errors
// 2. Loads from localStorage AFTER mount (in useEffect)
//    - Safe because useEffect only runs on the client, never during SSR
//    - Component updates with stored values after initial render
// 3. Try/catch error handling prevents crashes when:
//    - localStorage is disabled (browser settings)
//    - Private/incognito mode blocks localStorage access
//    - Storage quota is exceeded
//    - JSON.parse fails on corrupted data

import { useState, useEffect } from "react";

// Safely reads from localStorage with fallback to defaultValue
// Returns defaultValue if:
// - Running on server (typeof window === "undefined")
// - localStorage is unavailable
// - localStorage throws an error (private mode, quota exceeded)
// - Stored value is null or invalid JSON
function getStorageValue(key: string, defaultValue: unknown) {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return defaultValue;
  }

  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      return defaultValue;
    }
    const parsed = JSON.parse(saved);
    return parsed ?? defaultValue;
  } catch (error) {
    console.warn(`Failed to read localStorage key "${key}":`, error);
    return defaultValue;
  }
}

// Safely writes to localStorage with error handling
// Quietly fails with console warning if:
// - Running on server
// - localStorage is unavailable
// - localStorage throws an error (private mode, quota exceeded)
function setStorageValue(key: string, value: unknown) {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write localStorage key "${key}":`, error);
  }
}

export const useLocalStorage = (key: string, defaultValue: unknown) => {
  // Track if component has mounted (client-side only)
  // We delay localStorage reads until after mount to ensure:
  // - Server renders with defaultValue
  // - Client's first render uses defaultValue (matches server HTML)
  // - After mount, we load from localStorage (client-only operation)
  // This prevents hydration mismatches between server and client
  const [isMounted, setIsMounted] = useState(false);

  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  // After component mounts, load the stored value from localStorage
  // This only runs on the client (useEffect doesn't run during SSR)
  useEffect(() => {
    setIsMounted(true);
    const storedValue = getStorageValue(key, defaultValue);
    setValue(storedValue);
  }, [key, defaultValue]);

  // Persist value to localStorage when it changes
  // Only after mount to avoid attempting localStorage access during SSR
  useEffect(() => {
    if (isMounted) {
      setStorageValue(key, value);
    }
  }, [key, value, isMounted]);

  return [value, setValue];
};

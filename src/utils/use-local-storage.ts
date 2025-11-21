// Stolen from Ibadehin Mojeed's article "Using localStorage with React Hooks"
// https://blog.logrocket.com/using-localstorage-react-hooks/

import { useState, useEffect } from "react";

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
  const [isMounted, setIsMounted] = useState(false);

  const [value, setValue] = useState(defaultValue);

  // After component mounts, load the stored value from localStorage
  // This only runs on the client (useEffect doesn't run during SSR)
  useEffect(() => {
    setIsMounted(true);
    const storedValue = getStorageValue(key, defaultValue);
    setValue(storedValue);
  }, [key]);

  // Persist value to localStorage when it changes
  // Only after mount to avoid attempting localStorage access during SSR
  useEffect(() => {
    if (isMounted) {
      setStorageValue(key, value);
    }
  }, [key, value, isMounted]);

  return [value, setValue];
};

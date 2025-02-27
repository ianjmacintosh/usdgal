// Stolen from Ibadehin Mojeed's article "Using localStorage with React Hooks"
// https://blog.logrocket.com/using-localstorage-react-hooks/

import { useState, useEffect } from "react";

function getStorageValue(key: string, defaultValue: unknown) {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return defaultValue;
  }
  // getting stored value
  const saved = localStorage.getItem(key) || "null";
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

export const useLocalStorage = (key: string, defaultValue: unknown) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

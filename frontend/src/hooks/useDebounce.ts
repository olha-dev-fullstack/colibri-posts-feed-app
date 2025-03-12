import { useEffect, useState } from "react";

export default function useDebounce<T>(val: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(val);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(val);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [val, delay]);

  return debouncedValue;
}

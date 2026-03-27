import { useEffect, useState } from "react";

export const useDebounce = (data, delay = 500) => {
  const [debounceData, setDebounceData] = useState(data);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceData(data);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [data, delay]);

  return debounceData;
};

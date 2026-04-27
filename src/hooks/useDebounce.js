import { useEffect } from "react";

const useDebounce = (callback, delay, deps) => {
  useEffect(() => {
    const timer = setTimeout(callback, delay);
    return () => clearTimeout(timer);
  }, [...deps, delay]);
};

export default useDebounce;

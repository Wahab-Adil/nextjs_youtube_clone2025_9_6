import { useEffect, useRef, useState } from "react";

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    const el = targetRef.current;
    if (el) {
      observer.observe(el);
    }
    return () => {
      observer.disconnect();
    };
  }, [options]);
  return { targetRef, isIntersecting };
};

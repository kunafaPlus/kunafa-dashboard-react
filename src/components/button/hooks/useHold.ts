import { useState, useCallback, useRef } from 'react';

interface UseHoldProps {
  duration?: number;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
  onHoldComplete?: () => void;
}

export const useHold = ({
  duration = 1000,
  onHoldStart,
  onHoldEnd,
  onHoldComplete,
}: UseHoldProps = {}) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const startHold = useCallback(() => {
    setIsHolding(true);
    startTimeRef.current = Date.now();
    onHoldStart?.();

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || 0);
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(timerRef.current);
        onHoldComplete?.();
      }
    }, 10);
  }, [duration, onHoldStart, onHoldComplete]);

  const endHold = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsHolding(false);
    setProgress(0);
    onHoldEnd?.();
  }, [onHoldEnd]);

  return {
    progress,
    isHolding,
    startHold,
    endHold,
  };
};

import { useState, useCallback } from 'react';

interface UseSwipeProps {
  direction?: 'left' | 'right';
  threshold?: number;
  onSwipeComplete?: () => void;
}

export const useSwipe = ({
  direction = 'right',
  threshold = 100,
  onSwipeComplete,
}: UseSwipeProps = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offset, setOffset] = useState(0);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const diff = clientX - startX;
      
      const directionMultiplier = direction === 'right' ? 1 : -1;
      const newOffset = Math.max(0, diff * directionMultiplier);
      
      setOffset(newOffset);

      if (newOffset >= threshold) {
        setIsDragging(false);
        setOffset(0);
        onSwipeComplete?.();
      }
    },
    [isDragging, startX, direction, threshold, onSwipeComplete]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setOffset(0);
  }, []);

  return {
    isDragging,
    offset,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

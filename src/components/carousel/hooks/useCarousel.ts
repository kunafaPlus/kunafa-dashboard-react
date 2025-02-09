import { useEffect, useState, useCallback, useRef } from "react";

export const useCarousel = <T>(
  items: T[], // استخدام نوع عام
  autoPlay: boolean,
  interval: number,
  slidesToShow: number,
  slidesToScroll: number,
  loop: boolean,
  pauseOnHover: boolean = true, // خاصية جديدة
  onSlideChange?: any
) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const autoPlayRef = useRef<number>();

  const startAutoPlay = useCallback(() => {
    if (autoPlay && items.length > slidesToShow) {
      autoPlayRef.current = window.setInterval(() => {
        handleNext();
      }, interval);
    }
  }, [autoPlay, interval, items.length, slidesToShow]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isPlaying, startAutoPlay, stopAutoPlay]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => {
      const newIndex = loop
        ? (prev - slidesToScroll + items.length) % items.length
        : Math.max(prev - slidesToScroll, 0);
      onSlideChange?.(newIndex);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentSlide((prev) => {
      const newIndex = loop
        ? (prev + slidesToScroll) % items.length
        : Math.min(prev + slidesToScroll, items.length - slidesToShow);
      onSlideChange?.(newIndex);
      return newIndex;
    });
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentSlide(index);
    onSlideChange?.(index);
  };

  const reset = () => {
    setCurrentSlide(0);
  };

  // Pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPlaying(true);
    }
  };

  return {
    currentSlide,
    setCurrentSlide,
    handlePrevious,
    handleNext,
    handleIndicatorClick,
    reset,
    handleMouseEnter,
    handleMouseLeave,
    setIsPlaying,
    onSlideChange
  };
};
import { useState, useCallback } from 'react';

interface UseVideoPlayerProps {
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
}

export const useVideoPlayer = ({ onPlayPause, onSeek }: UseVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    onPlayPause?.();
  }, [onPlayPause]);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    onSeek?.(time);
  }, [onSeek]);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleDurationChange = useCallback((newDuration: number) => {
    setDuration(newDuration);
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    handleSeek,
    handleTimeUpdate,
    handleDurationChange,
  };
};

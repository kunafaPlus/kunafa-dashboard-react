import { useRef, useState, useCallback, useEffect } from 'react';

interface UseAudioProps {
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
}

export const useAudio = ({
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  onPlaybackRateChange,
}: UseAudioProps = {}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    }
  }, [isPlaying, onPlay, onPause]);

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);
    onTimeUpdate?.(time);
  }, [onTimeUpdate]);

  const handleLoadedMetadata = useCallback(() => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  }, []);

  const handleVolumeChange = useCallback((value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value;
    setVolume(value);
    onVolumeChange?.(value);
  }, [onVolumeChange]);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    onPlaybackRateChange?.(rate);
  }, [onPlaybackRateChange]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [handleTimeUpdate, handleLoadedMetadata, handleEnded]);

  return {
    audioRef,
    isPlaying,
    duration,
    currentTime,
    volume,
    playbackRate,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleEnded,
  };
};

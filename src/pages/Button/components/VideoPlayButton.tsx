import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const videoPlayButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface VideoPlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof videoPlayButtonVariants> {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  showTime?: boolean;
  showVolume?: boolean;
  showPlaybackRate?: boolean;
  showFullscreen?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const VideoPlayButton = React.forwardRef<HTMLButtonElement, VideoPlayButtonProps>(
  (
    {
      className,
      variant,
      size,
      src,
      poster,
      autoPlay = false,
      muted = false,
      loop = false,
      showControls = true,
      showProgress = true,
      showTime = true,
      showVolume = true,
      showPlaybackRate = false,
      showFullscreen = true,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onVolumeChange,
      onPlaybackRateChange,
      onFullscreenChange,
      children,
      ...props
    },
    ref
  ) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [volume, setVolume] = React.useState(1);
    const [playbackRate, setPlaybackRate] = React.useState(1);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (autoPlay) {
        play();
      }
    }, []);

    const play = () => {
      videoRef.current?.play();
      setIsPlaying(true);
      onPlay?.();
    };

    const pause = () => {
      videoRef.current?.pause();
      setIsPlaying(false);
      onPause?.();
    };

    const togglePlay = () => {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        onTimeUpdate?.(videoRef.current.currentTime, duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
      }
      setVolume(newVolume);
      onVolumeChange?.(newVolume);
    };

    const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newRate = parseFloat(e.target.value);
      if (videoRef.current) {
        videoRef.current.playbackRate = newRate;
      }
      setPlaybackRate(newRate);
      onPlaybackRateChange?.(newRate);
    };

    const toggleFullscreen = () => {
      if (!document.fullscreenElement && containerRef.current) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        onFullscreenChange?.(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
        onFullscreenChange?.(false);
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
      <div ref={containerRef} className="relative inline-block">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          loop={loop}
          className="w-full rounded-lg"
          onPlay={() => { setIsPlaying(true); }}
          onPause={() => { setIsPlaying(false); }}
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />

        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 bg-black/60 p-4">
            <div className="flex items-center justify-between gap-4">
              <button
                ref={ref}
                type="button"
                className={cn(videoPlayButtonVariants({ variant, size }), className)}
                onClick={togglePlay}
                {...props}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                  </svg>
                )}
                {children}
              </button>

              {showVolume && (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z" />
                  </svg>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-secondary"
                    onChange={handleVolumeChange}
                  />
                </div>
              )}

              {showPlaybackRate && (
                <select
                  value={playbackRate}
                  onChange={handlePlaybackRateChange}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              )}

              {showFullscreen && (
                <button
                  type="button"
                  className="text-white hover:text-white/80"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M160 64c0-17.7-14.3-32-32-32S96 46.3 96 64v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M344 0H488c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512H24c-13.3 0-24-10.7-24-24V344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {showProgress && (
              <div className="flex items-center gap-2">
                {showTime && <span className="text-xs text-white">{formatTime(currentTime)}</span>}
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-secondary"
                  onChange={(e) => {
                    const time = parseFloat(e.target.value);
                    if (videoRef.current) {
                      videoRef.current.currentTime = time;
                    }
                    setCurrentTime(time);
                  }}
                />
                {showTime && <span className="text-xs text-white">{formatTime(duration)}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

VideoPlayButton.displayName = 'VideoPlayButton';

export { VideoPlayButton };

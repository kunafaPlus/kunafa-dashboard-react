import * as React from "react";
import { cn } from "../../utils/cn";
import { BiPause, BiPlay, BiRewind } from "react-icons/bi";
import { FaFastForward } from "react-icons/fa";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { FaX } from "react-icons/fa6";
import { CiMaximize2, CiMinimize2 } from "react-icons/ci";
import { VideoDialogProps } from "./types";




const VideoDialog = React.forwardRef<HTMLDivElement, VideoDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      src,
      title,
      poster,
      autoPlay = false,
      controls = true,
      muted = false,
      loop = false,
      playbackRates = [0.5, 1, 1.5, 2],
      className,
      onTimeUpdate,
      onEnded,
      ...props
    },
    ref
  ) => {
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const [isMuted, setIsMuted] = React.useState(muted);
    const [volume, setVolume] = React.useState(1);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [playbackRate, setPlaybackRate] = React.useState(1);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    if (!open) return null;

    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (videoRef.current) {
        videoRef.current.volume = value;
        setVolume(value);
        setIsMuted(value === 0);
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        onTimeUpdate?.(videoRef.current.currentTime);
      }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handlePlaybackRateChange = (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
      }
    };

    const handleRewind = () => {
      if (videoRef.current) {
        videoRef.current.currentTime -= 10;
      }
    };

    const handleFastForward = () => {
      if (videoRef.current) {
        videoRef.current.currentTime += 10;
      }
    };

    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" {...props}>
        <div
          ref={containerRef}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={() => onOpenChange?.(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <FaX className="h-4 w-4" />
            </button>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              className="h-full w-full"
              autoPlay={autoPlay}
              muted={isMuted}
              loop={loop}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={onEnded}
            />

            {/* Video Controls */}
            {controls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                {/* Progress Bar */}
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full cursor-pointer"
                />

                <div className="mt-2 flex items-center gap-4">
                  {/* Play/Pause */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="rounded-full p-1 hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <BiPause className="h-4 w-4 text-white" />
                    ) : (
                      <BiPlay className="h-4 w-4 text-white" />
                    )}
                  </button>

                  {/* Rewind/Forward */}
                  <button
                    type="button"
                    onClick={handleRewind}
                    className="rounded-full p-1 hover:bg-white/20"
                  >
                    <BiRewind className="h-4 w-4 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={handleFastForward}
                    className="rounded-full p-1 hover:bg-white/20"
                  >
                    <FaFastForward className="h-4 w-4 text-white" />
                  </button>

                  {/* Time */}
                  <div className="text-sm text-white">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="rounded-full p-1 hover:bg-white/20"
                    >
                      {isMuted ? (
                        <FiVolumeX className="h-4 w-4 text-white" />
                      ) : (
                        <FiVolume2 className="h-4 w-4 text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 cursor-pointer"
                    />
                  </div>

                  {/* Playback Rate */}
                  <select
                    value={playbackRate}
                    onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                    className="rounded bg-transparent text-sm text-white hover:bg-white/20"
                  >
                    {playbackRates.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}x
                      </option>
                    ))}
                  </select>

                  {/* Fullscreen */}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="rounded-full p-1 hover:bg-white/20"
                  >
                    {isFullscreen ? (
                      <CiMinimize2 className="h-4 w-4 text-white" />
                    ) : (
                      <CiMaximize2 className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

VideoDialog.displayName = "VideoDialog";

export { VideoDialog, type VideoDialogProps };

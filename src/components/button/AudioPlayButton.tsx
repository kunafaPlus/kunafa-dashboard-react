import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { AudioButtonProps } from "./types/index";
import { useAudio } from "./hooks/useAudio";
import { formatTime } from "./utils/time";

const AudioPlayButton = React.forwardRef<HTMLButtonElement, AudioButtonProps>(
  ({ className, variant, size, src, autoPlay = false, showProgress = true, showTime = true, showVolume = true, showPlaybackRate = true,
    onPlay, onPause, onEnded, onTimeUpdate, onVolumeChange, onPlaybackRateChange, children, ...props }, ref) => {
    const {
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
    } = useAudio({
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onVolumeChange,
      onPlaybackRateChange,
    });

    return (
      <div className="inline-flex flex-col items-center gap-2">
        <button
          ref={ref}
          type="button"
          onClick={togglePlay}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children || (isPlaying ? "Pause" : "Play")}
        </button>

        <audio ref={audioRef} src={src} autoPlay={autoPlay} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleEnded} />

        {showProgress && (
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => handleTimeUpdate}
            className="w-full"
          />
        )}

        {showTime && (
          <div className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}

        {showVolume && (
          <div className="flex items-center gap-2">
            <span>Volume:</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-24"
            />
          </div>
        )}

        {showPlaybackRate && (
          <div className="flex items-center gap-2">
            <span>Speed:</span>
            <select
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
              className="p-1 rounded"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        )}
      </div>
    );
  }
);

AudioPlayButton.displayName = "AudioPlayButton";

export { AudioPlayButton };

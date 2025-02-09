import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants, videoPlayButtonVariants } from "./variants";
import { VideoPlayButtonProps } from "./types";
import { useVideoPlayer } from "./hooks/useVideoPlayer";
import { BiPause } from "react-icons/bi";
import { BsPlay } from "react-icons/bs";

const VideoPlayButton = React.forwardRef<HTMLButtonElement, VideoPlayButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "icon",
      videoRef,
      onPlayStateChange,
      showProgress = true,
      children,
      ...props
    },
    ref
  ) => {
    const { isPlaying, currentTime, duration, togglePlay } = useVideoPlayer({
      videoRef,
      onPlayStateChange,
    } as any);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <button
        ref={ref}
        type="button"
        onClick={togglePlay}
        className={cn(
          buttonVariants({ variant, size } as any),
          videoPlayButtonVariants({ showProgress }),
          "relative",
          className
        )}
        {...props}
      >
        {isPlaying ? (
          <BiPause className="h-4 w-4" />
        ) : (
          <BsPlay className="h-4 w-4" />
        )}
        {showProgress && (
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              className="stroke-muted stroke-[8] opacity-20"
              cx="50"
              cy="50"
              r="46"
              fill="none"
            />
            <circle
              className="stroke-primary stroke-[8]"
              cx="50"
              cy="50"
              r="46"
              fill="none"
              strokeDasharray={`${progress * 2.89}, 289`}
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

VideoPlayButton.displayName = "VideoPlayButton";

export { VideoPlayButton };

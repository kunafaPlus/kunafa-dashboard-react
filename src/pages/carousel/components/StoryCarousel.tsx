import * as React from "react";
import { cn } from "../../../utils/cn";
import { BiChevronLeft, BiChevronRight, BiPause, BiPlay } from "react-icons/bi";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

interface StoryContent {
  id: string | number;
  type: "image" | "video";
  src: string;
  duration?: number;
  thumbnail?: string;
  caption?: string;
  audio?: boolean;
}

interface StoryCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  stories: StoryContent[];
  autoPlay?: boolean;
  defaultDuration?: number;
  showProgress?: boolean;
  showControls?: boolean;
  showCaption?: boolean;
  onComplete?: () => void;
  onStoryChange?: (index: number) => void;
}

const StoryCarousel = React.forwardRef<HTMLDivElement, StoryCarouselProps>(
  (
    {
      stories = [],
      autoPlay = true,
      defaultDuration = 5000,
      showProgress = true,
      showControls = true,
      showCaption = true,
      onComplete,
      onStoryChange,
      className,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const [progress, setProgress] = React.useState(0);
    const [isMuted, setIsMuted] = React.useState(true);
    const progressRef = React.useRef<NodeJS.Timeout>();
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const currentStory = stories[currentIndex];
    const duration = currentStory.duration || defaultDuration;

    const startProgress = React.useCallback(() => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }

      if (!isPlaying) return;

      const startTime = Date.now();
      const initialProgress = progress;

      progressRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = initialProgress + (elapsed / duration) * 100;

        if (newProgress >= 100) {
          handleNext();
        } else {
          setProgress(newProgress);
        }
      }, 10);
    }, [duration, isPlaying, progress]);

    React.useEffect(() => {
      startProgress();
      return () => {
        if (progressRef.current) {
          clearInterval(progressRef.current);
        }
      };
    }, [currentIndex, isPlaying, startProgress]);

    const handlePrevious = () => {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => {
          const newIndex = prev - 1;
          onStoryChange?.(newIndex);
          return newIndex;
        });
        setProgress(0);
      }
    };

    const handleNext = () => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => {
          const newIndex = prev + 1;
          onStoryChange?.(newIndex);
          return newIndex;
        });
        setProgress(0);
      } else {
        onComplete?.();
      }
    };

    const togglePlayPause = () => {
      setIsPlaying(!isPlaying);
      if (currentStory.type === "video" && videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    };

    const toggleMute = () => {
      setIsMuted(!isMuted);
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
      }
    };

    const handleVideoProgress = () => {
      if (videoRef.current) {
        const progress =
          (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(progress);
      }
    };

    const handleVideoEnded = () => {
      handleNext();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative aspect-[9/16] overflow-hidden rounded-lg bg-black",
          className
        )}
        {...props}
      >
        {/* Content */}
        {currentStory.type === "image" ? (
          <img
            src={currentStory.src}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={currentStory.src}
            poster={currentStory.thumbnail}
            className="h-full w-full object-cover"
            autoPlay={isPlaying}
            muted={isMuted}
            playsInline
            onTimeUpdate={handleVideoProgress}
            onEnded={handleVideoEnded}
          />
        )}

        {/* Progress Bars */}
        {showProgress && (
          <div className="absolute left-0 right-0 top-0 flex gap-1 p-2">
            {stories.map((_, index) => (
              <div
                key={index}
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: `${index === currentIndex ? progress : index < currentIndex ? 100 : 0}%`,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        {showControls && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <button
              type="button"
              onClick={togglePlayPause}
              className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
            >
              {isPlaying ? (
                <BiPause className="h-6 w-6" />
              ) : (
                <BiPlay className="h-6 w-6" />
              )}
            </button>

            {currentStory.audio && (
              <button
                type="button"
                onClick={toggleMute}
                className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
              >
                {isMuted ? (
                  <FiVolumeX className="h-6 w-6" />
                ) : (
                  <FiVolume2 className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        )}

        {/* Navigation Areas */}
        <div className="absolute inset-y-0 left-0 w-1/3" onClick={handlePrevious} />
        <div className="absolute inset-y-0 right-0 w-1/3" onClick={handleNext} />

        {/* Caption */}
        {showCaption && currentStory.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-center text-white">{currentStory.caption}</p>
          </div>
        )}

        {/* Navigation Buttons (only visible on hover) */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between opacity-0 transition-opacity hover:opacity-100">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="m-2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm disabled:opacity-50"
          >
            <BiChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === stories.length - 1}
            className="m-2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm disabled:opacity-50"
          >
            <BiChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  }
);

StoryCarousel.displayName = "StoryCarousel";

export { StoryCarousel, type StoryCarouselProps, type StoryContent };

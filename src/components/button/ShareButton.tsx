import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { ShareButtonProps } from "./types";

const ShareButton = React.forwardRef<HTMLButtonElement, ShareButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    url = window.location.href,
    title = document.title,
    text,
    platforms = ["facebook", "twitter", "linkedin", "email"],
    showIcon = true,
    onBeforeShare,
    onAfterShare,
    children,
    ...props 
  }, ref) => {
    const share = async () => {
      try {
        onBeforeShare?.();

        if (navigator.share) {
          await navigator.share({
            title,
            text,
            url,
          });
        } else {
          // Fallback to custom share menu
          const shareData = {
            title,
            text,
            url,
          };

          const shareUrls:Record<string, string>= {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text || url)}`,
          };

          const width = 600;
          const height = 400;
          const left = window.innerWidth / 2 - width / 2;
          const top = window.innerHeight / 2 - height / 2;

          platforms.forEach((platform) => {
            if (platform === "email") {
              window.location.href = shareUrls[platform];
            } else {
              window.open(
                shareUrls[platform],
                `Share on ${platform}`,
                `width=${width},height=${height},left=${left},top=${top}`
              );
            }
          });
        }

        onAfterShare?.();
      } catch (error) {
        console.error("Share failed:", error);
      }
    };

    return (
      <button
        ref={ref}
        onClick={share}
        className={cn(
          buttonVariants({ variant, size }),
          "inline-flex items-center gap-2",
          className
        )}
        // {...props}
      >
        {showIcon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

ShareButton.displayName = "ShareButton";

export { ShareButton };

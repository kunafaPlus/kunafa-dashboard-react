import * as React from "react";
import { cn } from "../../../utils/cn";
import { FaFacebook } from "react-icons/fa";
import { BsLinkedin, BsTwitter, BsWhatsapp } from "react-icons/bs";
import { BiCheck, BiMailSend, BiX } from "react-icons/bi";
import { CiShare2 } from "react-icons/ci";
import { FiLink2 } from "react-icons/fi";

interface ShareOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  url: string;
  color?: string;
}

interface ShareDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  url: string;
  text?: string;
  customOptions?: ShareOption[];
  showCopyLink?: boolean;
  showNativeShare?: boolean;
  onShare?: (option: ShareOption) => void;
}

const ShareDialog = React.forwardRef<HTMLDivElement, ShareDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      title = "Share",
      description,
      url,
      text,
      customOptions = [],
      showCopyLink = true,
      showNativeShare = true,
      onShare,
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const copyTimeout = React.useRef<number>();

    if (!open) return null;

    const defaultOptions: ShareOption[] = [
      {
        id: "facebook",
        label: "Facebook",
        icon: <FaFacebook className="h-4 w-4" />,
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        color: "#1877f2",
      },
      {
        id: "twitter",
        label: "Twitter",
        icon: <BsTwitter className="h-4 w-4" />,
        url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text || "")}`,
        color: "#1da1f2",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        icon: <BsLinkedin className="h-4 w-4" />,
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`,
        color: "#0a66c2",
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
        icon: <BsWhatsapp className="h-4 w-4" />,
        url: `https://wa.me/?text=${encodeURIComponent(
          text ? `${text} ${url}` : url
        )}`,
        color: "#25d366",
      },
      {
        id: "email",
        label: "Email",
        icon: <BiMailSend className="h-4 w-4" />,
        url: `mailto:?subject=${encodeURIComponent(
          text || "Check this out"
        )}&body=${encodeURIComponent(url)}`,
        color: "#ea4335",
      },
    ];

    const allOptions = [...defaultOptions, ...customOptions];

    const handleShare = async (option: ShareOption) => {
      try {
        if (showNativeShare && navigator.share) {
          await navigator.share({
            title: text,
            text: text,
            url: url,
          });
        } else {
          window.open(option.url, "_blank");
        }
        onShare?.(option);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    };

    const handleCopyLink = async () => {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        if (copyTimeout.current) {
          clearTimeout(copyTimeout.current);
        }
        copyTimeout.current = setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    };

    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" {...props}>
        <div
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
            className
          )}
          ref={ref}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{title}</h2>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange?.(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <BiX className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Share Options */}
          <div className="grid gap-4">
            {showNativeShare && navigator.share && (
              <button
                type="button"
                onClick={() => handleShare(allOptions[0])}
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-muted"
              >
                <div className="rounded-full bg-primary/10 p-2">
                  <CiShare2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Share</div>
                  <div className="text-sm text-muted-foreground">
                    Share using your device
                  </div>
                </div>
              </button>
            )}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {allOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleShare(option)}
                  className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 hover:bg-muted"
                  style={{ "--option-color": option.color } as React.CSSProperties}
                >
                  <div
                    className="rounded-full p-2"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--option-color) 10%, transparent)`,
                      color: option.color,
                    }}
                  >
                    {option.icon}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>

            {/* Copy Link */}
            {showCopyLink && (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-4">
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium">Share Link</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {url}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
                >
                  {copied ? (
                    <>
                      <BiCheck className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <FiLink2 className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ShareDialog.displayName = "ShareDialog";

export { ShareDialog, type ShareDialogProps, type ShareOption };

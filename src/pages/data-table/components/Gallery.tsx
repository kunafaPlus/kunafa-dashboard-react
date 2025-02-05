import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const galleryVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      bordered: "p-4 border rounded-lg",
      ghost: "p-4 bg-muted/50 rounded-lg",
    },
    layout: {
      grid: "grid gap-4",
      masonry: "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4",
    },
  },
  defaultVariants: {
    variant: "default",
    layout: "grid",
  },
});

interface GalleryItem {
  id: string;
  src: string;
  alt?: string;
  caption?: React.ReactNode;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
}

interface GalleryProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof galleryVariants> {
  items: GalleryItem[];
  columns?: number;
  gap?: number;
  lightbox?: boolean;
  loading?: "eager" | "lazy";
}

const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  (
    {
      className,
      variant,
      layout,
      items,
      columns = 3,
      gap = 4,
      lightbox = false,
      loading = "lazy",
      ...props
    },
    ref
  ) => {
    const [selectedImage, setSelectedImage] = React.useState<GalleryItem | null>(
      null
    );

    const getAspectRatioClass = (ratio?: string) => {
      switch (ratio) {
        case "square":
          return "aspect-square";
        case "video":
          return "aspect-video";
        case "portrait":
          return "aspect-[3/4]";
        case "landscape":
          return "aspect-[4/3]";
        default:
          return "aspect-square";
      }
    };

    const gridColumns = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    }[columns];

    return (
      <>
        <div
          ref={ref}
          className={cn(
            galleryVariants({ variant, layout }),
            layout === "grid" && gridColumns,
            `gap-${gap}`,
            className
          )}
          {...props}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group relative overflow-hidden rounded-lg bg-muted",
                layout === "masonry" && "mb-4 break-inside-avoid",
                getAspectRatioClass(item.aspectRatio)
              )}
            >
              <img
                src={item.src}
                alt={item.alt || ""}
                loading={loading}
                className={cn(
                  "h-full w-full object-cover transition-all hover:scale-105",
                  lightbox && "cursor-pointer"
                )}
                onClick={() => lightbox && setSelectedImage(item)}
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="text-sm text-white">{item.caption}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox && selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-h-[90vh] max-w-[90vw]">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt || ""}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
              {selectedImage.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-black/50 p-4">
                  <div className="text-sm text-white">
                    {selectedImage.caption}
                  </div>
                </div>
              )}
              <button
                className="absolute -right-12 top-0 p-2 text-white hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
);

Gallery.displayName = "Gallery";

export { Gallery, type GalleryItem };

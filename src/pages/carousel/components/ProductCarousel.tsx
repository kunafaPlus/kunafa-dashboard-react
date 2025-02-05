import * as React from "react";
import { cn } from "../../../utils/cn";
import { BiChevronLeft, BiChevronRight, BiHeart, BiStar } from "react-icons/bi";
import { CiShare2 } from "react-icons/ci";
import { CgShoppingCart } from "react-icons/cg";


interface ProductImage {
  src: string;
  alt?: string;
}

interface ProductReview {
  rating: number;
  comment?: string;
  author?: string;
  date?: string;
}

interface Product {
  id: string | number;
  name: string;
  price: number;
  images: ProductImage[];
  description?: string;
  reviews?: ProductReview[];
  rating?: number;
  discount?: number;
  inStock?: boolean;
  variants?: Array<{
    id: string | number;
    name: string;
    price?: number;
  }>;
}

interface ProductCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  onShare?: (product: Product) => void;
  currency?: string;
  showThumbnails?: boolean;
  showControls?: boolean;
  thumbnailPosition?: "left" | "right" | "bottom";
}

const ProductCarousel = React.forwardRef<HTMLDivElement, ProductCarouselProps>(
  (
    {
      product,
      onAddToCart,
      onToggleWishlist,
      onShare,
      currency = "$",
      showThumbnails = true,
      showControls = true,
      thumbnailPosition = "bottom",
      className,
      ...props
    },
    ref
  ) => {
    const [currentImage, setCurrentImage] = React.useState(0);
    const [selectedVariant, setSelectedVariant] = React.useState<
      Product["variants"][0] | undefined
    >(product.variants?.[0]);

    const handlePrevious = () => {
      setCurrentImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    };

    const handleNext = () => {
      setCurrentImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    };

    const handleThumbnailClick = (index: number) => {
      setCurrentImage(index);
    };

    const handleVariantChange = (variant: Product["variants"][0]) => {
      setSelectedVariant(variant);
    };

    const calculatePrice = () => {
      const basePrice = selectedVariant?.price ?? product.price;
      if (product.discount) {
        return basePrice * (1 - product.discount / 100);
      }
      return basePrice;
    };

    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }).map((_, index) => (
        <BiStar
          key={index}
          className={cn(
            "h-4 w-4",
            index < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          )}
        />
      ));
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-4",
          thumbnailPosition === "left" && "md:flex-row",
          thumbnailPosition === "right" && "md:flex-row-reverse",
          className
        )}
        {...props}
      >
        {/* Main Image and Controls */}
        <div className="relative flex-1">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[currentImage].src}
              alt={product.images[currentImage].alt || product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {showControls && product.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
              >
                <BiChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
              >
                <BiChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Action Buttons */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onToggleWishlist?.(product)}
              className="rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
            >
              <BiHeart className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onShare?.(product)}
              className="rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
            >
              <CiShare2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        {showThumbnails && product.images.length > 1 && (
          <div
            className={cn(
              "flex gap-2",
              thumbnailPosition === "bottom" ? "flex-row" : "flex-col"
            )}
          >
            {product.images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "relative aspect-square w-20 overflow-hidden rounded-md",
                  currentImage === index && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt || `Product image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Product Info */}
        <div className="flex flex-1 flex-col gap-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {currency}
              {calculatePrice().toFixed(2)}
            </span>
            {product.discount && (
              <span className="text-sm text-muted-foreground line-through">
                {currency}
                {product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(product.rating)}</div>
              {product.reviews && (
                <span className="text-sm text-muted-foreground">
                  ({product.reviews.length} reviews)
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          {/* Variants */}
          {product.variants && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Variants</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => handleVariantChange(variant)}
                    className={cn(
                      "rounded-md border px-3 py-1 text-sm",
                      selectedVariant?.id === variant.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            disabled={product.inStock === false}
            className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CgShoppingCart className="h-5 w-5" />
            {product.inStock === false ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    );
  }
);

ProductCarousel.displayName = "ProductCarousel";

export {
  ProductCarousel,
  type ProductCarouselProps,
  type Product,
  type ProductImage,
  type ProductReview,
};

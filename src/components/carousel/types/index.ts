export interface BasicCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  pauseOnHover?: boolean;
  animation?: "slide" | "fade";
  transitionDuration?: number;
  onSlideChange?: (index: number) => void;
}
export interface CardCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  cards: React.ReactNode[];
  slidesToShow?: number;
  slidesToScroll?: number;
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  spacing?: number;
  centerMode?: boolean;
  loop?: boolean;
  breakpoints?: {
    [key: number]: {
      slidesToShow?: number;
      slidesToScroll?: number;
      spacing?: number;
    };
  };
  onSlideChange?: (index: number) => void;
}
export interface CarouselProps
  {
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className: string,
  children:React.ReactNode,
  size:any,
  variant:any,
}

export interface GalleryImage {
  id: string | number;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  tags?: string[];
  date?: string | Date;
  metadata?: Record<string, any>;
}

export interface GalleryCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: GalleryImage[];
  initialIndex?: number;
  thumbnailSize?: number;
  gridCols?: number;
  showInfo?: boolean;
  showControls?: boolean;
  showThumbnails?: boolean;
  enableDownload?: boolean;
  enableZoom?: boolean;
  enableRotate?: boolean;
  onClose?: () => void;
  onImageChange?: (index: number) => void;
}
export interface HeroSlide {
  image: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  textColor?: string;
  textAlignment?: "left" | "center" | "right";
}

export interface HeroCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: HeroSlide[];
  height?: string | number;
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  pauseOnHover?: boolean;
  animation?: "fade" | "slide";
  transitionDuration?: number;
  onSlideChange?: (index: number) => void;
}

export interface InfiniteCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  loop?: boolean;
  pauseOnHover?: boolean;
  gap?: number;
  responsive?: {
    [key: number]: {
      slidesToShow: number;
    };
  };
}


export  interface ProductImage {
  src: string;
  alt?: string;
}

export interface ProductReview {
  rating: number;
  comment?: string;
  author?: string;
  date?: string;
}

export interface Product {
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
export interface ProductCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  onShare?: (product: Product) => void;
  currency?: string;
  showThumbnails?: boolean;
  showControls?: boolean;
  thumbnailPosition?: "left" | "right" | "bottom";
}
export 
interface StoryContent {
  id: string | number;
  type: "image" | "video";
  src: string;
  duration?: number;
  thumbnail?: string;
  caption?: string;
  audio?: boolean;
}

export interface StoryCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  stories: StoryContent[];
  autoPlay?: boolean;
  defaultDuration?: number;
  showProgress?: boolean;
  showControls?: boolean;
  showCaption?: boolean;
  onComplete?: () => void;
  onStoryChange?: (index: number) => void;
}
export interface ThumbnailCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: Array<{
    src: string;
    alt?: string;
    thumbnail?: string;
  }>;
  thumbnailPosition?: "left" | "right" | "top" | "bottom";
  thumbnailSize?: number;
  thumbnailGap?: number;
  visibleThumbnails?: number;
  showArrows?: boolean;
  showZoom?: boolean;
  zoomScale?: number;
  onImageChange?: (index: number) => void;
}
export 
interface TimelineEvent {
  id: string | number;
  date: string | Date;
  title: string;
  description?: string;
  image?: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface TimelineCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  events: TimelineEvent[];
  visibleEvents?: number;
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showProgress?: boolean;
  orientation?: "horizontal" | "vertical";
  animation?: "slide" | "fade";
  transitionDuration?: number;
  onEventChange?: (index: number) => void;
}
export interface VerticalCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: React.ReactNode[];
  height?: number | string;
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  pauseOnHover?: boolean;
  loop?: boolean;
  animation?: "slide" | "fade";
  transitionDuration?: number;
  slideSpacing?: number;
  onSlideChange?: (index: number) => void;
}



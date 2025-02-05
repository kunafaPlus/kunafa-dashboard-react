'use client';

import CustomCard from '../../panel/components/CustomCard';
import { BasicCarousel } from '../components/BasicCarousel';
import { GalleryCarousel } from '../components/GalleryCarousel';
import { HeroCarousel } from '../components/HeroCarousel';
import { InfiniteCarousel } from '../components/InfiniteCarousel';
import { ProductCarousel } from '../components/ProductCarousel';


export default function CarouselExample() {
  // Basic slides as React nodes
  const basicSlides = [
    <div key="1" className="relative w-full h-64">
      <img src="/images/slide1.jpg" alt="Slide 1"  className="object-cover" />
      <div className="absolute bottom-4 left-4 text-white text-xl font-bold">Slide 1</div>
    </div>,
    <div key="2" className="relative w-full h-64">
      <img src="/images/slide2.jpg" alt="Slide 2"  className="object-cover" />
      <div className="absolute bottom-4 left-4 text-white text-xl font-bold">Slide 2</div>
    </div>,
    <div key="3" className="relative w-full h-64">
      <img src="/images/slide3.jpg" alt="Slide 3"  className="object-cover" />
      <div className="absolute bottom-4 left-4 text-white text-xl font-bold">Slide 3</div>
    </div>
  ];

  // Hero slides with proper interface
  const heroSlides = [
    {
      image: '/images/hero1.jpg',
      title: 'Welcome to Our Store',
      description: 'Discover amazing products at great prices',
      overlay: true,
      overlayOpacity: 0.5,
      textColor: 'white',
      textAlignment: 'center' as const
    },
    {
      image: '/images/hero2.jpg',
      title: 'Summer Collection',
      description: 'Check out our latest summer collection',
      overlay: true,
      overlayOpacity: 0.5,
      textColor: 'white',
      textAlignment: 'center' as const
    },
    {
      image: '/images/hero3.jpg',
      title: 'Special Offers',
      description: 'Limited time deals on selected items',
      overlay: true,
      overlayOpacity: 0.5,
      textColor: 'white',
      textAlignment: 'center' as const
    }
  ];

  // Products with proper interface
  const products = [
    {
      id: '1',
      name: 'Product 1',
      price: 99.99,
      images: [{ src: '/images/product1.jpg', alt: 'Product 1' }],
      description: 'Amazing product description',
      rating: 4.5,
      reviews: [{ rating: 4.5, comment: 'Great product', author: 'John Doe' }]
    },
    {
      id: '2',
      name: 'Product 2',
      price: 149.99,
      images: [{ src: '/images/product2.jpg', alt: 'Product 2' }],
      description: 'Another great product',
      rating: 4.8,
      reviews: [{ rating: 4.8, comment: 'Excellent quality', author: 'Jane Smith' }]
    },
    {
      id: '3',
      name: 'Product 3',
      price: 199.99,
      images: [{ src: '/images/product3.jpg', alt: 'Product 3' }],
      description: 'Premium product',
      rating: 5,
      reviews: [{ rating: 5, comment: 'Perfect!', author: 'Mike Johnson' }]
    }
  ];

  // Gallery images with proper interface
  const galleryImages = [
    {
      id: '1',
      src: '/images/gallery1.jpg',
      alt: 'Gallery 1',
      title: 'Image 1',
      description: 'Beautiful landscape photo',
      tags: ['nature', 'landscape'],
      date: new Date(),
      metadata: {
        location: 'Mountain View',
        camera: 'Canon EOS R5'
      }
    },
    {
      id: '2',
      src: '/images/gallery2.jpg',
      alt: 'Gallery 2',
      title: 'Image 2',
      description: 'City skyline at night',
      tags: ['city', 'night', 'architecture'],
      date: new Date(),
      metadata: {
        location: 'Downtown',
        camera: 'Sony A7III'
      }
    },
    {
      id: '3',
      src: '/images/gallery3.jpg',
      alt: 'Gallery 3',
      title: 'Image 3',
      description: 'Sunset at the beach',
      tags: ['beach', 'sunset', 'nature'],
      date: new Date(),
      metadata: {
        location: 'Coastal Bay',
        camera: 'Nikon Z6'
      }
    }
  ];

  return (
    <div className="space-y-8">
      {/* Basic Carousel */}
      <CustomCard>
        <h2 className="text-lg font-semibold mb-4">Basic Carousel</h2>
        <BasicCarousel
          slides={basicSlides}
          autoPlay
          interval={5000}
          showIndicators
          showArrows
        />
      </CustomCard>

      {/* Hero Carousel */}
      <CustomCard>
        <h2 className="text-lg font-semibold mb-4">Hero Carousel</h2>
        <HeroCarousel
          slides={heroSlides}
          autoPlay
          interval={6000}
          showIndicators
          showArrows
          height={500}
        />
      </CustomCard>

      {/* Product Carousel */}
      <CustomCard>
        <h2 className="text-lg font-semibold mb-4">Product Carousel</h2>
        <ProductCarousel
          product={products[0]}
          showControls
          showThumbnails
          currency="$"
          onAddToCart={(product) => console.log('Add to cart:', product)}
          onToggleWishlist={(product) => console.log('Toggle wishlist:', product)}
          onShare={(product) => console.log('Share:', product)}
        />
      </CustomCard>

      {/* Gallery Carousel */}
      <CustomCard>
        <h2 className="text-lg font-semibold mb-4">Gallery Carousel</h2>
        <GalleryCarousel
          images={galleryImages}
          showThumbnails
          showControls
          showInfo
          enableZoom
          enableRotate
          enableDownload
          thumbnailSize={80}
          gridCols={4}
          className="w-full"
          onImageChange={(index) => console.log('Image changed:', index)}
        />
      </CustomCard>

      {/* Infinite Carousel */}
      <CustomCard>
        <h2 className="text-lg font-semibold mb-4">Infinite Carousel</h2>
        <InfiniteCarousel
          slides={basicSlides}
          speed={5000}
          direction="left"
          pauseOnHover
        />
      </CustomCard>
    </div>
  );
}

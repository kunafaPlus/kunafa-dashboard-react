import { useState } from "react";
import { GalleryImage } from "../GalleryCarousel";

export const useGalleryCarousel = (images: GalleryImage[], initialIndex: number, onImageChange?: (index: number) => void) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? images.length - 1 : prev - 1;
      onImageChange?.(newIndex);
      return newIndex;
    });
    resetZoom();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev === images.length - 1 ? 0 : prev + 1;
      onImageChange?.(newIndex);
      return newIndex;
    });
    resetZoom();
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    onImageChange?.(index);
    resetZoom();
  };

  const resetZoom = () => {
    setIsZoomed(false);
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setIsZoomed(false);
      }
      return newZoom;
    });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return {
    currentIndex,
    isZoomed,
    zoomLevel,
    rotation,
    position,
    handlePrevious,
    handleNext,
    handleThumbnailClick,
    resetZoom,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    setPosition,
    setIsZoomed
  };
};
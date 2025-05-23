
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoCard from './VideoCard';
import { Category } from '@/lib/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

interface VideoCarouselProps {
  category: Category;
}

const VideoCarousel = ({ category }: VideoCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    // Calculate items per screen based on width
    const carouselWidth = carouselRef.current.clientWidth;
    const cardWidth = isMobile ? 160 : 240; // Width of cards on mobile vs desktop
    const visibleItems = Math.floor(carouselWidth / cardWidth);
    const itemsToScroll = Math.max(3, visibleItems - 1); // Scroll by at least 3 items
    
    const scrollAmount = cardWidth * itemsToScroll; 
    const scrollPosition = direction === 'left' 
      ? carouselRef.current.scrollLeft - scrollAmount
      : carouselRef.current.scrollLeft + scrollAmount;
    
    carouselRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  // Check if can scroll indicators
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update scroll indicators
  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    
    setCanScrollLeft(carouselRef.current.scrollLeft > 0);
    setCanScrollRight(
      carouselRef.current.scrollLeft < 
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth
    );
  };

  // Add scroll event listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    carousel.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    
    // Initialize scroll indicators
    updateScrollButtons();
    
    return () => {
      carousel.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  return (
    <div className="relative group py-4">
      <h2 className="text-lg md:text-xl font-medium mb-2 px-4 md:px-6">{category.name}</h2>
      
      <div className="relative overflow-hidden">
        {/* Left scroll button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/50 rounded-full transition-opacity ${canScrollLeft ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 cursor-default'}`}
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        {/* Carousel - Adjusted gap to match image carousel */}
        <div 
          ref={carouselRef} 
          className="carousel flex px-4 md:px-6 gap-1 py-2 scroll-smooth"
          onScroll={updateScrollButtons}
        >
          {category.videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        
        {/* Right scroll button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/50 rounded-full transition-opacity ${canScrollRight ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 cursor-default'}`}
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCarousel;

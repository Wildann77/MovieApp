// MovieSlider.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import MediaCard from "../media-card";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MovieSlider({ movies }) {

  // Don't render if no movies
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="relative -mt-8">
      {/* Seamless Background Transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-muted/10"></div>
      
      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Trending Now
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Discover the most popular movies right now
            </p>
          </motion.div>
        </div>
        
        {/* Swiper Container */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView="auto"
            breakpoints={{
              320: { 
                slidesPerView: "auto", 
                spaceBetween: 12 
              },
              480: { 
                slidesPerView: "auto", 
                spaceBetween: 16 
              },
              640: { 
                slidesPerView: "auto", 
                spaceBetween: 18 
              },
              768: { 
                slidesPerView: "auto", 
                spaceBetween: 20 
              },
              1024: { 
                slidesPerView: "auto", 
                spaceBetween: 24 
              },
              1280: { 
                slidesPerView: "auto", 
                spaceBetween: 24 
              }
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: false,
            }}
            loop={movies.length > 4}
            loopAdditionalSlides={movies.length > 4 ? 2 : 0}
            loopedSlides={movies.length > 4 ? 2 : 0}
            speed={600}
            grabCursor={true}
            centeredSlides={false}
            allowTouchMove={true}
            freeMode={{
              enabled: true,
              momentum: true,
              momentumBounce: false,
              momentumRatio: 1,
              momentumVelocityRatio: 1,
              sticky: false,
              minimumVelocity: 0.02
            }}
            watchSlidesProgress={true}
            className="movie-swiper"
          >
            {/* Movie slides */}
            {movies.map((movie, index) => (
              <SwiperSlide key={movie._id} className="!w-auto">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 + 0.2 }}
                >
                  <MediaCard
                    posterSrc={movie.poster}
                    title={movie.title}
                    year={movie.year}
                    rating={movie.averageRating || movie.rating || "N/A"}
                    movieId={movie._id}
                    onTrailer={() => movie.trailer ? window.open(movie.trailer, "_blank") : null}
                    onAdd={() => console.log("Tambah cepat:", movie.title)}
                    className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[180px] mx-auto"
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Buttons - Top Right Corner */}
          <div className="absolute top-0 right-0 z-20 flex gap-2">
            <Button
              className="swiper-button-prev-custom h-8 w-8 sm:h-10 sm:w-10 rounded-full border-0 bg-transparent hover:bg-transparent transition-all duration-400 ease-out"
              variant="ghost"
              size="icon"
              aria-label="Previous movies"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300" />
            </Button>
            
            <Button
              className="swiper-button-next-custom h-8 w-8 sm:h-10 sm:w-10 rounded-full border-0 bg-transparent hover:bg-transparent transition-all duration-400 ease-out"
              variant="ghost"
              size="icon"
              aria-label="Next movies"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

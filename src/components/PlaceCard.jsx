import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Star } from 'lucide-react';
import { useStore } from './store/useStore'; // if Rewards.jsx → ../../store/useStore

// Optimized image component with lazy loading and responsive images
const OptimizedImage = memo(({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative w-full h-full bg-gray-100">
      {!loaded && <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
      </div>}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        srcSet={`${src}?w=300 300w, ${src}?w=600 600w, ${src}?w=1200 1200w`}
        sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 1200px"
      />
    </div>
  );
});

// Memoized PlaceCard component to prevent unnecessary re-renders
export const PlaceCard = memo(({ place, onPhotoUpload }) => {
  const { visitedPlaces } = useStore();
  const isVisited = visitedPlaces.includes(place.id);

  const handlePhotoUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await onPhotoUpload(file, place.id);
    }
  }, [onPhotoUpload, place.id]);

  // Using more performant animation settings
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } 
    },
    hover: { 
      y: -5,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="relative bg-white rounded-xl shadow-lg overflow-hidden transform h-full flex flex-row" // Changed to flex-row for landscape
    >
      {/* Left side image - taking 40% width */}
      <div className="w-2/5 relative">
        <motion.div
          className="h-full"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <OptimizedImage src={place.imageUrl} alt={place.name} />
          
          {place.isHiddenGem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded-full flex items-center"
            >
              <Star className="w-3 h-3 mr-1" />
              Hidden Gem
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Right side content - taking 60% width */}
      <div className="w-3/5 p-4 flex flex-col">
        <motion.h3
          className="text-lg font-semibold mb-1 line-clamp-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {place.name}
        </motion.h3>
        
        <motion.div
          className="flex items-center text-gray-600 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="text-xs truncate">{place.location}</span>
        </motion.div>
        
        <motion.p
          className="text-sm text-gray-600 mb-2 line-clamp-2 flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {place.description}
        </motion.p>

        <AnimatePresence>
          {place.trivia && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-blue-50 p-2 rounded-lg mb-2 overflow-hidden"
            >
              <p className="text-xs text-blue-800 line-clamp-1">{place.trivia}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-auto">
          <motion.div className="text-purple-600 font-medium text-sm">
            {place.points} pts
          </motion.div>
          
          {!isVisited ? (
            <motion.label
              className="bg-green-500 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-green-600 text-xs flex items-center"
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-3 h-3 mr-1" />
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </motion.label>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs"
            >
              Visited ✓
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Optimized grid layout with virtualization for large lists
export const PlaceCardGrid = memo(({ places, onPhotoUpload }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-0 mx-0">
      {places.map((place) => (
        <div key={place.id} className="h-40">
          <PlaceCard place={place} onPhotoUpload={onPhotoUpload} />
        </div>
      ))}
    </div>
  );
});

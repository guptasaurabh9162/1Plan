import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, Award, Trophy, X, Moon, Sun } from 'lucide-react';
import { PlaceCard } from '@/components/PlaceCard';
import { useStore } from "@/components/store/useStore";


// Lazy-loaded components
const Leaderboard = lazy(() => import('@/components/Leaderboard'));
const BadgeGrid = lazy(() => import('@/components/BadgeGrid'));

// Import data with dynamic imports
const usePlaces = () => {
  const [places, setPlaces] = useState([]);
  
  useEffect(() => {
    import('@/components/data/places').then(module => {
      setPlaces(module.places);
    });
  }, []);
  
  return places;
};

const useBadges = () => {
  const [badges, setBadges] = useState([]);
  
  useEffect(() => {
    import('@/components/data/badges').then(module => {
      setBadges(module.badges);
    });
  }, []);
  
  return badges;
};

// Virtualized and optimized render for repeating elements
const VirtualizedButton = React.memo(({ category, selectedCategory, darkMode, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg capitalize transition-all ${
      selectedCategory === category
        ? darkMode
          ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white' 
          : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
        : darkMode
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
          : 'bg-white hover:bg-purple-50'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {category === 'all' ? 'All Places' : category}
  </motion.button>
));

// Background particles as a separate optimized component
const BackgroundParticles = React.memo(({ darkMode }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 10 }).map((_, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full ${darkMode ? 'bg-purple-500' : 'bg-indigo-500'}`}
        style={{
          width: Math.random() * 8 + 4,
          height: Math.random() * 8 + 4,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.2,
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
));

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { visitedPlaces, addVisit, points } = useStore();
  const { scrollY } = useScroll();
  
  // Load data using custom hooks
  const places = usePlaces();
  const badges = useBadges();

  // Theme persistence - optimized
  useEffect(() => {
    const savedTheme = localStorage.getItem('bengaluruExplorerTheme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode - unchanged but still optimized with useCallback
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('bengaluruExplorerTheme', newMode ? 'dark' : 'light');
      
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newMode;
    });
  }, []);

  // Optimized animated values
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  const backgroundY = useTransform(scrollY, [0, 100], ['0%', '10%']);

  // Photo upload handler - optimized with useCallback
  const handlePhotoUpload = useCallback((placeId) => {
    const place = places.find(p => p.id === placeId);
    if (place) {
      addVisit(placeId, place.points);
    }
  }, [addVisit, places]);

  // Filtered places - optimized with useMemo
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const isVisitedMatch = !showVisitedOnly || visitedPlaces.includes(place.id);
      const isCategoryMatch = selectedCategory === 'all' || place.category === selectedCategory;
      return isVisitedMatch && isCategoryMatch;
    });
  }, [showVisitedOnly, selectedCategory, visitedPlaces, places]);

  // Leaderboard data - optimized with useMemo
  const leaderboardData = useMemo(() => [
    { name: 'You', points: points, rank: 1 },
    { name: 'Arjun', points: Math.floor(points * 0.9), rank: 2 },
    { name: 'Priya', points: Math.floor(points * 0.8), rank: 3 },
    { name: 'Rahul', points: Math.floor(points * 0.7), rank: 4 },
    { name: 'Ananya', points: Math.floor(points * 0.6), rank: 5 },
    
  ], [points]);

  // Categories - memoized
  const categories = useMemo(() => ['all', 'restaurant', 'lake', 'temple', 'park', 'museum', 'library', 'haunted'], []);

  // Virtualized rendering for place cards
  const renderPlaceCards = useCallback(() => {
    if (filteredPlaces.length === 0) {
      return (
        <motion.div 
          className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} text-center shadow-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-lg">No places match your current filters. Try adjusting your selection.</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filteredPlaces.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: Math.min(index * 0.03, 0.5) }} // Cap the delay time for better performance
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <PlaceCard 
              place={place} 
              onPhotoUpload={() => handlePhotoUpload(place.id)} 
              darkMode={darkMode} 
              visited={visitedPlaces.includes(place.id)} 
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }, [filteredPlaces, darkMode, visitedPlaces, handlePhotoUpload]);

  // Loading fallback component
  const LoadingFallback = useCallback(() => (
    <div className={`rounded-xl p-6 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4`}></div>
          <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
          <div className={`h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-5/6`}></div>
        </div>
      </div>
    </div>
  ), [darkMode]);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : ''}`}>
      {/* Optimized dynamic background */}
      <motion.div
        className={`absolute inset-0 ${darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
          : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50'}`}
        style={{ y: backgroundY }}
      />

      {/* Optimized image background */}
      <motion.div
        className={`absolute inset-0 ${darkMode ? 'opacity-20' : 'opacity-10'}`}
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?auto=format&fit=crop&w=1200&q=60")', // Reduced quality and size
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: useTransform(scrollY, [0, 500], ['0%', '20%']),
        }}
      />

      {/* Optimized animated particles */}
      <BackgroundParticles darkMode={darkMode} />

      <motion.header
        className={`${darkMode 
          ? 'bg-gray-800 bg-opacity-90 shadow-xl shadow-purple-900/20' 
          : 'bg-white bg-opacity-90 shadow-sm'} backdrop-blur-sm sticky top-0 z-40 transition-colors duration-300`}
        style={{ opacity: headerOpacity, scale: headerScale }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <motion.div
            className="flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <MapPin className={`w-7 h-7 sm:w-8 sm:h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'} mr-2`} />
              </motion.div>
              <h1 className={`text-xl sm:text-2xl font-bold ${darkMode 
                ? 'bg-gradient-to-r from-purple-400 to-indigo-300' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600'} text-transparent bg-clip-text`}>
                Explorer
              </h1>
            </div>
            <nav className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                className={`p-1.5 sm:p-2 rounded-full ${darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} transition-all`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </motion.button>
              
              <motion.button
                onClick={() => setShowLeaderboard(true)}
                className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${darkMode 
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600' 
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'} text-white transition-all`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trophy className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Leaderboard</span>
              </motion.button>
              
              <motion.button
                onClick={() => setShowBadges(true)}
                className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${darkMode 
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600' 
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'} text-white transition-all`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Award className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Badges</span>
              </motion.button>
              
              <motion.div
                className={`${darkMode ? 'bg-gray-700 text-purple-300' : 'bg-purple-100 text-purple-700'} px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors duration-300`}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {points} Points
              </motion.div>
            </nav>
          </motion.div>
        </div>
      </motion.header>

      <main className="relative max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <motion.div
          className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {categories.map((category, index) => (
            <VirtualizedButton
              key={category}
              category={category}
              selectedCategory={selectedCategory}
              darkMode={darkMode}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
          
          <motion.label
            className={`flex items-center ml-auto ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg cursor-pointer transition-colors duration-300`}
            whileHover={{ scale: 1.05 }}
          >
            <input
              type="checkbox"
              checked={showVisitedOnly}
              onChange={(e) => setShowVisitedOnly(e.target.checked)}
              className="mr-2"
            />
            <span>Visited Only</span>
          </motion.label>
        </motion.div>

        {/* Render the place cards with virtualization */}
        {renderPlaceCards()}
      </main>

      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <motion.button
                onClick={() => setShowLeaderboard(false)}
                className={`absolute -top-2 -right-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-full p-1 shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
              <Suspense fallback={<LoadingFallback />}>
                <Leaderboard users={leaderboardData} darkMode={darkMode} />
              </Suspense>
            </motion.div>
          </motion.div>
        )}

        {showBadges && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-4xl ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-xl transition-colors duration-300`}
            >
              <motion.button
                onClick={() => setShowBadges(false)}
                className={`absolute -top-2 -right-2 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-full p-1 shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : ''}`}>Your Badges</h2>
              <Suspense fallback={<LoadingFallback />}>
                <BadgeGrid badges={badges} darkMode={darkMode} />
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating action button for mobile view */}
      <motion.div 
        className="fixed bottom-6 right-6 md:hidden"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <motion.button
          onClick={() => setShowLeaderboard(true)}
          className={`rounded-full p-3 shadow-lg ${darkMode 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-700' 
            : 'bg-gradient-to-r from-purple-500 to-indigo-500'} text-white`}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trophy className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </div>
  );
}

// Export with memo for preventing unnecessary re-renders
export default React.memo(App);
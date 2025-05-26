import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Calendar, MapPin, Compass, Zap, Users, 
  Star, CheckCircle, ArrowRight, ExternalLink,
  Mail, Phone, Globe, Facebook, Twitter, Instagram, Linkedin,
  Gift, Leaf, Book, CheckSquare, ChevronDown, ChevronUp, HelpCircle
} from "lucide-react";

// Updated array of stunning travel images with a more beautiful first image
const heroBackgrounds = [
  "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1", // Stunning mountain lake
  "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1", // Incredible beach sunset
  "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1", // Beautiful tropical lagoon
  "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1", // Northern lights
  "https://images.pexels.com/photos/1834399/pexels-photo-1834399.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"  // Mountain vista
];

// Popular destinations with high-quality images
const popularDestinations = [
  {
    name: "Tokyo",
    country: "Japan",
    rating: 4.9,
    image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1",
    description: "Explore the perfect blend of traditional culture and futuristic innovation.",
    price: "$1,200"
  },
  {
    name: "Santorini",
    country: "Greece",
    rating: 4.8,
    image: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1",
    description: "Experience breathtaking sunsets over the Aegean Sea from whitewashed cliffside villas.",
    price: "$1,500"
  },
  {
    name: "Bali",
    country: "Indonesia",
    rating: 4.7,
    image: "https://images.pexels.com/photos/1802255/pexels-photo-1802255.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1",
    description: "Immerse yourself in lush landscapes, vibrant culture, and serene beaches.",
    price: "$900"
  }
];

// Reviews from travelers
const travelerReviews = [
  {
    name: "Aarav Mehta",
    destination: "Manali, India",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
    review: "The trip planning was flawless! Every detail was perfectly arranged.",
    rating: 5
  },
  {
    name: "Sneha Sharma",
    destination: "Jaipur, India",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    review: "Found hidden gems I would have never discovered on my own.",
    rating: 5
  },
  {
    name: "Rohan Iyer",
    destination: "Munnar, India",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
    review: "The personalized itinerary saved us so much time and enhanced our experience.",
    rating: 4
  }
  
];

// FAQ Data
const faqItems = [
  {
    question: "How does TravelPulse help with trip planning?",
    answer: "Our AI-powered platform analyzes your preferences, budget, and travel style to create personalized itineraries with the best flights, accommodations, and activities."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Yes! Our mobile app is available for both iOS and Android, allowing you to access your travel plans anytime, anywhere."
  },
  {
    question: "How do I share my trip with friends?",
    answer: "You can easily share your itinerary via email, messaging apps, or generate a shareable link that others can view."
  },
  {
    question: "What makes TravelPulse different from other travel sites?",
    answer: "We combine AI recommendations with human expertise to create truly personalized experiences, not just generic packages."
  },
  {
    question: "Can I book flights and hotels directly through TravelPulse?",
    answer: "Absolutely! We partner with major providers to offer seamless booking with competitive prices and exclusive deals."
  }
];

// Site links for navigation
const siteLinks = {
  home: "/",
  destinations: "/destinations",
  about: "/about",
  contact: "/contact",
  blog: "/blog",
  calendar: "/calendar",
  rewards: "/rewards",
  ecoTrack: "/eco-track",
  scrapBook: "/scrapbook",
  todo: "/todo",
  faq: "/faq"
};

// Dynamic Background Component
const DynamicBackground = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {heroBackgrounds.map((bg, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentBgIndex ? 1 : 0,
            scale: index === currentBgIndex ? 1 : 1.1
          }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut" 
          }}
        >
          <div className="relative h-full w-full">
            <img 
              src={bg} 
              alt="Travel destination"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} 
        />
      ))}
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-purple-900/40 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 text-left"
      >
        <h3 className="text-lg font-medium text-white">{question}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-purple-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-400" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-5 text-white/80"
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
};

// Newsletter Subscription Component
const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate subscription
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-fuchsia-900/40 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/40 shadow-lg shadow-purple-900/20">
      <h3 className="text-2xl font-bold text-white mb-4">Join Our Travel Community</h3>
      <p className="text-white/90 mb-6">Get exclusive travel deals, tips, and inspiration straight to your inbox</p>
      
      {isSubscribed ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center"
        >
          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-green-100 font-medium">Thank you for subscribing!</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-md shadow-purple-900/30"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
};

// Feature Cards Component
const FeatureCards = () => {
  const buttonCards = [
    { icon: Calendar, text: "When To Meet", link: siteLinks.calendar },
    { 
      icon: MapPin, 
      text: "Where To Meet", 
      link: "https://tripacho.com",
      newTab: true 
    },
    { icon: Gift, text: "Rewards", link: siteLinks.rewards },
    { icon: Leaf, text: "Eco-Track", link: siteLinks.ecoTrack },
    { icon: Book, text: "ScrapBook", link: siteLinks.scrapBook },
    { icon: CheckSquare, text: "ToDo", link: siteLinks.todo }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {buttonCards.map((card, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="group"
        >
          <Link 
            to={card.link} 
            target={card.newTab ? "_blank" : "_self"}
            className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-purple-900/40 to-fuchsia-900/30 backdrop-blur-sm border border-purple-500/40 hover:border-purple-500/60 transition-all h-full shadow-md shadow-black/30"
          >
            <card.icon className="w-10 h-10 text-purple-400 group-hover:text-fuchsia-400 mb-4 transition-colors" />
            <span className="text-white text-base font-medium text-center">{card.text}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

function Hero() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-[#0e0518] to-black">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <DynamicBackground />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/30"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-20 h-full flex flex-col justify-center items-center px-6">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 drop-shadow-lg">
              Discover Your Next Adventure
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto drop-shadow-md"
            >
              Plan unforgettable journeys with our AI-powered travel assistant
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-[#0e0518] via-[#150a29] to-[#0e0518]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500 drop-shadow-lg">
              Travel Planning Made Simple
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              All the tools you need to plan, book, and enjoy your perfect trip
            </p>
          </motion.div>
          
          <FeatureCards />
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 relative overflow-hidden bg-[#0c0416]">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-700 rounded-full filter blur-[120px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-fuchsia-700 rounded-full filter blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500 drop-shadow-lg">
                Popular Destinations
              </h2>
              <p className="text-lg text-white/90 max-w-xl">
                Explore trending locations loved by travelers worldwide
              </p>
            </div>
            <Link to="/destinations">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 md:mt-0 px-6 py-3 rounded-full bg-[#1c0d36]/70 backdrop-blur-xl text-white font-medium border border-purple-500/30 flex items-center gap-2 hover:bg-[#2a1252]/70 transition-all shadow-md shadow-black/20"
              >
                View All Destinations
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularDestinations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 to-fuchsia-900/30 backdrop-blur-lg border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 shadow-lg shadow-black/40"
              >
                <div className="overflow-hidden h-64 relative">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium border border-purple-500/30">
                    From {destination.price}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold text-white">{destination.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-medium">{destination.rating}</span>
                    </div>
                  </div>
                  <p className="text-white/70 mb-4">{destination.country}</p>
                  <p className="text-white/90 mb-6">{destination.description}</p>
                  <Link to={`/destinations/${destination.name.toLowerCase()}`}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold flex items-center justify-center gap-2 hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-md shadow-purple-900/30"
                    >
                      Explore {destination.name}
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative overflow-hidden bg-[#0e0518]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(140,80,220,0.2),transparent_70%)]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500 drop-shadow-lg">
              What Travelers Say
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Hear from globetrotters who have transformed their travel experience with TravelPulse
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {travelerReviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/30 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-lg shadow-black/40"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={review.image} 
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/70 shadow-md shadow-purple-900/50"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{review.name}</h3>
                    <p className="text-purple-300">{review.destination}</p>
                  </div>
                </div>
                <p className="text-white/90 mb-6 italic">"{review.review}"</p>
                <StarRating rating={review.rating} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#0c0416]">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500 drop-shadow-lg">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Find answers to common questions about our travel planning services
            </p>
          </motion.div>
          
          <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/30 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/30 shadow-lg shadow-black/40">
            {faqItems.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
            
            <div className="mt-8 text-center">
              <Link to="/faq">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold flex items-center justify-center gap-2 mx-auto hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-md shadow-purple-900/30"
                >
                  View All FAQs
                  <HelpCircle className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#0c0416]">
        <div className="container mx-auto px-6 max-w-4xl">
          <NewsletterSubscription />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden bg-[#0e0518]">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(220,40,140,0.3),transparent_40%)]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-purple-900/50 to-fuchsia-900/40 backdrop-blur-xl p-12 rounded-3xl border border-purple-500/40 max-w-5xl mx-auto text-center shadow-xl shadow-black/40"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500 drop-shadow-lg">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers creating unforgettable experiences with our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-900/40 hover:shadow-xl hover:shadow-fuchsia-900/50 transition-all"
                >
                  Start Planning Now
                  <CheckCircle className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/destinations">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-[#1c0d36]/70 backdrop-blur-xl text-white font-bold text-lg border border-purple-500/30 flex items-center justify-center gap-2 hover:bg-[#2a1252]/70 transition-all shadow-md shadow-black/20"
                >
                  Explore Destinations
                  <Compass className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 border-t border-purple-900/40 bg-[#080212]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
                1PLAN
              </h3>
              <p className="text-white/80 mb-6">
                Making travel planning effortless and enjoyable with cutting-edge technology and personalized service.
              </p>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-purple-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-purple-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-purple-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-purple-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to={siteLinks.home} className="text-white/70 hover:text-purple-400 transition-colors">Home</Link></li>
                <li><Link to={siteLinks.destinations} className="text-white/70 hover:text-purple-400 transition-colors">Destinations</Link></li>
                <li><Link to={siteLinks.about} className="text-white/70 hover:text-purple-400 transition-colors">About Us</Link></li>
                <li><Link to={siteLinks.blog} className="text-white/70 hover:text-purple-400 transition-colors">Travel Blog</Link></li>
                <li><Link to={siteLinks.contact} className="text-white/70 hover:text-purple-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
              <ul className="space-y-3">
                <li><Link to={siteLinks.faq} className="text-white/70 hover:text-purple-400 transition-colors">FAQs</Link></li>
                <li><a href="mailto:support@travelpulse.com" className="text-white/70 hover:text-purple-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/70 hover:text-purple-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-purple-400 mt-0.5" />
                  <a href="mailto:hello@travelpulse.com" className="text-white/80 hover:text-purple-400 transition-colors">hello@1Plan.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-purple-400 mt-0.5" />
                  <a href="tel:+15551234567" className="text-white/80 hover:text-purple-400 transition-colors">+91 7231951977</a>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-purple-400 mt-0.5" />
                  <a href="https://1Plans.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-purple-400 transition-colors">www.1Plan.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-purple-900/40 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} 1PLAN. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/50 hover:text-purple-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/50 hover:text-purple-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-white/50 hover:text-purple-400 text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Hero;
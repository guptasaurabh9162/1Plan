import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { Parallax } from "react-parallax";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Gift, Leaf, Book, CheckSquare, Check, Crown, X } from "lucide-react";

// Memoize static data
const siteLinks = {
  calendar: "/my-calendar",
  whereToMeet: "/plan-a-trip",
  rewards: "/my-rewards",
  ecoTrack: "/eco-track",
  scrapBook: "/scrap-book",
  todo: "/todo",
  destinations: "/plan-a-trip",
  about: "/scrap-book",
  contact: "/todo"
};

const buttonCards = [
  { icon: Calendar, text: "When To Meet", link: siteLinks.calendar },
  { 
    icon: MapPin, 
    text: "Where To Meet", 
    link: "https://trip-planner-by-satendra.vercel.app/my-trips/1745176904296",
    newTab: true 
  },
  { icon: Gift, text: "Rewards", link: siteLinks.rewards },
  { icon: Leaf, text: "Eco-Track", link: siteLinks.ecoTrack },
  { icon: Book, text: "ScrapBook", link: siteLinks.scrapBook },
  { icon: CheckSquare, text: "ToDo", link: siteLinks.todo }
];

const faqItems = [
  { q: "Where to go?", a: "Find the best destinations tailored to your interests and preferences." },
  { q: "When to go?", a: "Our platform provides insights on the best times to visit popular locations." },
  { q: "Eco Track", a: "Learn more about sustainable travel practices and eco-friendly destinations." },
  { q: "How to plan a trip?", a: "Use our AI-powered trip planner to customize your travel experience effortlessly." },
  { q: "What rewards can I earn?", a: "Earn exciting rewards by engaging with the platform and sharing your experiences." },
  { q: "Is my data secure?", a: "We use industry-leading encryption to ensure your travel plans and personal information stay private." }
];

const features = [
  "Advanced AI-powered trip planning",
  "Direct flight and hotel bookings",
  "Exclusive deals and discounts",
  "Priority customer support",
  "Ad-free experience",
  "Offline access to travel guides"
];

const Hero = () => {
  const [email, setEmail] = useState("");
  const [showSubscribeAlert, setShowSubscribeAlert] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const featuresRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = useCallback((e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setShowSubscribeAlert(true);
      const timer = setTimeout(() => {
        setShowSubscribeAlert(false);
        setEmail("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [email]);

  const scrollToFeatures = useCallback(() => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const BackgroundElements = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 z-0"
    >
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-500 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>
  );

  const ProModal = () => (
    <AnimatePresence>
      {showProModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-purple-950/90 to-black/90 p-8 rounded-3xl max-w-2xl w-full relative border border-purple-500/20"
          >
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Upgrade to 1Plan Pro</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              <p className="text-lg text-white/80">
                Unlock premium features and take your travel planning to the next level:
              </p>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl text-black font-bold text-lg shadow-lg"
              >
                Upgrade Now - $9.99/month
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-white/10 rounded-xl text-white font-bold text-lg border border-white/20"
              >
                Annual Plan - Save 20%
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="w-full min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
        {/* Fixed GO PRO Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowProModal(true)}
          className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full text-black font-bold shadow-lg shadow-yellow-500/30 border border-yellow-500/20 flex items-center gap-2"
        >
          <Crown className="w-5 h-5" />
          GO PRO
        </motion.button>

        <ProModal />

        <Parallax
          blur={0}
          bgImage="https://images.unsplash.com/photo-1602083831853-b3d97ad8c2b3"
          strength={400}
          className="w-full"
        >
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={containerVariants}
            className="w-full min-h-screen backdrop-blur-sm"
          >
            {/* Main Content Container */}
            <div className="flex flex-col items-center justify-center w-full">
              {/* Main Heading Section */}
              <motion.div variants={itemVariants} className="heading text-center w-full py-32 px-4 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
                <motion.h1 
                  className="text-5xl md:text-8xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500"
                  variants={itemVariants}
                >
                  Travel With Purpose, Vibes and Ease
                </motion.h1>
                <motion.h2 
                  className="text-2xl md:text-4xl font-bold text-white/90 mb-8"
                  variants={itemVariants}
                >
                  Tailored Itineraries for Every Explorer
                </motion.h2>
                <motion.p
                  className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto"
                  variants={itemVariants}
                >
                  Your trusted trip planner and adventure guide sparking thrilling journeys with personalized travel plans.
                </motion.p>

                <BackgroundElements />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full py-12 bg-black/50"
              >
                <Link to={siteLinks.whereToMeet}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg shadow-lg shadow-fuchsia-500/30 border border-fuchsia-500/20"
                  >
                    Start Planning
                  </motion.button>
                </Link>
                <Link to={siteLinks.ecoTrack}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-full bg-white/5 backdrop-blur-xl text-white font-bold text-lg border border-white/20 hover:bg-white/10 transition-colors shadow-lg"
                  >
                    Explore Destinations
                  </motion.button>
                </Link>
              </motion.div>

              {/* Feature Cards */}
              <motion.div
                ref={featuresRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4 py-16 bg-gradient-to-b from-black via-purple-950/20 to-black"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "100px" }}
              >
                {buttonCards.map((card, index) => (
                  <Link key={index} to={card.link} className="w-full">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group bg-gradient-to-br from-purple-950/30 to-black/30 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20 h-full hover:border-purple-500/50 cursor-pointer relative overflow-hidden"
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="flex justify-center"
                      >
                        <card.icon className="w-10 h-10 text-purple-400 mb-4 group-hover:text-white transition-colors" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-white mb-2 text-center">{card.text}</h3>
                      <p className="text-purple-300 group-hover:text-white/90 transition-colors text-center text-sm">
                        Discover experiences
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="w-full py-16 px-4 bg-gradient-to-b from-black via-purple-950/20 to-black"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 mb-12"
                >
                  Frequently Asked Questions
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {faqItems.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group bg-gradient-to-br from-purple-950/30 to-black/30 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 cursor-pointer relative overflow-hidden"
                    >
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                        {faq.q}
                      </h3>
                      <p className="text-purple-300 group-hover:text-white/90 transition-colors">
                        {faq.a}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Newsletter Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full py-16 px-4 bg-gradient-to-b from-black via-purple-950/20 to-black relative"
              >
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-r from-purple-950/50 to-black/50 rounded-xl p-8 backdrop-blur-xl border border-purple-500/20 shadow-xl relative overflow-hidden">
                    <h3 className="text-3xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 mb-4">
                      Stay Updated
                    </h3>
                    <p className="text-purple-300 text-center mb-6">
                      Subscribe to our newsletter for exclusive travel deals and inspiration
                    </p>
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 px-4 py-3 rounded-lg bg-white/5 backdrop-blur-xl border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-white font-bold shadow-lg shadow-fuchsia-500/20 border border-fuchsia-500/20"
                      >
                        Subscribe
                      </motion.button>
                    </form>
                  </div>
                </div>
                
                <AnimatePresence>
                  {showSubscribeAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
                    >
                      <Check size={20} />
                      <span>Successfully subscribed to our newsletter!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        </Parallax>
      </div>
    </LazyMotion>
  );
};

export default React.memo(Hero);
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Users, Heart, MessageCircle, Sparkles, Calendar, Check, X } from "lucide-react";
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Cartoon avatar images
const AVATAR_IMAGES = [
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Pumpkin",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Max",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Daisy",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Charlie",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Bella",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cooper"
];

function MatchWithFriends({ onBackClick }) {
  const [friends, setFriends] = useState([]);
  const [matches, setMatches] = useState([]);
  const [events, setEvents] = useState(JSON.parse(localStorage.getItem("events") || "{}"));
  const [userId] = useState(localStorage.getItem("userId") || Math.random().toString(36).substring(7));
  const [newFriendName, setNewFriendName] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    // Initialize with cartoon avatars instead of real photos
    const initialFriends = [
      {
        name: "Akhila",
        photo: AVATAR_IMAGES[0],
        freeDates: generateRandomFreeDates(),
        id: "friend-1",
        emoji: "🎨"
      },
      {
        name: "Saurabh",
        photo: AVATAR_IMAGES[1],
        freeDates: generateRandomFreeDates(),
        id: "friend-2",
        emoji: "🎮"
      },
      {
        name: "Deeps",
        photo: AVATAR_IMAGES[2],
        freeDates: generateRandomFreeDates(),
        id: "friend-3",
        emoji: "📚"
      },
      {
        name: "Aman",
        photo: AVATAR_IMAGES[3],
        freeDates: generateRandomFreeDates(),
        id: "friend-4",
        emoji: "🎵"
      }
    ];
    setFriends(initialFriends);
    checkForMatches(initialFriends);

    localStorage.setItem("userId", userId);
    const uniqueUrl = `${window.location.origin}/connect/${userId}`;
    setQrCodeUrl(uniqueUrl);
  }, []);

  const generateRandomFreeDates = () => {
    const freeDates = {};
    const numDates = Math.floor(Math.random() * 5) + 3;
    const generatedDates = new Set();

    while (generatedDates.size < numDates) {
      const date = new Date();
      const randomDays = Math.floor(Math.random() * 30);
      date.setDate(date.getDate() + randomDays);
      const dateString = date.toISOString().split("T")[0];
      generatedDates.add(dateString);
    }

    generatedDates.forEach(dateString => {
      freeDates[dateString] = new Date(dateString).toLocaleDateString();
    });
    return freeDates;
  };

  const checkForMatches = (friendsList) => {
    const userFreeDates = getUserFreeDates();
    const foundMatches = friendsList.map(friend => {
      const matchedDates = Object.keys(friend.freeDates).filter(date => userFreeDates.includes(date));
      return matchedDates.length > 0 ? { 
        name: friend.name, 
        dates: matchedDates, 
        photo: friend.photo,
        id: friend.id,
        emoji: friend.emoji
      } : null;
    }).filter(Boolean);
    setMatches(foundMatches);
  };

  const getUserFreeDates = () => {
    const freeDates = [];
    const today = new Date();
    const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      const dateString = date.toISOString().split("T")[0];
      if (!events[dateString]) freeDates.push(dateString);
    }
    return freeDates;
  };

  const addFriend = () => {
    if (!newFriendName.trim()) {
      toast.error("Please enter a friend's name.");
      return;
    }

    const interests = ["🎨", "🎮", "📚", "🎵", "🎬", "⚽"];
    const randomInterest = interests[Math.floor(Math.random() * interests.length)];
    const randomAvatarIndex = Math.floor(Math.random() * AVATAR_IMAGES.length);

    const newFriend = {
      name: newFriendName,
      photo: AVATAR_IMAGES[randomAvatarIndex],
      freeDates: generateRandomFreeDates(),
      id: `friend-${Date.now()}`,
      emoji: randomInterest
    };

    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    checkForMatches(updatedFriends);
    
    toast.custom((t) => (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-purple-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3"
      >
        <Sparkles className="w-5 h-5" />
        <span>New friend added! {randomInterest}</span>
      </motion.div>
    ));
    
    setNewFriendName("");
  };

  const handleDateConfirmation = (match, date) => {
    setSelectedMatch(match);
    setSelectedDate(date);
    setShowConfirmModal(true);
  };

  const confirmMeetup = () => {
    toast.custom((t) => (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3"
      >
        <Check className="w-5 h-5" />
        <span>{`${selectedMatch.name} has been notified about the meetup on ${new Date(selectedDate).toLocaleDateString()}!`}</span>
      </motion.div>
    ));
    setShowConfirmModal(false);
  };

  // Custom calendar tile styling for friend schedules
  const tileClassName = ({ date, view }) => {
    if (view !== 'month' || !selectedFriend) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    return selectedFriend.freeDates[dateStr] ? 
      'friend-available-date bg-purple-500 text-white rounded-lg hover:bg-purple-400' : '';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 md:p-8 relative overflow-hidden"
    >
      <Toaster position="top-right" />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-purple-300 mb-8 bg-purple-900/30 px-4 py-2 rounded-lg backdrop-blur-sm"
          onClick={onBackClick}
        >
          <ArrowLeft size={20} />
          Back to Calendar
        </motion.button>

        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
        >
          Match with Friends
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-purple-900/30 p-6 md:p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 shadow-lg"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-400" />
              Add a Friend
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                placeholder="Enter friend's name"
                className="flex-1 px-4 py-2 rounded-lg bg-purple-800/50 border border-purple-500/30 focus:outline-none focus:border-purple-400 placeholder-purple-300/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addFriend}
                className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Add Friend
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-purple-900/30 p-6 md:p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 shadow-lg"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-purple-400" />
              Share Your Profile
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-3 rounded-lg shadow-lg"
              >
                {/* Using QR code via image URL since QRCodeSVG might not be imported */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeUrl)}`}
                  alt="QR Code"
                  className="h-32 w-32 md:h-40 md:w-40"
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-purple-300 mb-2">Your unique ID:</p>
                <motion.p
                  whileHover={{ scale: 1.02 }}
                  className="font-mono bg-purple-800/50 px-4 py-2 rounded select-all border border-purple-500/30 truncate"
                >
                  {userId}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {friends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-purple-900/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-purple-500/20 backdrop-blur-sm group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative w-20 h-20 mx-auto mb-4"
              >
                <img
                  src={friend.photo}
                  alt={friend.name}
                  className="w-full h-full rounded-full object-cover bg-purple-800/50"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -right-2 -bottom-2 text-2xl"
                >
                  {friend.emoji}
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold text-center text-purple-200 group-hover:text-white transition-colors mb-4">
                {friend.name}
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedFriend(friend);
                  setShowCalendar(true);
                }}
                className="w-full bg-purple-600/50 hover:bg-purple-500/50 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                View Availability
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-purple-300 flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
              Your Matches
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-purple-900/30 rounded-xl p-6 shadow-lg border border-purple-500/20 backdrop-blur-sm"
                >
                  <motion.div className="relative w-20 h-20 mx-auto mb-4">
                    <img
                      src={match.photo}
                      alt={match.name}
                      className="w-full h-full rounded-full object-cover bg-purple-800/50"
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute -right-2 -bottom-2 text-2xl"
                    >
                      {match.emoji}
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-center mb-4 text-purple-200">
                    {match.name}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-center text-purple-300 mb-2">
                      You're both free on:
                    </p>
                    {match.dates.map(date => (
                      <motion.button
                        key={date}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDateConfirmation(match, date)}
                        className="w-full bg-purple-800/50 px-4 py-2 rounded-lg text-center border border-purple-500/30 hover:bg-purple-700/50 transition-colors"
                      >
                        {new Date(date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showCalendar && selectedFriend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCalendar(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-purple-900/90 p-6 md:p-8 rounded-xl border border-purple-500/20 max-w-md w-full mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedFriend.photo} 
                    alt={selectedFriend.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <h3 className="text-xl font-semibold text-purple-200">
                    {selectedFriend.name}'s Schedule
                  </h3>
                </div>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="text-purple-300 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Custom styled mini calendar */}
              <div className="rounded-lg overflow-hidden shadow-lg border border-purple-500/30 bg-gray-800">
                <div className="friend-calendar-wrapper">
                  <ReactCalendar
                    value={null}
                    tileClassName={tileClassName}
                    className="friend-calendar border-0"
                  />
                </div>
                <div className="p-3 bg-gray-800 border-t border-purple-500/30">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>Available</span>
                  </div>
                </div>
              </div>
              
              <style jsx="true">{`
                .friend-calendar {
                  width: 100%;
                  background: #1F2937;
                  color: white;
                  border: none;
                }
                .friend-calendar .react-calendar__navigation {
                  background: #374151;
                }
                .friend-calendar .react-calendar__tile {
                  padding: 10px;
                  border-radius: 4px;
                  margin: 2px;
                }
                .friend-calendar .react-calendar__month-view__weekdays {
                  text-transform: uppercase;
                  font-weight: bold;
                  color: #A78BFA;
                }
                .friend-calendar .react-calendar__tile--now {
                  background: #4B5563;
                }
                .friend-calendar .react-calendar__month-view__days__day--weekend {
                  color: #F87171;
                }
                .friend-calendar .friend-available-date {
                  background: #8B5CF6;
                  color: white;
                  position: relative;
                }
                .friend-calendar .friend-available-date:hover {
                  background: #7C3AED;
                }
              `}</style>
            </motion.div>
          </motion.div>
        )}

        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-purple-900/90 p-6 md:p-8 rounded-xl border border-purple-500/20 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={selectedMatch?.photo} 
                  alt={selectedMatch?.name} 
                  className="w-12 h-12 rounded-full"
                />
                <h3 className="text-xl font-semibold text-purple-200">
                  Confirm Meetup
                </h3>
              </div>
              <p className="text-purple-100 mb-6">
                Would you like to schedule a meetup with {selectedMatch?.name} on {selectedDate && new Date(selectedDate).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}?
              </p>
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-lg bg-purple-800/50 text-purple-200 hover:bg-purple-700/50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmMeetup}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500"
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default MatchWithFriends;
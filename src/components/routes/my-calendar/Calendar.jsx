import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Share2, Users, Copy, Check, Mic, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast, Toaster } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import EventForm from './EventForm';

function CalendarApp({ onMatchClick }) {
  const [events, setEvents] = useState(JSON.parse(localStorage.getItem('events') || '{}'));
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [freeDates, setFreeDates] = useState({});
  const [showFreeDates, setShowFreeDates] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userId] = useState(localStorage.getItem('userId') || uuidv4());
  const [copied, setCopied] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('events', JSON.stringify(events));
  }, [userId, events]);

  useEffect(() => {
    // Initialize speech recognition on component mount
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          // Restart if we're still supposed to be listening
          recognition.start();
        }
      };

      setRecognition(recognition);
    } else {
      toast.error('Speech recognition is not supported in your browser');
    }

    // Cleanup on unmount
    return () => {
      if (recognition) {
        recognition.onend = null;
        recognition.abort();
      }
    };
  }, []);

  // Start or stop listening when isListening changes
  useEffect(() => {
    if (recognition) {
      if (isListening) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Recognition start error:', error);
        }
      } else {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Recognition stop error:', error);
        }
      }
    }
  }, [isListening, recognition]);

  const handleVoiceCommand = (transcript) => {
    console.log('Processing voice command:', transcript);

    // Handle recurring weekday patterns
    if (transcript.includes('weekday') || transcript.includes('weekdays')) {
      const excludeDates = [];
      const dateRegex = /except (\d+(?:st|nd|rd|th)?)(?:\s+and\s+(\d+(?:st|nd|rd|th)?))?(?:\s+of\s+)?([a-zA-Z]+)?/i;
      const matches = transcript.match(dateRegex);

      if (matches) {
        const month = matches[3] ? new Date(Date.parse(matches[3] + " 1, 2024")).getMonth() : currentMonth;
        const dates = [matches[1], matches[2]].filter(Boolean).map(date => parseInt(date.replace(/(?:st|nd|rd|th)/, '')));
        
        // Mark all weekdays in the current month except excluded dates
        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(currentYear, month, day);
          if (date.getDay() !== 0 && date.getDay() !== 6 && !dates.includes(day)) {
            const dateString = date.toISOString().split('T')[0];
            const updatedEvents = { ...events };
            updatedEvents[dateString] = {
              title: "Office",
              time: "09:00-17:00",
              type: "busy"
            };
            setEvents(updatedEvents);
          }
        }
        toast.success('Updated weekday schedule');
        return;
      }
    }

    // Handle specific date and time patterns
    const timeRegex = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
    const dateTimeMatch = transcript.match(/(on|next|this) (monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:.*?from\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:to|until)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?))*/i);

    if (dateTimeMatch) {
      const dayOfWeek = dateTimeMatch[2].toLowerCase();
      const date = getNextDayOfWeek(dayOfWeek);
      const dateString = date.toISOString().split('T')[0];
      
      let timeSlot = "full-day";
      if (dateTimeMatch[3] && dateTimeMatch[4]) {
        timeSlot = `${formatTime(dateTimeMatch[3])}-${formatTime(dateTimeMatch[4])}`;
      }

      const eventDescription = transcript
        .replace(dateTimeMatch[0], '')
        .replace(/^(i am|i'm|i will be|i'll be|add|schedule|set|put)/i, '')
        .trim();

      const updatedEvents = { ...events };
      updatedEvents[dateString] = {
        title: eventDescription || "Busy",
        time: timeSlot,
        type: timeSlot === "full-day" ? "busy" : "partial"
      };
      
      setEvents(updatedEvents);
      toast.success(`Added event for ${date.toLocaleDateString()}`);
    }
  };

  const formatTime = (timeStr) => {
    const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (!match) return "00:00";

    let hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const period = match[3]?.toLowerCase();

    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getNextDayOfWeek = (dayName) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    const targetDay = days.indexOf(dayName.toLowerCase());
    const todayDay = today.getDay();
    let daysUntilTarget = targetDay - todayDay;
    if (daysUntilTarget <= 0) daysUntilTarget += 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    return targetDate;
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(!isListening);
    
    if (!isListening) {
      toast.success('Listening... Try saying "I have office on all weekdays except 9th and 10th April" or "Meeting on Monday from 2pm to 4pm"');
    } else {
      toast.success('Voice input stopped');
    }
  };

  const createCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendar = [];

    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split('T')[0];
      calendar.push({
        day,
        date,
        dateString,
        event: events[dateString],
      });
    }

    return calendar;
  };

  const handleAddEvent = (day) => {
    setSelectedDate(day.date);
    setShowEventForm(true);
  };

  const handleSaveEvent = (eventData) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const updatedEvents = { ...events };
    updatedEvents[dateString] = eventData;
    setEvents(updatedEvents);
    setShowEventForm(false);
    toast.success('Event saved successfully!');
  };

  const checkFreeDates = () => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const freeDates = {
      fully: [],
      partially: []
    };

    Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(currentYear, currentMonth, i + 1);
      const dateString = date.toISOString().split('T')[0];
      const event = events[dateString];

      if (!event) {
        freeDates.fully.push(dateString);
      } else if (event.type === 'partial') {
        freeDates.partially.push({
          date: dateString,
          freeTime: getComplementaryTime(event.time)
        });
      }
    });

    setFreeDates(freeDates);
    setShowFreeDates(true);
    toast.success('Free dates calculated!');
  };

  const getComplementaryTime = (busyTime) => {
    const [start, end] = busyTime.split('-');
    const freeTimes = [];
    
    if (start > "09:00") {
      freeTimes.push("09:00-" + start);
    }
    if (end < "17:00") {
      freeTimes.push(end + "-17:00");
    }
    
    return freeTimes;
  };

  const handleShareSchedule = () => {
    setShowShareModal(true);
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    toast.success('User ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 md:p-8">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full w-full max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            Smart Calendar
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleVoiceInput}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isListening
                ? 'bg-red-500 text-white'
                : 'bg-purple-600 hover:bg-purple-500'
            }`}
          >
            <Mic size={20} />
            {isListening ? 'Listening...' : 'Voice Input'}
          </motion.button>
        </div>

        <motion.div
          className="bg-gray-800/80 backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20"
          style={{
            perspective: '1000px',
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-purple-600 px-3 md:px-4 py-2 rounded-lg"
              onClick={() => {
                if (currentMonth > 0) {
                  setCurrentMonth(currentMonth - 1);
                } else {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                }
              }}
            >
              <ChevronLeft size={20} />
              <span className="hidden md:inline">Previous</span>
            </motion.button>
            <h2 className="text-xl md:text-2xl font-semibold">
              {new Date(currentYear, currentMonth).toLocaleString('default', {
                month: 'long',
              })} {currentYear}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-purple-600 px-3 md:px-4 py-2 rounded-lg"
              onClick={() => {
                if (currentMonth < 11) {
                  setCurrentMonth(currentMonth + 1);
                } else {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                }
              }}
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight size={20} />
            </motion.button>
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-purple-400">
                {day}
              </div>
            ))}
          </div>

          <motion.div
            className="grid grid-cols-7 gap-2 md:gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.03,
                },
              },
            }}
          >
            {createCalendar().map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05, zIndex: 20 }}
                className={`relative flex flex-col items-center justify-center min-h-[60px] md:min-h-[80px] rounded-lg ${
                  item
                    ? item.event
                      ? item.event.type === 'partial'
                        ? 'bg-gradient-to-br from-yellow-700 to-yellow-900 hover:from-yellow-600 hover:to-yellow-800'
                        : 'bg-gradient-to-br from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800'
                      : 'bg-gray-700/70 hover:bg-gray-600/70 backdrop-blur-sm'
                    : 'bg-transparent'
                } cursor-pointer transition-all duration-200 border border-gray-700/50 shadow-lg`}
                onClick={() => item && handleAddEvent(item)}
              >
                {item && (
                  <>
                    <span className="text-lg font-medium mb-1">{item.day}</span>
                    {item.event && (
                      <div className="text-sm bg-black/30 p-1 rounded w-full text-center backdrop-blur-sm">
                        <div className="font-medium truncate px-1">{item.event.title}</div>
                        <div className="text-xs mt-1 flex items-center justify-center gap-1">
                          <Clock size={10} />
                          <span className="truncate">{item.event.time}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 md:px-6 py-3 rounded-lg shadow-lg"
            onClick={checkFreeDates}
          >
            <Calendar size={20} />
            Find Free Time
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 md:px-6 py-3 rounded-lg shadow-lg"
            onClick={handleShareSchedule}
          >
            <Share2 size={20} />
            Share Schedule
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 md:px-6 py-3 rounded-lg shadow-lg"
            onClick={onMatchClick}
          >
            <Users size={20} />
            Match with Friends
          </motion.button>
        </div>

        <AnimatePresence>
          {showEventForm && selectedDate && (
            <EventForm
              date={selectedDate}
              onSave={handleSaveEvent}
              onClose={() => setShowEventForm(false)}
              initialEvent={events[selectedDate.toISOString().split('T')[0]] || ''}
            />
          )}

          {showFreeDates && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <motion.div
                className="bg-gray-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-green-500/20"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-green-400 text-center flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  Fully Free Dates
                </h3>
                {freeDates.fully?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {freeDates.fully?.map((date, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: { delay: index * 0.05 }
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="text-gray-300 bg-gray-700/70 backdrop-blur-sm p-2 rounded text-center border border-green-500/20 shadow-md"
                      >
                        {new Date(date).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400">No fully free dates available</p>
                )}
              </motion.div>

              <motion.div
                className="bg-gray-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-yellow-500/20"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-yellow-400 text-center flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  Partially Free Dates
                </h3>
                {freeDates.partially?.length > 0 ? (
                  <div className="space-y-3">
                    {freeDates.partially?.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: { delay: index * 0.05 }
                        }}
                        whileHover={{ scale: 1.02 }}
                        className="text-gray-300 bg-gray-700/70 backdrop-blur-sm p-3 rounded border border-yellow-500/20 shadow-md"
                      >
                        <div className="font-medium text-center mb-1">
                          {new Date(item.date).toLocaleDateString(undefined, { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {item.freeTime.map((time, timeIndex) => (
                            <span key={timeIndex} className="text-sm bg-yellow-800/50 px-2 py-1 rounded text-yellow-300 flex items-center gap-1">
                              <Clock size={12} />
                              {time}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400">No partially free dates available</p>
                )}
              </motion.div>
            </motion.div>
          )}

          {showShareModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowShareModal(false)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="bg-gray-800/90 backdrop-blur-lg p-8 rounded-xl max-w-md w-full border border-purple-500/20 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Share Your Schedule
                </h3>
                <div className="flex flex-col items-center gap-6">
                  <div className="bg-white p-3 rounded-lg shadow-lg">
                    <QRCodeSVG
                      value={userId}
                      size={200}
                      level="H"
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-gray-700/70 p-2 rounded-lg w-full border border-gray-600/50">
                    <input
                      type="text"
                      value={userId}
                      readOnly
                      className="bg-transparent flex-1 outline-none px-2 font-mono text-sm"
                    />
                    <button
                      onClick={copyUserId}
                      className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default CalendarApp;
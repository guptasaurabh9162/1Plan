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
    if (window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognition.onerror = () => {
        toast.error('Speech recognition failed');
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      setRecognition(recognition);
    }
  }, [isListening]);

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
    const match = timeStr.match(timeRegex);
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

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      toast.success('Voice input stopped');
    } else {
      recognition.start();
      setIsListening(true);
      toast.success('Listening... Try saying "I have office on all weekdays except 9th and 10th April" or "Meeting on Monday from 2pm to 4pm"');
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
    <div className="h-full bg-gray-900 text-white p-8">
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
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
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
          className="bg-gray-800 rounded-xl p-6 shadow-2xl transform-gpu"
          style={{
            perspective: '1000px',
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg"
              onClick={() => setCurrentMonth((prev) => (prev > 0 ? prev - 1 : 11))}
            >
              <ChevronLeft size={20} />
              Previous
            </motion.button>
            <h2 className="text-2xl font-semibold">
              {new Date(currentYear, currentMonth).toLocaleString('default', {
                month: 'long',
              })} {currentYear}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg"
              onClick={() => setCurrentMonth((prev) => (prev < 11 ? prev + 1 : 0))}
            >
              Next
              <ChevronRight size={20} />
            </motion.button>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-purple-400">
                {day}
              </div>
            ))}
          </div>

          <motion.div
            className="grid grid-cols-7 gap-4"
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
                whileHover={{ scale: 1.05, z: 20 }}
                className={`relative flex flex-col items-center justify-center min-h-[80px] rounded-lg ${
                  item
                    ? item.event
                      ? item.event.type === 'partial'
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-transparent'
                } cursor-pointer transition-colors duration-200`}
                onClick={() => item && handleAddEvent(item)}
              >
                {item && (
                  <>
                    <span className="text-lg mb-2">{item.day}</span>
                    {item.event && (
                      <div className="text-sm bg-opacity-80 p-1 rounded w-full text-center">
                        <div>{item.event.title}</div>
                        <div className="text-xs mt-1 flex items-center justify-center gap-1">
                          <Clock size={12} />
                          {item.event.time}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 px-6 py-3 rounded-lg shadow-lg"
            onClick={checkFreeDates}
          >
            <Calendar size={20} />
            Find Free Time
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg shadow-lg"
            onClick={handleShareSchedule}
          >
            <Share2 size={20} />
            Share Schedule
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 rounded-lg shadow-lg"
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
                className="bg-gray-800 p-6 rounded-xl shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-green-400 text-center">
                  Fully Free Dates
                </h3>
                <ul className="space-y-2">
                  {freeDates.fully?.map((date, index) => (
                    <li
                      key={index}
                      className="text-gray-300 bg-gray-700 p-2 rounded text-center"
                    >
                      {new Date(date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="bg-gray-800 p-6 rounded-xl shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-yellow-400 text-center">
                  Partially Free Dates
                </h3>
                <ul className="space-y-2">
                  {freeDates.partially?.map((item, index) => (
                    <li
                      key={index}
                      className="text-gray-300 bg-gray-700 p-2 rounded text-center"
                    >
                      <div>{new Date(item.date).toLocaleDateString()}</div>
                      <div className="text-sm text-yellow-300">
                        Free: {item.freeTime.join(', ')}
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}

          {showShareModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4 text-center">Share Your Schedule</h3>
                <div className="flex flex-col items-center gap-4">
                  <QRCodeSVG
                    value={userId}
                    size={200}
                    level="H"
                    className="bg-white p-2 rounded-lg"
                  />
                  <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg w-full">
                    <input
                      type="text"
                      value={userId}
                      readOnly
                      className="bg-transparent flex-1 outline-none"
                    />
                    <button
                      onClick={copyUserId}
                      className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default CalendarApp;
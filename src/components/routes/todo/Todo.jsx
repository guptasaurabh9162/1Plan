import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Calendar, MapPin, Activity, Star, Clock, Tag, Trash2, Edit3, CheckCircle, Search, Plane } from 'lucide-react';
import Confetti from 'react-confetti';

const Wanderlist = () => {
  const [activity, setActivity] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [weeklyMessage, setWeeklyMessage] = useState('');
  const [lastWeekCheck, setLastWeekCheck] = useState(null);

  // Check weekly completion status
  useEffect(() => {
    const checkWeeklyCompletion = () => {
      const now = new Date();
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);

      // Only check once per week
      if (lastWeekCheck && isWithinInterval(new Date(lastWeekCheck), { start: weekStart, end: weekEnd })) {
        return;
      }

      const weeklyTasks = todos.filter(todo => {
        const taskDate = new Date(todo.startDate);
        return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
      });

      if (weeklyTasks.length > 0) {
        const allCompleted = weeklyTasks.every(task => {
          const taskDate = new Date(task.startDate);
          return task.completed && taskDate >= now;
        });

        const overdueTasks = weeklyTasks.filter(task => {
          const taskDate = new Date(task.startDate);
          return !task.completed && taskDate < now;
        });

        if (allCompleted) {
          setShowConfetti(true);
          setWeeklyMessage("🎉 Incredible work! You've completed all tasks for this week on time. Keep up the amazing momentum!");
          setTimeout(() => {
            setShowConfetti(false);
            setWeeklyMessage('');
          }, 5000);
        } else if (overdueTasks.length > 0) {
          setWeeklyMessage("😔 Some tasks are overdue. Don't worry, next week is a new opportunity!");
          // Play disappointed sound
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2954/2954-preview.mp3');
          audio.volume = 0.3;
          audio.play();
          setTimeout(() => setWeeklyMessage(''), 3000);
        }

        setLastWeekCheck(now.toISOString());
      }
    };

    checkWeeklyCompletion();
  }, [todos, lastWeekCheck]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    const newTodo = {
      activity,
      destination,
      startDate,
      priority,
      category,
      notes,
      id: Date.now(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setActivity('');
    setDestination('');
    setStartDate('');
    setPriority('medium');
    setCategory('');
    setNotes('');
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleEditTodo = (todo) => {
    setActivity(todo.activity);
    setDestination(todo.destination);
    setStartDate(todo.startDate);
    setPriority(todo.priority);
    setCategory(todo.category);
    setNotes(todo.notes);
    handleDeleteTodo(todo.id);
    setShowForm(true);
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && todo.completed) ||
                         (filter === 'active' && !todo.completed);
    return matchesSearch && matchesFilter;
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.02,
      rotateX: 5,
      rotateY: 5,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      {/* Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover opacity-30"
          style={{ filter: 'blur(8px)' }}
        >
          <source src="https://player.vimeo.com/external/368763065.sd.mp4?s=13c170df6567d3e1ee0b9e45b3d55b37b9a851b2&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
        </video>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gray-800/80 rounded-xl shadow-2xl p-8 w-[800px] mx-auto text-center backdrop-blur-lg"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      >
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
        
        {weeklyMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-4 rounded-lg ${
              weeklyMessage.includes('🎉') 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {weeklyMessage}
          </motion.div>
        )}

        <motion.h1 
          className="text-4xl font-bold mb-8 text-purple-400 flex items-center justify-center gap-3"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Activity className="inline-block" />
          Wanderlist
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -10, 0],
              rotate: [0, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Plane className="text-purple-400" />
          </motion.div>
        </motion.h1>

        <div className="mb-6 flex justify-between items-center">
          <div className="relative flex-1 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'active' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showForm ? 'Hide Form' : 'Add New Task'}
        </motion.button>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddTodo}
              className="space-y-4 mb-8 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Activity"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              />

              <motion.button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Task
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                <AnimatePresence>
                  {filteredTodos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <motion.li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          className={`
                            ${snapshot.isDragging ? 'shadow-2xl' : 'shadow-lg'}
                            ${todo.completed ? 'opacity-75' : ''}
                            bg-gray-700/50 rounded-xl p-4 transform transition-all duration-300 backdrop-blur-sm
                          `}
                          style={{
                            ...provided.draggableProps.style,
                            perspective: '1000px'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleToggleComplete(todo.id)}
                                className={`p-2 rounded-full transition-colors ${
                                  todo.completed ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                                }`}
                              >
                                <CheckCircle size={20} />
                              </button>
                              <div className="text-left">
                                <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                                  {todo.activity}
                                </h3>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                                  <span className="flex items-center">
                                    <MapPin size={16} className="mr-1" />
                                    {todo.destination}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar size={16} className="mr-1" />
                                    {format(new Date(todo.startDate), 'MMM dd, yyyy')}
                                  </span>
                                  {todo.category && (
                                    <span className="flex items-center">
                                      <Tag size={16} className="mr-1" />
                                      {todo.category}
                                    </span>
                                  )}
                                  <span className={`
                                    flex items-center px-2 py-1 rounded-full text-xs
                                    ${todo.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                      todo.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-green-500/20 text-green-400'}
                                  `}>
                                    <Star size={12} className="mr-1" />
                                    {todo.priority}
                                  </span>
                                </div>
                                {todo.notes && (
                                  <p className="mt-2 text-sm text-gray-400">{todo.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditTodo(todo)}
                                className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                              >
                                <Edit3 size={20} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteTodo(todo.id)}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={20} />
                              </motion.button>
                            </div>
                          </div>
                        </motion.li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </AnimatePresence>
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        <Link 
          to="/upcoming-event" 
          className="block mt-8 text-purple-400 hover:text-purple-300 text-lg font-semibold transition-colors"
        >
          Go to Upcoming Events
        </Link>
      </motion.div>
    </>
  );
};

export default Wanderlist;
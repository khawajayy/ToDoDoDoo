import { useState, useRef } from 'react';

type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  name: string;
  duration: number; // in minutes
  priority: Priority;
}

interface ScheduledItem {
  id: string;
  type: 'task' | 'break';
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
  task?: Task;
}

const PRIORITY_SCALES = {
  'High': 3,
  'Medium': 2,
  'Low': 1
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [priority, setPriority] = useState<Priority>('Medium');
  
  const [schedule, setSchedule] = useState<ScheduledItem[] | null>(null);
  const [overflowTasks, setOverflowTasks] = useState<Task[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      name: taskName,
      duration,
      priority,
    };

    setTasks([...tasks, newTask]);
    setTaskName('');
    setDuration(30);
    setPriority('Medium');
  };

  const generatePlan = () => {
    // 1. Sort tasks by priority
    const sortedTasks = [...tasks].sort((a, b) => 
      PRIORITY_SCALES[b.priority] - PRIORITY_SCALES[a.priority]
    );

    const generatedSchedule: ScheduledItem[] = [];
    const remainingTasks: Task[] = [];
    
    // Start at 9:00 AM
    let currentMins = 9 * 60; 
    const MAX_MINS = 9 * 60 + 8 * 60; // 9 AM + 8 hours = 5:00 PM (17:00)
    
    let taskCountSinceBreak = 0;

    const formatTime = (totalMins: number) => {
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${formattedH}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    for (const task of sortedTasks) {
      if (currentMins + task.duration > MAX_MINS) {
        remainingTasks.push(task);
        continue;
      }

      const start = currentMins;
      currentMins += task.duration;
      
      generatedSchedule.push({
        id: crypto.randomUUID(),
        type: 'task',
        name: task.name,
        startTime: formatTime(start),
        endTime: formatTime(currentMins),
        duration: task.duration,
        task
      });

      taskCountSinceBreak++;

      // Add a 15-min break after every 2 tasks if we're not exceeding time
      if (taskCountSinceBreak >= 2 && currentMins + 15 <= MAX_MINS) {
        const breakStart = currentMins;
        currentMins += 15;
        generatedSchedule.push({
          id: crypto.randomUUID(),
          type: 'break',
          name: 'Take a short break ☕',
          startTime: formatTime(breakStart),
          endTime: formatTime(currentMins),
          duration: 15
        });
        taskCountSinceBreak = 0;
      }
    }

    // Clean up trailing break if it's the last item
    if (generatedSchedule.length > 0 && generatedSchedule[generatedSchedule.length - 1].type === 'break') {
      generatedSchedule.pop();
    }

    setSchedule(generatedSchedule);
    setOverflowTasks(remainingTasks);
  };

  const clearTasks = () => {
    setTasks([]);
    setSchedule(null);
    setOverflowTasks([]);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Hero Section */}
      <section className="text-center pt-20 pb-16 px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="inline-block px-4 py-1.5 mb-8 text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
          ✨ No login required • Free forever
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
          Stop playing Tetris with your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">to-do list.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
          Dump your tasks into <span className="font-bold text-slate-900">ToDoDoDoo</span> and watch them automagically transform into a perfectly timed schedule.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={focusInput}
            className="group px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:translate-y-0 text-xl flex items-center gap-3"
          >
            Automagically Plan My Day 
            <span className="transition-transform group-hover:rotate-12">🚀</span>
          </button>
        </div>
        <p className="mt-8 text-base text-slate-400 italic">
          No accounts. No fuss. Just focus.
        </p>
      </section>

      {/* Main App Container */}
      <div className="flex justify-center px-4 md:px-8">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 flex flex-col min-h-[600px]">
          {/* Header */}
          <header className="px-8 py-6 border-b border-slate-100 bg-white sticky top-0 z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                ToDoDoDoo
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">Smarter daily scheduling</p>
            </div>
            {schedule && (
              <button 
                onClick={() => setSchedule(null)}
                className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-xl"
              >
                ← Back to Tasks
              </button>
            )}
          </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {!schedule ? (
            <>
              {/* Input Section */}
              <section>
                <form onSubmit={addTask} className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Name</label>
                    <input
                      ref={inputRef}
                      type="text"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="What do you need to do?"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-white text-lg placeholder:text-slate-300"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (min)</label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        min={5}
                        step={5}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                      >
                        <option value="High">High 🔴</option>
                        <option value="Medium">Medium 🟡</option>
                        <option value="Low">Low 🟢</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!taskName.trim()}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    Add Task
                  </button>
                </form>
              </section>

              {/* Task List Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Your Tasks ({tasks.length})</h2>
                  {tasks.length > 0 && (
                    <button 
                      onClick={clearTasks}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                {tasks.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <p className="text-lg mb-1">📝</p>
                    <p className="font-medium text-slate-500">No tasks yet</p>
                    <p className="text-sm">Add some tasks to plan your day.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {tasks.map(task => (
                      <li key={task.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] group hover:border-indigo-100 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-800">{task.name}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs font-medium">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{task.duration} min</span>
                            <span className={`px-2 py-0.5 rounded-md ${
                              task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                              task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>{task.priority}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                          className="text-slate-300 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          ) : (
            /* Schedule View */
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-slate-800">Your Daily Plan</h2>
                  <button 
                    onClick={generatePlan}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Regenerate
                  </button>
                </div>

                <div className="relative border-l-2 border-indigo-100 ml-3 pl-6 space-y-6">
                  {schedule.map((item) => (
                    <div key={item.id} className="relative">
                      {/* Timeline Dot */}
                      <span className={`absolute -left-[31px] flex h-4 w-4 rounded-full border-2 border-white ring-2 ring-white ${
                        item.type === 'break' ? 'bg-amber-400' : 'bg-indigo-500'
                      }`}></span>
                      
                      <div className={`p-4 rounded-2xl border ${
                        item.type === 'break' 
                          ? 'bg-amber-50/50 border-amber-100' 
                          : 'bg-white border-slate-100 shadow-sm'
                      }`}>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className={`font-semibold ${item.type === 'break' ? 'text-amber-800' : 'text-slate-800'}`}>
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                                item.type === 'break' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {item.startTime} - {item.endTime}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">{item.duration} min</span>
                            </div>
                          </div>
                          
                          {item.type === 'task' && item.task && (
                            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                              item.task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                              item.task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {item.task.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {overflowTasks.length > 0 && (
                  <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Overflow tasks ({overflowTasks.length})
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">These didn't fit in your 8-hour day.</p>
                    <ul className="space-y-1.5">
                      {overflowTasks.map(t => (
                        <li key={t.id} className="text-xs font-medium text-slate-600 flex justify-between bg-white px-3 py-2 rounded-lg border border-slate-100">
                          <span>{t.name}</span>
                          <span className="text-slate-400">{t.duration}m</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </section>
          )}
        </div>
        
        {/* Footer Actions */}
        {!schedule && (
          <div className="p-5 border-t border-slate-100 bg-white">
            <button
              onClick={generatePlan}
              disabled={tasks.length === 0}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Plan My Day
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

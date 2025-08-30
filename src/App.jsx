import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, writeBatch, enableIndexedDbPersistence, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import * as Tone from 'tone';

// --- Pixel Art SVG Icons ---
const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" style={{ imageRendering: 'pixelated' }}>
        <path d="M4 12L9 17L20 6" stroke="#a3e635" strokeWidth="3" strokeLinecap="square" />
    </svg>
);
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" style={{ imageRendering: 'pixelated' }}>
        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
);
const EditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" style={{ imageRendering: 'pixelated' }}>
        <path d="M4 16H16" stroke="currentColor" strokeWidth="2" />
        <path d="M14.5 4.5L12 2L4 10V14H8L16 6L14.5 4.5Z" fill="currentColor" />
    </svg>
);
const DeleteIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" style={{ imageRendering: 'pixelated' }}>
        <rect x="5" y="6" width="10" height="10" fill="currentColor" />
        <rect x="4" y="3" width="12" height="2" fill="currentColor" />
        <rect x="7" y="3" width="2" height="3" fill="currentColor" />
        <rect x="11" y="3" width="2" height="3" fill="currentColor" />
    </svg>
);
const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" style={{ imageRendering: 'pixelated' }}>
        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
);
const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" style={{ imageRendering: 'pixelated' }}>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 4V8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
    </svg>
);
const CopyIcon = () => (
     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="5" width="10" height="10" stroke="currentColor" strokeWidth="2" />
        <path d="M7 5V2H18V13H15" stroke="currentColor" strokeWidth="2"/>
    </svg>
);
const SoundOnIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.54 8.46C16.48 9.4 17 10.62 17 12C17 13.38 16.48 14.6 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const SoundOffIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="23" y1="1" x2="1" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="6" width="18" height="2" fill="currentColor"/>
        <rect x="3" y="11" width="18" height="2" fill="currentColor"/>
        <rect x="3" y="16" width="18" height="2" fill="currentColor"/>
    </svg>
);
const ChevronLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" style={{ imageRendering: 'pixelated' }}>
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"/>
    </svg>
);
const ChevronRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" style={{ imageRendering: 'pixelated' }}>
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"/>
    </svg>
);


// --- Firebase Initialization ---
// This now reads your configuration securely from Vercel's environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
let app;
let db;
let auth;
let googleProvider;

// Debug: Log environment variables (only in development)
if (import.meta.env.DEV) {
    console.log('Environment check:', {
        hasApiKey: !!import.meta.env.VITE_API_KEY,
        hasAuthDomain: !!import.meta.env.VITE_AUTH_DOMAIN,
        hasProjectId: !!import.meta.env.VITE_PROJECT_ID,
        authDomain: import.meta.env.VITE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_PROJECT_ID
    });
}

// Only initialize Firebase if the config keys are present
if (firebaseConfig.apiKey) {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        
        // Configure Google provider
        googleProvider.addScope('email');
        googleProvider.addScope('profile');
        
        console.log('Firebase initialized successfully');
        try { 
            enableIndexedDbPersistence(db); 
        } catch (err) { 
            console.warn(`Firebase persistence error: ${err.code}`); 
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
} else {
    console.error('Firebase configuration is missing. Please check your environment variables.');
    console.error('Missing config values:', {
        apiKey: !firebaseConfig.apiKey,
        authDomain: !firebaseConfig.authDomain,
        projectId: !firebaseConfig.projectId,
        storageBucket: !firebaseConfig.storageBucket,
        messagingSenderId: !firebaseConfig.messagingSenderId,
        appId: !firebaseConfig.appId
    });
}

const rawAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-kanban-app';
const appId = rawAppId.replace(/\//g, '_'); // Sanitize appId to be a valid path segment

// --- Firestore Collection References ---
const boardsColPath = `artifacts/${appId}/public/data/boards`;
const tasksColPath = `artifacts/${appId}/public/data/tasks`;

// Helper to generate a consistent color for avatars
const generateAvatarColor = (uid) => {
    let hash = 0;
    for (let i = 0; i < uid.length; i++) { hash = uid.charCodeAt(i) + ((hash << 5) - hash); }
    return `hsl(${hash % 360}, 60%, 50%)`;
};

// --- Sound Effects ---
const synth = new Tone.Synth().toDestination();
const playSound = (note, duration = '8n') => {
    if (Tone.context.state !== 'running') {
        Tone.start();
    }
    synth.triggerAttackRelease(note, duration);
};

// --- Components ---

const GoogleSignIn = ({ onSignIn }) => {
    const debugInfo = () => {
        console.log('Debug Info:', {
            hasAuth: !!auth,
            hasProvider: !!googleProvider,
            hasFirebaseConfig: !!firebaseConfig.apiKey,
            currentDomain: window.location.hostname,
            environment: import.meta.env.MODE
        });
        alert(`Debug Info:
- Firebase Auth: ${!!auth ? 'Initialized' : 'Not initialized'}
- Google Provider: ${!!googleProvider ? 'Available' : 'Not available'}
- Domain: ${window.location.hostname}
- Environment: ${import.meta.env.MODE}
- Has Config: ${!!firebaseConfig.apiKey}

Check console for more details.`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 pixel-font">
            <div className="bg-[#10182c] p-8 rounded-lg shadow-lg max-w-sm w-full pixel-border-purple text-center">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">Welcome to Quest Boards!</h2>
                <p className="text-gray-300 mb-6">Sign in with Google to start your adventure</p>
                <button 
                    onClick={onSignIn}
                    className="w-full py-3 px-4 text-sm text-white bg-blue-600 border-2 border-blue-500 rounded pixel-font hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 mb-3"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                </button>
                <button 
                    onClick={debugInfo}
                    className="w-full py-2 px-4 text-xs text-gray-400 bg-gray-800 border border-gray-600 rounded pixel-font hover:bg-gray-700 transition-colors"
                >
                    🔧 Debug Info
                </button>
            </div>
        </div>
    );
};

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const steps = [
        { title: "Welcome!", text: "This is your Quest Board. Let's get started!", icon: "🚀" },
        { title: "Mission Control", text: "Create new boards or join a friend's squad with their Board ID.", icon: "🛰️" },
        { title: "Status Columns", text: "Track quests from 'To Do', 'In Progress', to 'Done'. This is your path to victory!", icon: "📊" },
        { title: "New Quest", text: "Click the '+' button on any column to add a new quest to your log.", icon: "➕" },
        { title: "Squad Up!", text: "Share the 'Board ID' at the top to invite friends to your party.", icon: "🧑‍🤝‍🧑" },
        { title: "You're Ready!", text: "Go forth and conquer your quests!", icon: "🏆" }
    ];

    const currentStep = steps[step];

    const handleNext = () => (step < steps.length - 1) ? setStep(step + 1) : onComplete();
    const handlePrev = () => (step > 0) ? setStep(step - 1) : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 pixel-font animate-fade-in">
            <div className="bg-[#10182c] p-8 rounded-lg shadow-lg max-w-sm w-full pixel-border-purple text-center animate-bounce-in">
                <div className="text-5xl mb-4">{currentStep.icon}</div>
                <h2 className="text-2xl font-bold text-purple-400 mb-2">{currentStep.title}</h2>
                <p className="text-gray-300 mb-6">{currentStep.text}</p>
                <div className="flex justify-between items-center">
                    <button 
                        onClick={handlePrev} 
                        className={`px-4 py-2 text-xs text-white bg-gray-600 border-2 border-gray-500 rounded pixel-font hover:bg-gray-500 transition-colors ${step === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={step === 0}
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleNext} 
                        className="px-4 py-2 text-xs text-white bg-purple-600 border-2 border-purple-500 rounded pixel-font hover:bg-purple-500 transition-colors"
                    >
                        {step === steps.length - 1 ? "Start Game!" : "Next"}
                    </button>
                </div>
                 <div className="flex justify-center mt-4 space-x-2">
                    {steps.map((_, index) => (<div key={index} className={`w-3 h-3 rounded-full ${index === step ? 'bg-purple-400' : 'bg-gray-600'}`}></div>))}
                </div>
            </div>
        </div>
    );
};

const TaskCard = ({ task, onEdit, onDelete, onDragStart, isDragging }) => {
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High': return 'border-red-500';
            case 'Medium': return 'border-orange-500';
            case 'Low': return 'border-lime-500';
            default: return 'border-gray-500';
        }
    };

    const getDueDateInfo = (dueDate) => {
        if (!dueDate) return { text: '', className: '' };
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate); due.setHours(0, 0, 0, 0);
        if (due < today) return { text: `Overdue`, className: 'text-red-400 font-bold bg-red-900/50 px-2 py-0.5 rounded' };
        if (due.getTime() === today.getTime()) return { text: `Due Today`, className: 'text-orange-400 font-bold bg-orange-900/50 px-2 py-0.5 rounded' };
        return { text: `Due: ${dueDate}`, className: 'text-gray-400' };
    };

    const dueDateInfo = getDueDateInfo(task.dueDate);

    return (
        <div 
            draggable 
            onDragStart={(e) => onDragStart(e, task.id)} 
            className={`p-3 mb-4 bg-[#212c47] rounded-md shadow-lg cursor-grab active:cursor-grabbing pixel-border-sm border-l-4 ${getPriorityClass(task.priority)} transition-all duration-200 transform hover:scale-105 hover:shadow-purple-500/50 active:scale-100 ${isDragging ? 'opacity-80 rotate-2 scale-110 shadow-2xl shadow-purple-500/50' : ''}`}>
            <h4 className="font-bold text-purple-300 pixel-font text-sm">{task.title}</h4>
            <p className="text-xs text-gray-300 my-2">{task.description}</p>
            {task.dueDate && <div className={`text-[10px] flex items-center gap-1.5 ${dueDateInfo.className}`}><ClockIcon /><span>{dueDateInfo.text}</span></div>}
            <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => onEdit(task)} className="p-1 text-gray-400 hover:text-yellow-300 transition-colors"><EditIcon /></button>
                <button onClick={() => onDelete(task.id)} className="p-1 text-gray-400 hover:text-red-400 transition-colors"><DeleteIcon /></button>
            </div>
        </div>
    );
};


const TaskModal = ({ task, onSave, onCancel, boardId }) => {
    const [title, setTitle] = useState(task ? task.title : '');
    const [description, setDescription] = useState(task ? task.description : '');
    const [priority, setPriority] = useState(task ? task.priority : 'Medium');
    const [dueDate, setDueDate] = useState(task ? task.dueDate : '');

    const handleSubmit = (e) => { e.preventDefault(); onSave({ ...task, title, description, priority, dueDate, boardId }); };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-40 animate-fade-in">
            <div className="bg-[#10182c] p-6 rounded-lg shadow-lg w-full max-w-md pixel-border-purple pixel-font animate-bounce-in">
                <h3 className="text-xl font-bold mb-4 text-purple-400">{task ? 'Edit Quest' : 'New Quest'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2 text-gray-400">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-[#212c47] rounded pixel-input" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2 text-gray-400">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 bg-[#212c47] rounded pixel-input" rows="3"></textarea>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-2 text-gray-400">Priority</label>
                            <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full p-2 bg-[#212c47] rounded pixel-input"><option>Low</option><option>Medium</option><option>High</option></select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-2 text-gray-400">Due Date</label>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 bg-[#212c47] rounded pixel-input" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className="px-4 py-2 text-xs text-white bg-gray-600 border-2 border-gray-500 rounded pixel-font hover:bg-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 text-xs text-white bg-purple-600 border-2 border-purple-500 rounded pixel-font hover:bg-purple-500 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Column = ({ title, tasks, onAddTask, onEditTask, onDeleteTask, onDrop, onDragOver, onDragEnter, onDragLeave, isDraggingOver, color, draggingTaskId, onDragStart }) => {
    const columnStyles = {
        cyan: { header: "bg-cyan-800 text-cyan-300 pixel-border-cyan", glow: "shadow-[0_0_20px_theme(colors.cyan.500)] border-cyan-400 animate-pulse-glow" },
        orange: { header: "bg-orange-800 text-orange-300 pixel-border-orange", glow: "shadow-[0_0_20px_theme(colors.orange.500)] border-orange-400 animate-pulse-glow" },
        lime: { header: "bg-lime-800 text-lime-300 pixel-border-lime", glow: "shadow-[0_0_20px_theme(colors.lime.500)] border-lime-400 animate-pulse-glow" },
    };
    
    return (
        <div 
            onDrop={onDrop} 
            onDragOver={onDragOver} 
            onDragEnter={onDragEnter} 
            onDragLeave={onDragLeave} 
            className={`flex-1 flex flex-col min-w-[280px] sm:min-w-[320px] max-h-full bg-[#000]/20 rounded-lg p-2 transition-all duration-300 pixel-border-sm border-2 scroll-snap-start ${isDraggingOver ? columnStyles[color].glow : 'border-transparent'}`}
        >
            <div className={`flex justify-between items-center mb-4 p-2 rounded-md ${columnStyles[color].header}`}>
                <h3 className="font-bold text-base pixel-font">{title}</h3>
                <button onClick={onAddTask} className="p-1 rounded-full hover:bg-white/20 transition-colors"><PlusIcon /></button>
            </div>
            <div className="flex-1 rounded-md p-1 min-h-[100px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-purple-600 hover:scrollbar-thumb-purple-500">
                 {tasks.map(task => <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} onDragStart={onDragStart} isDragging={draggingTaskId === task.id} />)}
                 {isDraggingOver && <div className="h-16 rounded-md bg-white/10 pixel-border-dashed mt-4 animate-fade-in"></div>}
            </div>
        </div>
    );
};

const LevelUpAnimation = () => {
    const particles = Array.from({ length: 20 });
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none">
            <div className="relative">
                {particles.map((_, i) => (
                    <div key={i} className="absolute w-4 h-4 bg-yellow-300 rounded-full animate-particle" style={{
                        '--i': i + 1,
                        '--x': (Math.random() - 0.5) * 2,
                        '--y': (Math.random() - 0.5) * 2,
                    }}></div>
                ))}
                <div className="text-5xl md:text-7xl font-bold text-yellow-300 animate-level-up pixel-font" style={{ textShadow: '0 0 10px #fff, 0 0 20px #fde047, 3px 3px #000' }}>
                    LEVEL UP!
                </div>
            </div>
        </div>
    );
};

const XpGainedPopup = ({ xp }) => (
    <div className="fixed bottom-20 right-10 z-50 pointer-events-none animate-fade-out-up">
        <p className="text-2xl font-bold text-green-400 pixel-font" style={{ textShadow: '2px 2px #000' }}>
            +{xp} XP
        </p>
    </div>
);

const MemberAvatar = ({ userId, isCurrentUser }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white border-2 border-black pixel-border-sm transition-all ${isCurrentUser ? 'ring-2 ring-offset-2 ring-offset-[#10182c] ring-yellow-300' : ''}`} style={{ backgroundColor: generateAvatarColor(userId) }} title={isCurrentUser ? `${userId} (You)` : userId}>
        {userId.substring(0, 2).toUpperCase()}
    </div>
);

const Board = ({ board, tasks, onUpdateTask, onDeleteTask, onAddTask, onEditTask, currentUserId, addXp, isMuted }) => {
    const [sortBy, setSortBy] = useState('priority');
    const [filterByPriority, setFilterByPriority] = useState('All');
    const [draggedOverColumn, setDraggedOverColumn] = useState(null);
    const [draggingTaskId, setDraggingTaskId] = useState(null);
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        const el = document.createElement('textarea');
        el.value = board.id; document.body.appendChild(el); el.select();
        try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error('Copy failed', err); }
        document.body.removeChild(el);
    };
    
    const handleDragStart = (e, taskId) => { 
        if (!isMuted) playSound('C3');
        e.dataTransfer.setData('taskId', taskId); 
        setDraggingTaskId(taskId); 
    };
    
    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId'); setDraggingTaskId(null);
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            onUpdateTask({ ...task, status: newStatus });
            if (newStatus === 'Done') {
                const xpGained = { Low: 10, Medium: 25, High: 50 }[task.priority] || 10;
                addXp(xpGained);
            } else {
                 if (!isMuted) playSound('E3');
            }
        }
        setDraggedOverColumn(null);
    };
    const handleDragOver = (e) => e.preventDefault();
    
    const sortedAndFilteredTasks = (status) => {
        let processedTasks = tasks.filter(task => task.status === status && (filterByPriority === 'All' || task.priority === filterByPriority));
        processedTasks.sort((a, b) => {
            if (sortBy === 'priority') { const order = { High: 3, Medium: 2, Low: 1 }; return (order[b.priority] || 0) - (order[a.priority] || 0); }
            if (sortBy === 'dueDate') { if (!a.dueDate) return 1; if (!b.dueDate) return -1; return new Date(a.dueDate) - new Date(b.dueDate); }
            return 0;
        });
        return processedTasks;
    };

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col h-full max-h-screen">
            <header className="mb-4 flex-shrink-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4">
                    <div className="flex-shrink-0">
                         <h2 className="text-2xl font-bold text-purple-400 pixel-font truncate">{board.name}</h2>
                        <div className="flex items-center gap-2 mt-1 bg-[#0b101f] p-1 rounded-md pixel-border-sm max-w-xs">
                            <p className="text-xs font-bold text-gray-400 pixel-font">ID:</p>
                            <p className="text-xs text-purple-300 truncate">{board.id}</p>
                            <button onClick={handleCopy} className="ml-auto p-0.5 text-gray-300 hover:text-white">{copied ? <CheckIcon /> : <CopyIcon />}</button>
                        </div>
                    </div>
                     <div className="flex flex-wrap items-center gap-2 md:gap-4 pixel-font text-xs">
                        <div>
                            <label className="font-bold text-gray-400 mr-1">Sort:</label>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-1 bg-[#212c47] rounded pixel-input text-xs"><option value="priority">Priority</option><option value="dueDate">Due Date</option></select>
                        </div>
                        <div>
                             <label className="font-bold text-gray-400 mr-1">Filter:</label>
                             <select value={filterByPriority} onChange={e => setFilterByPriority(e.target.value)} className="p-1 bg-[#212c47] rounded pixel-input text-xs"><option value="All">All</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select>
                        </div>
                         <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-400">Members:</p>
                            <div className="flex -space-x-2">{board.members && board.members.map(uid => <MemberAvatar key={uid} userId={uid} isCurrentUser={uid === currentUserId} />)}</div>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex gap-4 md:gap-8 h-full pb-8 overflow-x-auto overflow-y-hidden scrollbar-thin scroll-smooth scroll-snap-x touch-pan-x mobile-scroll-hint relative">
                 <Column title="To Do" tasks={sortedAndFilteredTasks('To Do')} onAddTask={() => onAddTask('To Do')} onEditTask={onEditTask} onDeleteTask={onDeleteTask} onDrop={(e) => handleDrop(e, 'To Do')} onDragOver={handleDragOver} onDragStart={handleDragStart} onDragEnter={() => setDraggedOverColumn('To Do')} onDragLeave={() => setDraggedOverColumn(null)} isDraggingOver={draggedOverColumn === 'To Do'} color="cyan" draggingTaskId={draggingTaskId}/>
                 <Column title="In Progress" tasks={sortedAndFilteredTasks('In Progress')} onAddTask={() => onAddTask('In Progress')} onEditTask={onEditTask} onDeleteTask={onDeleteTask} onDrop={(e) => handleDrop(e, 'In Progress')} onDragOver={handleDragOver} onDragStart={handleDragStart} onDragEnter={() => setDraggedOverColumn('In Progress')} onDragLeave={() => setDraggedOverColumn(null)} isDraggingOver={draggedOverColumn === 'In Progress'} color="orange" draggingTaskId={draggingTaskId}/>
                 <Column title="Done" tasks={sortedAndFilteredTasks('Done')} onAddTask={() => onAddTask('Done')} onEditTask={onEditTask} onDeleteTask={onDeleteTask} onDrop={(e) => handleDrop(e, 'Done')} onDragOver={handleDragOver} onDragStart={handleDragStart} onDragEnter={() => setDraggedOverColumn('Done')} onDragLeave={() => setDraggedOverColumn(null)} isDraggingOver={draggedOverColumn === 'Done'} color="lime" draggingTaskId={draggingTaskId}/>
            </main>
        </div>
    );
};


const BoardManager = ({ boards, activeBoard, onSelectBoard, onCreateBoard, onJoinBoard, onDeleteBoard, userId, level, xp, xpToNextLevel, isMuted, setIsMuted, user, onSignOut, isCollapsed, onToggleCollapse }) => {
    const [newBoardName, setNewBoardName] = useState('');
    const [joinBoardId, setJoinBoardId] = useState('');

    const handleCreate = () => { if (newBoardName.trim()) { onCreateBoard(newBoardName.trim()); setNewBoardName(''); } };
    const handleJoin = () => { if (joinBoardId.trim()) { onJoinBoard(joinBoardId.trim()); setJoinBoardId(''); } };

    const xpPercentage = (xp / xpToNextLevel) * 100;

    if (isCollapsed) {
        return (
            <aside className="bg-[#0b101f] p-2 flex flex-col pixel-border-right flex-shrink-0 w-16 transition-all duration-300">
                <div className="flex flex-col items-center space-y-4">
                    <button 
                        onClick={onToggleCollapse}
                        className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                        title="Expand Sidebar"
                    >
                        <ChevronRightIcon />
                    </button>
                    
                    {/* Minimized User Avatar */}
                    <div className="flex flex-col items-center" title={user?.displayName || 'Player'}>
                        {user?.photoURL ? (
                            <img 
                                src={user.photoURL} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full border-2 border-purple-400"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-purple-600 border-2 border-purple-400 flex items-center justify-center text-white pixel-font text-sm">
                                {(user?.displayName || 'P').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                    {/* Sound Toggle */}
                    <button 
                        onClick={() => setIsMuted(!isMuted)} 
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
                    </button>
                </div>
            </aside>
        );
    }

    return (
        <aside className="bg-[#0b101f] p-4 flex flex-col pixel-border-right flex-shrink-0 w-64 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-purple-400 pixel-font">Quest Boards</h1>
                <button 
                    onClick={onToggleCollapse}
                    className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                    title="Collapse Sidebar"
                >
                    <ChevronLeftIcon />
                </button>
            </div>
            
            {/* User Info */}
            <div className="mb-4 p-3 bg-[#212c47] rounded pixel-border-sm">
                <div className="flex items-center gap-2 mb-2">
                    {user?.photoURL && (
                        <img 
                            src={user.photoURL} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full border-2 border-purple-400"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-purple-300 pixel-font truncate">
                            {user?.displayName || 'Player'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onSignOut}
                    className="text-xs text-gray-400 hover:text-red-400 pixel-font"
                >
                    Sign Out
                </button>
            </div>
            
            <div className="mb-6">
                <h2 className="text-lg font-bold mb-2 text-gray-300 pixel-font">My Boards</h2>
                <ul className="space-y-2">
                    {boards.map(board => (
                        <li key={board.id} className="flex justify-between items-center group" title={board.name}>
                             <button onClick={() => onSelectBoard(board.id)} className={`w-full text-left p-2 rounded flex items-center gap-2 truncate ${activeBoard === board.id ? 'bg-purple-800/70 text-white' : 'hover:bg-purple-900/50'}`}>
                                <span className="truncate">{board.name}</span>
                             </button>
                             {board.owner === userId && (
                                <button onClick={() => onDeleteBoard(board.id)} className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DeleteIcon />
                                </button>
                             )}
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="mt-auto space-y-4">
                 <div className="pixel-font">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-lg text-yellow-300">LVL {level}</span>
                        <span className="text-xs text-gray-400">{xp} / {xpToNextLevel} XP</span>
                    </div>
                    <div className="w-full bg-black/50 pixel-border-sm p-0.5">
                        <div className="bg-green-500 h-2 transition-all duration-300" style={{width: `${xpPercentage}%`}}></div>
                    </div>
                </div>

                 <div>
                    <input type="text" value={joinBoardId} onChange={e => setJoinBoardId(e.target.value)} placeholder="Enter Board ID" className="w-full p-2 mb-2 bg-[#212c47] rounded pixel-input"/>
                    <button 
                        onClick={handleJoin} 
                        className="w-full py-3 px-4 text-sm text-white bg-blue-600 border-2 border-blue-500 rounded pixel-font hover:bg-blue-500 transition-colors"
                    >
                        Join Board
                    </button>
                </div>
                <div>
                    <input type="text" value={newBoardName} onChange={e => setNewBoardName(e.target.value)} placeholder="New board name" className="w-full p-2 mb-2 bg-[#212c47] rounded pixel-input"/>
                    <button 
                        onClick={handleCreate} 
                        className="w-full py-3 px-4 text-sm text-white bg-purple-600 border-2 border-purple-500 rounded pixel-font hover:bg-purple-500 transition-colors"
                    >
                        Create New
                    </button>
                </div>
                 <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-gray-400 hover:text-white w-full flex justify-center">
                    {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
                </button>
            </div>
        </aside>
    );
};


const ConfirmationModal = ({ message, onConfirm, onCancel, confirmText = "Delete" }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 pixel-font animate-fade-in">
        <div className="bg-[#10182c] p-6 rounded-lg shadow-lg w-full max-w-sm text-center pixel-border-purple animate-bounce-in">
            <p className="mb-6 text-gray-300">{message}</p>
            <div className="flex justify-center gap-4">
                <button 
                    onClick={onCancel} 
                    className="px-4 py-2 text-xs text-white bg-gray-600 border-2 border-gray-500 rounded pixel-font hover:bg-gray-500 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm} 
                    className="px-4 py-2 text-xs text-white bg-red-600 border-2 border-red-500 rounded pixel-font hover:bg-red-500 transition-colors"
                >
                    {confirmText}
                </button>
            </div>
        </div>
    </div>
);

const Notification = ({ message, type, onDismiss }) => {
    const baseClasses = 'fixed bottom-5 right-5 p-4 rounded-lg pixel-border-sm text-white pixel-font z-50';
    const typeClasses = type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    useEffect(() => { const timer = setTimeout(onDismiss, 3000); return () => clearTimeout(timer); }, [onDismiss]);
    return (<div className={`${baseClasses} ${typeClasses}`}>{message}</div>);
};

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [boards, setBoards] = useState([]);
    const [activeBoardId, setActiveBoardId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [defaultStatus, setDefaultStatus] = useState('To Do');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isMuted, setIsMuted] = useState(() => localStorage.getItem('isMuted') === 'true');
    const [level, setLevel] = useState(() => parseInt(localStorage.getItem('level')) || 1);
    const [xp, setXp] = useState(() => parseInt(localStorage.getItem('xp')) || 0);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [lastXpGained, setLastXpGained] = useState(0);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

    const xpToNextLevel = level * 100;
    
    useEffect(() => { localStorage.setItem('isMuted', isMuted); }, [isMuted]);
    useEffect(() => { localStorage.setItem('level', level); }, [level]);
    useEffect(() => { localStorage.setItem('xp', xp); }, [xp]);
    useEffect(() => { localStorage.setItem('sidebarCollapsed', isSidebarCollapsed); }, [isSidebarCollapsed]);

    const addXp = (amount) => {
        setLastXpGained(amount);
        setTimeout(() => setLastXpGained(0), 2000);
        
        const newXp = xp + amount;
        
        if (newXp >= xpToNextLevel) {
            setLevel(level + 1);
            setXp(newXp - xpToNextLevel);
            setShowLevelUp(true);
            if (!isMuted) {
                const now = Tone.now();
                const startTime = now + 0.05;
                synth.triggerAttackRelease("C4", "8n", startTime);
                synth.triggerAttackRelease("E4", "8n", startTime + 0.2);
                synth.triggerAttackRelease("G4", "8n", startTime + 0.4);
                synth.triggerAttackRelease("C5", "4n", startTime + 0.6);
            }
            setTimeout(() => setShowLevelUp(false), 3000);
        } else {
            setXp(newXp);
            if (!isMuted) playSound('C5', '16n');
        }
    };
    
    const showNotification = (message, type = 'info') => { setNotification({ message, type }); };

    const handleGoogleSignIn = async () => {
        try {
            if (!auth || !googleProvider) {
                console.error('Firebase auth or provider not initialized');
                showNotification('Authentication not properly configured', 'error');
                return;
            }
            
            console.log('Attempting Google sign-in...');
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Sign-in successful:', result.user.email);
        } catch (error) {
            console.error('Google sign-in error:', error);
            
            // Handle specific error codes
            if (error.code === 'auth/unauthorized-domain') {
                showNotification('This domain is not authorized. Please add it to Firebase Auth settings.', 'error');
            } else if (error.code === 'auth/popup-blocked') {
                showNotification('Popup was blocked. Please allow popups and try again.', 'error');
            } else if (error.code === 'auth/popup-closed-by-user') {
                showNotification('Sign-in cancelled', 'info');
            } else {
                showNotification(`Sign-in failed: ${error.message}`, 'error');
            }
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setBoards([]);
            setTasks([]);
            setActiveBoardId(null);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    useEffect(() => {
        const authUnsub = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsLoading(false);
                if (localStorage.getItem('hasVisitedKanban') !== 'true') { 
                    setShowOnboarding(true); 
                }
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });
        return () => authUnsub();
    }, []);

    useEffect(() => {
        if (!user) return;
        setIsLoading(false);
        const q = query(collection(db, boardsColPath), where('members', 'array-contains', user.uid));
        const unsub = onSnapshot(q, (snapshot) => {
            const userBoards = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setBoards(userBoards);
            if (!activeBoardId && userBoards.length > 0) { setActiveBoardId(userBoards[0].id); } 
            else if (userBoards.length === 0) { setActiveBoardId(null); }
        }, (error) => console.error("Error fetching boards:", error));
        return () => unsub();
    }, [user, activeBoardId]);
    
    useEffect(() => {
        if (!activeBoardId) { setTasks([]); return; };
        const q = query(collection(db, tasksColPath), where('boardId', '==', activeBoardId));
        const unsub = onSnapshot(q, (snapshot) => { setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))); }, 
        (error) => console.error("Error fetching tasks:", error));
        return () => unsub();
    }, [activeBoardId]);
    
    const handleOnboardingComplete = () => { localStorage.setItem('hasVisitedKanban', 'true'); setShowOnboarding(false); };
    const handleAddTask = (status) => { setDefaultStatus(status); setEditingTask(null); setIsModalOpen(true); };
    const handleEditTask = (task) => { setEditingTask(task); setIsModalOpen(true); };
    const handleSaveTask = async (taskToSave) => {
        if (taskToSave.id) { await updateDoc(doc(db, tasksColPath, taskToSave.id), taskToSave); } 
        else { await addDoc(collection(db, tasksColPath), { ...taskToSave, status: defaultStatus }); }
        if (!isMuted) playSound('G4');
        setIsModalOpen(false); setEditingTask(null);
    };
    const handleDeleteTask = async (taskId) => { 
        if (!isMuted) playSound('A2');
        await deleteDoc(doc(db, tasksColPath, taskId)); 
    };
    const handleUpdateTask = async (updatedTask) => { await updateDoc(doc(db, tasksColPath, updatedTask.id), updatedTask); };
    const handleCreateBoard = async (name) => {
        if (!user) {
            console.log('User not authenticated yet');
            showNotification('Please wait for authentication to complete', 'error');
            return;
        }
        try {
            console.log('Creating board:', name, 'for user:', user.uid);
            const ref = await addDoc(collection(db, boardsColPath), { 
                name, 
                owner: user.uid, 
                members: [user.uid], 
                createdAt: new Date() 
            });
            console.log('Board created with ID:', ref.id);
            setActiveBoardId(ref.id);
            showNotification(`Board "${name}" created successfully!`);
        } catch (error) {
            console.error('Error creating board:', error);
            showNotification(`Error creating board: ${error.message}`, 'error');
        }
    };
    const handleJoinBoard = async (boardId) => {
        if (!user || !boardId) return;
        const boardRef = doc(db, boardsColPath, boardId);
        const boardSnap = await getDoc(boardRef);
        if (boardSnap.exists()) {
             await updateDoc(boardRef, { members: arrayUnion(user.uid) });
            setActiveBoardId(boardId);
            showNotification(`Successfully joined board!`);
        } else { showNotification(`Board with ID "${boardId}" not found.`, 'error'); }
    };
    const handleDeleteRequest = (boardId) => { setBoardToDelete(boardId); };
    const confirmDeleteBoard = async () => {
        if (!boardToDelete) return;

        const boardIdToDelete = boardToDelete;
        setBoardToDelete(null);

        if (activeBoardId === boardIdToDelete) {
            setActiveBoardId(null);
        }

        await deleteDoc(doc(db, boardsColPath, boardIdToDelete));
        const q = query(collection(db, tasksColPath), where('boardId', '==', boardIdToDelete));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.forEach(d => batch.delete(d.ref));
        await batch.commit();
    };

    const activeBoard = boards.find(b => b.id === activeBoardId);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-[#10182c]"><div className="text-xl font-bold text-purple-400 pixel-font animate-pulse">Loading Game...</div></div>;
    }

    if (!user) {
        return (
            <div className="h-screen bg-[#10182c] bg-grid">
                <GoogleSignIn onSignIn={handleGoogleSignIn} />
            </div>
        );
    }

    return (
        <div className="flex h-screen font-sans bg-[#10182c] bg-grid text-gray-100">
             <style>{`
                @import url('[https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap](https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap)');
                
                body {
                    image-rendering: pixelated;
                    image-rendering: -moz-crisp-edges;
                    image-rendering: crisp-edges;
                }

                .pixel-font {
                    font-family: 'Press Start 2P', cursive;
                    text-rendering: geometricPrecision;
                }
                
                .bg-grid {
                    background-color: #10182c;
                    background-image:
                        linear-gradient(rgba(192, 132, 252, 0.2) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(192, 132, 252, 0.2) 1px, transparent 1px);
                    background-size: 40px 40px;
                    animation: grid-pan 60s linear infinite;
                }

                @keyframes grid-pan {
                    from { background-position: 0 0; }
                    to { background-position: 40px 40px; }
                }

                .pixel-border-sm {
                    border: 2px solid #3d4a69;
                    box-shadow: inset 0 0 0 2px #0b101f;
                }

                .pixel-border-purple { border: 3px solid #c084fc; box-shadow: inset 0 0 0 3px #10182c; }
                .pixel-border-cyan { border: 2px solid #22d3ee; box-shadow: inset 0 0 0 2px #0e7490; }
                .pixel-border-orange { border: 2px solid #fb923c; box-shadow: inset 0 0 0 2px #9a3412; }
                .pixel-border-lime { border: 2px solid #a3e635; box-shadow: inset 0 0 0 2px #4d7c0f; }
                
                .pixel-border-right { border-right: 4px solid #0b101f; }

                .pixel-border-dashed {
                    background-image: repeating-linear-gradient(-45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) 4px, transparent 4px, transparent 8px);
                    border: 2px solid transparent;
                }

                .pixel-input {
                    border: 2px solid #3d4a69;
                    box-shadow: inset 0 0 0 2px #10182c;
                    outline: none;
                }
                .pixel-input:focus { border-color: #c084fc; }

                .pixel-button {
                    padding: 10px 15px;
                    border: 3px solid #0b101f;
                    box-shadow: 4px 4px 0px #0b101f;
                    transition: all 0.1s ease-in-out;
                }
                .pixel-button:active {
                    transform: translate(4px, 4px);
                    box-shadow: 0px 0px 0px #0b101f;
                }
                
                .pixel-button-sm {
                    padding: 8px 12px;
                    border: 2px solid #0b101f;
                    box-shadow: 3px 3px 0px #0b101f;
                    transition: all 0.1s ease-in-out;
                }
                .pixel-button-sm:active {
                    transform: translate(3px, 3px);
                    box-shadow: 0px 0px 0px #0b101f;
                }

                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; }}
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                
                @keyframes bounce-in { 
                    0% { transform: scale(0.5); opacity: 0; }
                    80% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-bounce-in { animation: bounce-in 0.4s ease-out forwards; }

                @keyframes level-up {
                    0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
                    50% { transform: scale(1.1) rotate(5deg); opacity: 1; }
                    100% { transform: scale(1.5) rotate(0deg); opacity: 0; }
                }
                .animate-level-up { animation: level-up 2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
                
                @keyframes particle {
                    0% { transform: translate(0, 0) scale(1); opacity: 1; }
                    100% { transform: translate(calc(var(--x) * 100px), calc(var(--y) * 100px)) scale(0); opacity: 0; }
                }
                .animate-particle { animation: particle 1s ease-out forwards; }
                
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px currentColor; }
                    50% { box-shadow: 0 0 35px currentColor; }
                }
                .animate-pulse-glow { animation: pulse-glow 1.5s infinite ease-in-out; }
                
                @keyframes fade-out-up {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-50px); opacity: 0; }
                }
                .animate-fade-out-up { animation: fade-out-up 2s ease-out forwards; }

            `}</style>
            {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
            {showLevelUp && <LevelUpAnimation />}
            {lastXpGained > 0 && <XpGainedPopup xp={lastXpGained} />}
            <BoardManager 
                boards={boards} 
                activeBoard={activeBoardId} 
                onSelectBoard={setActiveBoardId} 
                onCreateBoard={handleCreateBoard} 
                onJoinBoard={handleJoinBoard} 
                onDeleteBoard={handleDeleteRequest} 
                userId={user?.uid} 
                level={level}
                xp={xp}
                xpToNextLevel={xpToNextLevel}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                user={user}
                onSignOut={handleSignOut}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Floating sidebar toggle for collapsed state */}
                {isSidebarCollapsed && (
                    <button 
                        onClick={() => setIsSidebarCollapsed(false)}
                        className="fixed top-4 left-4 z-30 p-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-500 transition-colors pixel-font border-2 border-purple-400"
                        title="Open Sidebar"
                    >
                        <MenuIcon />
                    </button>
                )}
                
                {activeBoard ? ( <Board 
                                    board={activeBoard} 
                                    tasks={tasks} 
                                    onUpdateTask={handleUpdateTask} 
                                    onDeleteTask={handleDeleteTask} 
                                    onAddTask={handleAddTask} 
                                    onEditTask={handleEditTask} 
                                    currentUserId={user?.uid} 
                                    addXp={addXp}
                                    isMuted={isMuted}
                                 />) 
                : (<div className="flex-grow flex justify-center items-center"><div className="text-center p-8"><h2 className="text-2xl font-bold text-purple-400 pixel-font mb-2">No Quests Here!</h2><p className="text-gray-400">Create a new board or join a party to start your adventure.</p></div></div>)}
            </div>
            {isModalOpen && <TaskModal onSave={handleSaveTask} onCancel={() => setIsModalOpen(false)} task={editingTask} boardId={activeBoardId} />}
            {boardToDelete && <ConfirmationModal message="Are you sure you want to delete this board and all its tasks? This cannot be undone." onConfirm={confirmDeleteBoard} onCancel={() => setBoardToDelete(null)} />}
            {notification && <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification(null)} />}
        </div>
    );
}

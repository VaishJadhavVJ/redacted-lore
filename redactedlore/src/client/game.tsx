import { useState, useEffect } from 'react';
import { api } from './api';
import { LoreLine } from '../../shared/types/api';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from './audio';
import '../index.css';


export const App = () => {
  const [lines, setLines] = useState<LoreLine[]>([]);
  const [inputText, setInputText] = useState('');
  
  // STATES: COVER -> READING -> WRITING -> REVIEWING -> REVEAL
  const [gameState, setGameState] = useState<'COVER' | 'READING' | 'WRITING' | 'REVIEWING' | 'REVEAL'>('COVER');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const LIMIT = 10;

  useEffect(() => {
    loadGame();
    const interval = setInterval(loadGame, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadGame = async () => {
    const data = await api.init();
    setLines(data.lines);
    if (data.lines.length >= LIMIT) setGameState('REVEAL');
  };

  const handleOpenBook = () => {
    playSound('page-turn');
    setGameState('READING');
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    setErrorMsg(null);
    setGameState('REVIEWING');
    playSound('page-turn');

    try {
      const response = await api.submit(inputText);

      if (response.success) {
        playSound('tape'); 
        setLines(response.lines);
        setInputText('');
        setGameState('READING');
      } else {
        playSound('error');
        // Show the error
        const message = (response as any).message || "The Editor rejected this entry.";
        setErrorMsg(message);
        setGameState('WRITING');
        
        // Auto-hide after 4 seconds
        setTimeout(() => setErrorMsg(null), 4000);
      }
    } catch (e) {
      playSound('error');
      setErrorMsg("Connection lost.");
      setGameState('WRITING');
    }
  };

  const lastLine = lines.length > 0 ? lines[lines.length - 1] : null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      
      {/* 1. COVER (Splash) */}
      {gameState === 'COVER' && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-[#2c3e50] text-white p-12 rounded-lg shadow-2xl max-w-sm w-full text-center border-l-8 border-[#1a252f] cursor-pointer hover:scale-105 transition-transform"
          onClick={handleOpenBook}
        >
          <div className="border-2 border-white/20 p-8 h-full flex flex-col items-center justify-center dashed">
            <h1 className="text-4xl font-serif mb-2 tracking-widest">JOURNAL</h1>
            <p className="text-sm opacity-50 mb-8">Vol. #01</p>
            <span className="handwritten text-xl text-yellow-200">"Tap to Open"</span>
          </div>
        </motion.div>
      )}

      {/* 2. REVEAL (Full Story) */}
      {gameState === 'REVEAL' && (
        <div className="paper-card w-full max-w-2xl h-[80vh] overflow-y-auto p-8 rounded">
           <h1 className="text-3xl text-center mb-8 border-b-2 border-dashed border-gray-300 pb-4 handwritten text-red-500">
             The Full Story
           </h1>
           <div className="space-y-4">
             {lines.map((l, i) => (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                 key={i} 
                 className="flex flex-col"
               >
                 <span className="handwritten text-xs text-gray-400 mb-1">{l.authorName} wrote:</span>
                 <p className="text-xl leading-relaxed font-serif text-gray-800">
                   {l.text}
                 </p>
               </motion.div>
             ))}
           </div>
        </div>
      )}

      {/* 3. MAIN GAMEPLAY AREA */}
      {(gameState === 'READING' || gameState === 'WRITING' || gameState === 'REVIEWING') && (
        <div className="w-full max-w-lg relative">
          
          <div className="flex justify-between items-center mb-6">
             <div className="bg-yellow-200 text-black px-3 py-1 text-sm shadow handwritten rotate-[-2deg]">
               Entry: {lines.length} / {LIMIT}
             </div>
             <div className="text-xs text-gray-400 font-serif">
               {new Date().toLocaleDateString()}
             </div>
          </div>

          {/* STORY SO FAR */}
          <div className="mb-12 min-h-[120px] flex flex-col justify-end">
             {lines.length === 0 ? (
               <p className="text-center text-gray-400 italic handwritten"> // The page is blank... start the story. </p>
             ) : (
               <motion.div 
                 layout
                 className="paper-card p-6 rotate-[1deg]"
               >
                 <p className="text-xs text-gray-400 mb-2 handwritten">Previous line:</p>
                 <p className="text-2xl font-serif">"{lastLine?.text}"</p>
               </motion.div>
             )}
          </div>

          {/* INTERACTIVE BUTTONS & INPUTS */}
          <AnimatePresence mode="wait">
            
            {/* STATE: READING */}
            {gameState === 'READING' && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameState('WRITING')}
                className="w-full btn-scrapbook py-4 text-xl rounded"
              >
                ✎ Add Your Entry
              </motion.button>
            )}

            {/* STATE: WRITING */}
            {gameState === 'WRITING' && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }} 
                // FIXED ANIMATION LINE BELOW
                animate={{ 
                  y: 0, 
                  opacity: 1, 
                  x: errorMsg ? [-10, 10, -10, 10, 0] : 0 
                }}
                exit={{ opacity: 0, y: 50 }}
                className="relative"
              >

                <textarea
                  autoFocus
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full paper-card p-6 text-xl focus:outline-none focus:ring-2 focus:ring-gray-300 min-h-[150px] rotate-[-1deg]"
                  placeholder="Type next line here..."
                  style={{ backgroundImage: 'linear-gradient(transparent 29px, #eee 30px)', backgroundSize: '30px 30px', lineHeight: '30px' }}
                />
                
                <div className="flex justify-between mt-4">
                  <button onClick={() => setGameState('READING')} className="text-sm text-gray-500 hover:text-red-500 underline handwritten">
                    Cancel
                  </button>
                  <button onClick={handleSubmit} className="btn-scrapbook px-8 py-2 rounded">
                    Stick It ➔
                  </button>
                </div>
              </motion.div>
            )}

            {/* STATE: REVIEWING */}
            {gameState === 'REVIEWING' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <div className="handwritten text-2xl animate-bounce text-gray-600">
                   The Editor is reviewing...
                </div>
                <p className="text-xs text-gray-400 mt-2 font-serif">(Checking for nonsense & safety)</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}
      {/* --- NEW POP-UP NOTIFICATION SYSTEM --- */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }} 
            animate={{ y: 20, opacity: 1 }} 
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
          >
            <div className="mt-4 bg-[#fff1f0] border-2 border-red-500 text-red-600 px-6 py-4 rounded shadow-2xl flex items-center gap-3 max-w-sm mx-4 transform rotate-1">
              {/* Icon */}
              <div className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
                !
              </div>
              
              {/* Text */}
              <div>
                <h3 className="font-bold uppercase tracking-wider text-xs">Submission Rejected</h3>
                <p className="text-sm font-serif leading-tight">{errorMsg}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
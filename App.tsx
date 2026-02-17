
import React, { useState, useEffect } from 'react';
import { Home, Settings, History, Sparkles, Plus, CheckCircle2, RotateCcw } from 'lucide-react';
import { UserProgress, MantraSession } from './types';
import CircularProgress from './components/CircularProgress';
import SessionSetup from './components/SessionSetup';
import { getMantraInsight } from './services/geminiService';

const TOTAL_GOAL = 11111;

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'session' | 'history' | 'setup' | 'ai'>('home');
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('mantra_progress');
    try {
      return saved ? JSON.parse(saved) : { totalCount: 0, sessions: [], activeMantra: "Om Mani Padme Hum" };
    } catch {
      return { totalCount: 0, sessions: [], activeMantra: "Om Mani Padme Hum" };
    }
  });

  const [sessionCount, setSessionCount] = useState(0);
  const [sessionTarget, setSessionTarget] = useState(108);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  useEffect(() => {
    localStorage.setItem('mantra_progress', JSON.stringify(progress));
  }, [progress]);

  const handleIncrement = () => {
    if (isSessionComplete) return;
    
    setSessionCount(prev => {
      const next = prev + 1;
      if (next >= sessionTarget) {
        setIsSessionComplete(true);
      }
      return next;
    });
  };

  const handleStartSession = (target: number, mantra: string) => {
    setSessionTarget(target);
    setSessionCount(0);
    setIsSessionComplete(false);
    setProgress(prev => ({ ...prev, activeMantra: mantra }));
    setView('session');
    
    // Fetch AI insight for the session
    setIsLoadingInsight(true);
    setAiInsight(null); 
    
    getMantraInsight(mantra)
      .then((insight) => {
        const validInsight: string = insight || "May your practice be fruitful.";
        setAiInsight(validInsight);
        setIsLoadingInsight(false);
      })
      .catch((err) => {
        console.error(err);
        setAiInsight("The path to mindfulness is built one mantra at a time.");
        setIsLoadingInsight(false);
      });
  };

  const saveSession = () => {
    const newSession: MantraSession = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      count: sessionCount,
      mantraName: progress.activeMantra
    };

    setProgress(prev => ({
      ...prev,
      totalCount: prev.totalCount + sessionCount,
      sessions: [newSession, ...prev.sessions]
    }));
    
    setView('home');
    setSessionCount(0);
    setIsSessionComplete(false);
    setAiInsight(null);
  };

  const totalProgressPercent = Math.min((progress.totalCount / TOTAL_GOAL) * 100, 100);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col relative pb-24">
      <header className="p-6 flex justify-between items-center bg-transparent">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Current Path</h2>
          <p className="font-serif text-lg font-bold text-stone-800">{progress.activeMantra}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Sparkles size={20} />
        </div>
      </header>

      <main className="flex-grow px-6">
        {view === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="glass p-8 rounded-[2rem] shadow-sm border-white/50 space-y-6 text-center">
              <div className="relative inline-block">
                <CircularProgress progress={totalProgressPercent}>
                  <div className="text-center">
                    <span className="text-4xl font-bold font-serif text-stone-800">{progress.totalCount.toLocaleString()}</span>
                    <p className="text-stone-400 text-sm mt-1">/ {TOTAL_GOAL.toLocaleString()}</p>
                  </div>
                </CircularProgress>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-stone-700">Journey Progress</h3>
                <p className="text-stone-500 text-sm leading-relaxed px-4">
                  You have completed {totalProgressPercent.toFixed(1)}% of your 11,111 mantra goal.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setView('setup')}
              className="w-full p-6 bg-white border border-stone-100 rounded-[2rem] shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-all active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-stone-800">New Session</p>
                <p className="text-xs text-stone-400">Choose mala count & start</p>
              </div>
            </button>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h4 className="font-semibold text-stone-800">Recent Sessions</h4>
                <button onClick={() => setView('history')} className="text-xs text-emerald-600 font-medium">View All</button>
              </div>
              <div className="space-y-3">
                {progress.sessions.slice(0, 3).map(session => (
                  <div key={session.id} className="bg-white/50 border border-stone-100 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="font-medium text-stone-700 text-sm">{session.mantraName}</p>
                      <p className="text-xs text-stone-400">{new Date(session.timestamp).toLocaleDateString()}</p>
                    </div>
                    <span className="font-serif font-bold text-stone-500">+{session.count}</span>
                  </div>
                ))}
                {progress.sessions.length === 0 && (
                  <div className="text-center py-8 text-stone-400 text-sm italic">
                    Begin your first session to see history here.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'setup' && (
          <div className="animate-in slide-in-from-bottom duration-300 h-full">
            <SessionSetup activeMantra={progress.activeMantra} onStart={handleStartSession} />
          </div>
        )}

        {view === 'session' && (
          <div className="flex flex-col items-center justify-center h-full space-y-12 py-10 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold">Meditating</p>
              <h2 className="text-2xl font-serif text-stone-800">{progress.activeMantra}</h2>
            </div>

            <div 
              onClick={handleIncrement}
              className={`relative cursor-pointer transition-all active:scale-90 select-none group`}
            >
              <div className={`absolute -inset-4 bg-emerald-50 rounded-full blur-2xl opacity-50 group-active:opacity-100 transition-opacity`} />
              <CircularProgress 
                progress={(sessionCount / sessionTarget) * 100} 
                size={320} 
                strokeWidth={10}
              >
                <div className="text-center">
                  <span className="text-6xl font-serif font-bold text-stone-800">{sessionCount}</span>
                  <p className="text-stone-400 text-lg mt-2 font-medium">/ {sessionTarget}</p>
                </div>
              </CircularProgress>
            </div>

            <div className="w-full max-w-xs space-y-6">
              {isSessionComplete ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-800">
                    <CheckCircle2 className="shrink-0" />
                    <p className="text-sm font-medium">Session complete. May this merit benefit all beings.</p>
                  </div>
                  <button 
                    onClick={saveSession}
                    className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                  >
                    Finish & Save
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-stone-400 text-sm italic">Tap anywhere on the circle to count</p>
                  <button 
                    onClick={() => setView('home')} 
                    className="text-stone-400 text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-1 mx-auto"
                  >
                    <RotateCcw size={14} /> Cancel Session
                  </button>
                </div>
              )}

              {(isLoadingInsight || aiInsight) && !isSessionComplete && (
                <div className="glass p-5 rounded-3xl border-stone-100 mt-8 animate-in fade-in duration-1000">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase tracking-tight">Wisdom</span>
                  </div>
                  {isLoadingInsight ? (
                    <div className="h-12 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-stone-600 italic leading-relaxed">"{aiInsight}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('home')} className="p-2 -ml-2 text-stone-400">
                <History size={24} className="rotate-180" />
              </button>
              <h2 className="text-2xl font-serif font-bold text-stone-800">Your Journey</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-3xl border border-stone-100">
                <p className="text-xs text-stone-400 uppercase font-bold mb-1">Total</p>
                <p className="text-2xl font-serif font-bold text-stone-800">{progress.totalCount}</p>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-stone-100">
                <p className="text-xs text-stone-400 uppercase font-bold mb-1">Sessions</p>
                <p className="text-2xl font-serif font-bold text-stone-800">{progress.sessions.length}</p>
              </div>
            </div>

            <div className="space-y-3">
              {progress.sessions.map((session) => (
                <div key={session.id} className="bg-white border border-stone-50 p-4 rounded-3xl flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800">{session.mantraName}</p>
                      <p className="text-xs text-stone-400">
                        {new Date(session.timestamp).toLocaleDateString()} at {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-emerald-600">+{session.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'ai' && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-2xl font-serif font-bold text-stone-800">Mantra Explorer</h2>
            <p className="text-stone-500 text-sm">Use AI to discover new mantras for your specific spiritual goals.</p>
            <div className="glass p-6 rounded-[2rem] text-center border-emerald-100">
              <Sparkles className="mx-auto text-emerald-500 mb-4" size={32} />
              <p className="text-stone-600 mb-6">Which state of mind are you seeking today?</p>
              <div className="grid grid-cols-2 gap-3">
                {['Peace', 'Prosperity', 'Protection', 'Wisdom', 'Healing', 'Compassion'].map(intent => (
                  <button 
                    key={intent}
                    className="p-3 bg-white rounded-2xl border border-stone-100 text-stone-600 text-sm font-medium hover:border-emerald-200 hover:text-emerald-700 transition-colors"
                  >
                    {intent}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-6 left-6 right-6 h-16 glass rounded-full flex items-center justify-around shadow-xl border-white/40 z-50">
        <button 
          onClick={() => setView('home')}
          className={`p-3 rounded-full transition-all ${view === 'home' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
        >
          <Home size={22} />
        </button>
        <button 
          onClick={() => setView('ai')}
          className={`p-3 rounded-full transition-all ${view === 'ai' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
        >
          <Sparkles size={22} />
        </button>
        <button 
          onClick={() => setView('history')}
          className={`p-3 rounded-full transition-all ${view === 'history' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
        >
          <History size={22} />
        </button>
        <button 
          onClick={() => {}} 
          className="p-3 rounded-full text-stone-400 hover:text-stone-600 transition-all"
        >
          <Settings size={22} />
        </button>
      </nav>
    </div>
  );
};

export default App;

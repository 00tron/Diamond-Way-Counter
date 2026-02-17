
import React from 'react';
import { SessionTarget } from '../types';

interface SessionSetupProps {
  onStart: (target: number, mantra: string) => void;
  activeMantra: string;
}

const SessionSetup: React.FC<SessionSetupProps> = ({ onStart, activeMantra }) => {
  const [mantra, setMantra] = React.useState(activeMantra || "Om Mani Padme Hum");
  const [target, setTarget] = React.useState<number>(108);

  const targets = [
    { label: '27 Recitations', value: 27 },
    { label: '54 Recitations', value: 54 },
    { label: '108 Recitations', value: 108 },
  ];

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 h-full flex flex-col justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif font-bold text-stone-800">Sacred Session</h1>
        <p className="text-stone-500">Prepare your mind for focused recitation.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Active Mantra</label>
          <input
            type="text"
            value={mantra}
            onChange={(e) => setMantra(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm"
            placeholder="Enter your mantra..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Session Target</label>
          <div className="grid grid-cols-1 gap-3">
            {targets.map((t) => (
              <button
                key={t.value}
                onClick={() => setTarget(t.value)}
                className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center ${
                  target === t.value 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-100'
                }`}
              >
                <span className="font-medium">{t.label}</span>
                {target === t.value && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onStart(target, mantra)}
        className="w-full bg-stone-800 text-white p-5 rounded-2xl font-semibold text-lg hover:bg-stone-700 transition-colors shadow-lg active:scale-95"
      >
        Begin Meditation
      </button>
    </div>
  );
};

export default SessionSetup;

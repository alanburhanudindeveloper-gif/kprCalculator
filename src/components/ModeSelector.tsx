import React from 'react';
import { Clock, TrendingDown } from 'lucide-react';
import { SimulationMode } from '../types/kpr';

interface ModeSelectorProps {
  currentMode: SimulationMode;
  onSelectMode: (mode: SimulationMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => onSelectMode('A')}
          className={`py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all text-left flex items-start gap-2.5 ${
            currentMode === 'A'
              ? 'bg-[#0060af] dark:bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              currentMode === 'A'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold truncate">MODE A: Pangkas Tenor</div>
            <div
              className={`text-[11px] font-normal leading-tight mt-0.5 ${
                currentMode === 'A' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Cicilan tetap sesuai SP3K, KPR lunas lebih cepat
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('B')}
          className={`py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all text-left flex items-start gap-2.5 ${
            currentMode === 'B'
              ? 'bg-[#0060af] dark:bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              currentMode === 'B'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold truncate">MODE B: Recalculate Cicilan</div>
            <div
              className={`text-[11px] font-normal leading-tight mt-0.5 ${
                currentMode === 'B' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Tenor tetap dipertahankan, cicilan bulanan turun
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

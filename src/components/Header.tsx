import React from 'react';
import { Film, CheckCircle, Award, BookOpen, DownloadCloud, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentSlide: number;
  totalSlides: number;
  viewMode: 'slide' | 'grid';
  onViewModeChange: (mode: 'slide' | 'grid') => void;
  onSelectSlide: (slideNumber: number) => void;
  slideNumbers: number[];
}

export const Header: React.FC<HeaderProps> = ({
  currentSlide,
  viewMode,
  onViewModeChange,
  onSelectSlide,
  slideNumbers
}) => {
  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-md shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  유네스코 김장문화 영상 클립 발췌 & 정답 검증기
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-900/60 text-red-300 border border-red-700/50">
                  슬라이드 6 ~ 10
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                <span>원문 영상: Kimjang, making and sharing kimchi in the Republic of Korea (UNESCO 2013)</span>
                <a
                  href="https://www.youtube.com/watch?v=RlBxerNfzzI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 inline-flex items-center ml-1"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          {/* Controls: Mode Switch & Slide Quick Jump */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* View Mode Toggle */}
            <div className="bg-stone-800 p-1 rounded-xl flex items-center border border-stone-700">
              <button
                id="view-mode-slide-btn"
                onClick={() => onViewModeChange('slide')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'slide'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                슬라이드 퀴즈 모드
              </button>
              <button
                id="view-mode-grid-btn"
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                5개 클립 전체 보기
              </button>
            </div>

            {/* Slide Badges Quick Selector */}
            {viewMode === 'slide' && (
              <div className="flex items-center gap-1 bg-stone-800/80 p-1 rounded-xl border border-stone-700/60">
                {slideNumbers.map((sNum) => {
                  const isActive = currentSlide === sNum;
                  return (
                    <button
                      key={sNum}
                      id={`nav-slide-${sNum}`}
                      onClick={() => onSelectSlide(sNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-stone-100 text-stone-900 shadow'
                          : 'text-stone-400 hover:text-stone-100 hover:bg-stone-700'
                      }`}
                      title={`슬라이드 ${sNum} (Quiz #${sNum - 5}) 이동`}
                    >
                      {sNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

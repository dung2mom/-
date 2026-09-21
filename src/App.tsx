import React, { useState } from 'react';
import { SLIDES_DATA } from './data/slidesData';
import { Header } from './components/Header';
import { VideoPlayer } from './components/VideoPlayer';
import { QuizCard } from './components/QuizCard';
import { ClipsOverview } from './components/ClipsOverview';
import { Sparkles, Download, CheckCircle, Info } from 'lucide-react';

export default function App() {
  const [selectedSlideNumber, setSelectedSlideNumber] = useState<number>(6);
  const [viewMode, setViewMode] = useState<'slide' | 'grid'>('slide');
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [revealedSlides, setRevealedSlides] = useState<Record<number, boolean>>({});

  const currentClip = SLIDES_DATA.find((c) => c.slideNumber === selectedSlideNumber) || SLIDES_DATA[0];
  const currentIndex = SLIDES_DATA.findIndex((c) => c.slideNumber === selectedSlideNumber);

  const handleSelectOption = (slideNumber: number, option: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({ ...prev, [slideNumber]: option }));
  };

  const handleToggleReveal = (slideNumber: number) => {
    setRevealedSlides((prev) => ({ ...prev, [slideNumber]: !prev[slideNumber] }));
  };

  const handlePrevSlide = () => {
    if (currentIndex > 0) {
      setSelectedSlideNumber(SLIDES_DATA[currentIndex - 1].slideNumber);
    }
  };

  const handleNextSlide = () => {
    if (currentIndex < SLIDES_DATA.length - 1) {
      setSelectedSlideNumber(SLIDES_DATA[currentIndex + 1].slideNumber);
    }
  };

  const slideNumbers = SLIDES_DATA.map((c) => c.slideNumber);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        currentSlide={selectedSlideNumber}
        totalSlides={SLIDES_DATA.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSelectSlide={(sNum) => {
          setSelectedSlideNumber(sNum);
          setViewMode('slide');
        }}
        slideNumbers={slideNumbers}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {viewMode === 'grid' ? (
          /* All Clips Overview & Download Center */
          <ClipsOverview
            clips={SLIDES_DATA}
            onSelectSlide={(sNum) => {
              setSelectedSlideNumber(sNum);
              setViewMode('slide');
            }}
          />
        ) : (
          /* Slide-by-Slide Interactive Mode */
          <div className="space-y-6">
            {/* Top Slide Quick Navigator & Progress Bar */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  슬라이드 바로가기:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {SLIDES_DATA.map((c) => {
                    const isCurrent = c.slideNumber === selectedSlideNumber;
                    const isAnswered = !!userAnswers[c.slideNumber];
                    const isRevealed = !!revealedSlides[c.slideNumber];
                    return (
                      <button
                        key={c.slideNumber}
                        id={`slide-tab-${c.slideNumber}`}
                        onClick={() => setSelectedSlideNumber(c.slideNumber)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isCurrent
                            ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-300'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        <span>Slide {c.slideNumber}</span>
                        {isRevealed && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress Count */}
              <div className="text-xs font-semibold text-stone-600 flex items-center gap-2">
                <span>정답 확인 진행도:</span>
                <span className="bg-stone-100 px-2.5 py-1 rounded-full text-stone-800 font-mono font-bold">
                  {Object.keys(revealedSlides).length} / {SLIDES_DATA.length} 완료
                </span>
              </div>
            </div>

            {/* Split Screen: Video Player (Left) + Quiz Verification (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Video Player & Clip Highlights (7 Cols on desktop) */}
              <div className="lg:col-span-7 space-y-4">
                <VideoPlayer
                  src={currentClip.videoSrc}
                  title={currentClip.title}
                  slideNumber={currentClip.slideNumber}
                  startTime={currentClip.startTime}
                  endTime={currentClip.endTime}
                  duration={currentClip.durationFormatted}
                  downloadFileName={`slide_${currentClip.slideNumber < 10 ? '0' + currentClip.slideNumber : currentClip.slideNumber}_clip.mp4`}
                />

                {/* Cultural & Learning Context Card */}
                <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      이 영상 클립의 핵심 학습 포인트
                    </h3>
                    <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      유네스코 인류무형문화유산 등재 기록물
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {currentClip.keyLearningPoint}
                  </p>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>H.264 High Profile • AAC Stereo 192kbps • 720p</span>
                    <a
                      href={currentClip.videoSrc}
                      download={`slide_${currentClip.slideNumber < 10 ? '0' + currentClip.slideNumber : currentClip.slideNumber}_clip.mp4`}
                      className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>클립 MP4 바로 받기</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Quiz Question & Answer Verification (5 Cols on desktop) */}
              <div className="lg:col-span-5">
                <QuizCard
                  clip={currentClip}
                  selectedOption={userAnswers[currentClip.slideNumber] || null}
                  onSelectOption={(opt) => handleSelectOption(currentClip.slideNumber, opt)}
                  isAnswerRevealed={!!revealedSlides[currentClip.slideNumber]}
                  onToggleReveal={() => handleToggleReveal(currentClip.slideNumber)}
                  onPrev={handlePrevSlide}
                  onNext={handleNextSlide}
                  hasPrev={currentIndex > 0}
                  hasNext={currentIndex < SLIDES_DATA.length - 1}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 mt-12 text-center text-xs text-stone-500">
        <p>
          김장문화(Kimjang) 슬라이드 6-10 발췌 클립 & 정답 확인 도구 • UNESCO Intangible Cultural Heritage 2013
        </p>
      </footer>
    </div>
  );
}

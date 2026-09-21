import React from 'react';
import { SlideClip } from '../types';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, ArrowLeft, Lightbulb, FileText, Sparkles } from 'lucide-react';

interface QuizCardProps {
  clip: SlideClip;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  isAnswerRevealed: boolean;
  onToggleReveal: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  clip,
  selectedOption,
  onSelectOption,
  isAnswerRevealed,
  onToggleReveal,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  const isCorrect = selectedOption === clip.correctAnswer;

  return (
    <div id={`quiz-card-slide-${clip.slideNumber}`} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
              슬라이드 {clip.slideNumber} (Quiz #{clip.questionNumber})
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
              클립 길이: {clip.durationFormatted}
            </span>
          </div>
          <span className="text-xs font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
            타임스탬프: {clip.startTime} ~ {clip.endTime}
          </span>
        </div>

        {/* Question Title & Translation */}
        <div className="mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug tracking-tight mb-1.5">
            {clip.question}
          </h2>
          <p className="text-sm font-medium text-stone-700 bg-amber-50/80 border border-amber-200/60 rounded-lg p-2.5">
            <span className="text-amber-900 font-semibold mr-1.5">질문 해석:</span>
            {clip.questionKr}
          </p>
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-2.5 mb-6">
          {clip.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isRightAnswer = opt.id === clip.correctAnswer;

            let buttonStyles = "border-stone-200 hover:border-stone-400 bg-white text-stone-800";
            let badgeStyles = "bg-stone-100 text-stone-700 border-stone-300";

            if (isAnswerRevealed) {
              if (isRightAnswer) {
                buttonStyles = "border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold ring-2 ring-emerald-400/40";
                badgeStyles = "bg-emerald-600 text-white border-emerald-600";
              } else if (isSelected && !isRightAnswer) {
                buttonStyles = "border-red-400 bg-red-50 text-red-900 ring-1 ring-red-300";
                badgeStyles = "bg-red-500 text-white border-red-500";
              } else {
                buttonStyles = "border-stone-200 bg-stone-50/60 text-stone-600 opacity-60";
                badgeStyles = "bg-stone-200 text-stone-600 border-stone-300";
              }
            } else if (isSelected) {
              buttonStyles = "border-red-600 bg-red-50/70 text-red-900 ring-2 ring-red-500/30 font-medium";
              badgeStyles = "bg-red-600 text-white border-red-600";
            }

            return (
              <button
                key={opt.id}
                id={`option-${clip.slideNumber}-${opt.id}`}
                onClick={() => onSelectOption(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${buttonStyles}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${badgeStyles}`}>
                  {opt.id}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{opt.text}</div>
                  <div className="text-xs text-stone-600 mt-0.5">{opt.textKr}</div>
                </div>

                {isAnswerRevealed && isRightAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isAnswerRevealed && isSelected && !isRightAnswer && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Reveal / Explanation Box */}
        {isAnswerRevealed ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {clip.correctAnswer}
                </span>
                <span className="font-bold text-sm text-emerald-950">
                  정답: {clip.correctAnswer}. {clip.options.find(o => o.id === clip.correctAnswer)?.text}
                </span>
              </div>
              {selectedOption && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'}`}>
                  {isCorrect ? '정답 일치! 🎉' : '내가 고른 답과 다름'}
                </span>
              )}
            </div>

            {/* Explanation */}
            <div className="text-xs text-stone-700 space-y-1 bg-white/80 p-3 rounded-lg border border-emerald-100">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                영상 속 정답 근거 해설
              </div>
              <p className="leading-relaxed font-medium text-stone-900">{clip.explanationKr}</p>
              <p className="text-stone-600 italic mt-1">{clip.explanation}</p>
            </div>

            {/* Transcript excerpt */}
            <div className="bg-stone-900 text-stone-200 rounded-lg p-3 text-xs font-mono">
              <div className="text-amber-400 font-sans font-semibold mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                발췌 영상 스크립트 (Transcript):
              </div>
              <p className="leading-relaxed text-stone-300">
                "{clip.transcriptExcerpt}"
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <button
              id={`reveal-button-${clip.slideNumber}`}
              onClick={onToggleReveal}
              className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>영상 클립으로 정답 확인하기</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 mt-2">
        <button
          id={`prev-slide-btn-${clip.slideNumber}`}
          onClick={onPrev}
          disabled={!hasPrev}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            hasPrev ? 'bg-stone-100 hover:bg-stone-200 text-stone-800' : 'bg-stone-50 text-stone-300 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전 슬라이드</span>
        </button>

        <div className="text-xs font-semibold text-stone-600">
          Slide {clip.slideNumber} / 10
        </div>

        <button
          id={`next-slide-btn-${clip.slideNumber}`}
          onClick={onNext}
          disabled={!hasNext}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            hasNext ? 'bg-red-600 hover:bg-red-500 text-white shadow-sm' : 'bg-stone-50 text-stone-300 cursor-not-allowed'
          }`}
        >
          <span>다음 슬라이드</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

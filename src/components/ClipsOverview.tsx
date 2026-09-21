import React from 'react';
import { SlideClip } from '../types';
import { Download, Play, CheckCircle2, Copy, Check, FileVideo, Terminal } from 'lucide-react';

interface ClipsOverviewProps {
  clips: SlideClip[];
  onSelectSlide: (slideNumber: number) => void;
}

export const ClipsOverview: React.FC<ClipsOverviewProps> = ({ clips, onSelectSlide }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyScript = () => {
    const script = clips
      .map(c => `curl -O "${window.location.origin}${c.videoSrc}"`)
      .join('\n');
    navigator.clipboard.writeText(script);
    setCopiedIndex(999);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="clips-overview-container" className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-stone-100 rounded-2xl p-6 shadow-md border border-stone-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileVideo className="w-6 h-6 text-red-500" />
              발췌된 슬라이드 6~10 MP4 영상 클립 (총 5개)
            </h2>
            <p className="text-sm text-stone-300 mt-1 max-w-2xl">
              유튜브 영상(UNESCO Kimjang)에서 슬라이드 6번부터 10번 문제의 정답 근거가 되는 내레이션 및 영상 구간을 정확히 발췌하여 개별 MP4 파일로 인코딩 완료하였습니다.
            </p>
          </div>
          <button
            id="copy-download-script-btn"
            onClick={copyScript}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-100 text-xs font-semibold transition-all border border-stone-600 shrink-0 cursor-pointer"
          >
            {copiedIndex === 999 ? <Check className="w-4 h-4 text-emerald-400" /> : <Terminal className="w-4 h-4" />}
            <span>일괄 다운로드 명령어 복사</span>
          </button>
        </div>
      </div>

      {/* Grid of 5 Clips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clips.map((clip) => {
          return (
            <div
              key={clip.slideNumber}
              id={`clip-card-${clip.slideNumber}`}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Video Preview */}
                <div className="relative aspect-video bg-black">
                  <video
                    src={clip.videoSrc}
                    controls
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-bold text-stone-200 border border-white/10 pointer-events-none">
                    슬라이드 {clip.slideNumber} (Quiz #{clip.questionNumber})
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-stone-300 pointer-events-none">
                    {clip.startTime} ~ {clip.endTime}
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500">
                      길이: {clip.durationFormatted}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      정답: {clip.correctAnswer}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2">
                    {clip.question}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2">
                    {clip.questionKr}
                  </p>

                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                    <div className="font-semibold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      핵심 근거:
                    </div>
                    <p className="line-clamp-2 font-medium">{clip.explanationKr}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  id={`goto-slide-${clip.slideNumber}`}
                  onClick={() => onSelectSlide(clip.slideNumber)}
                  className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>퀴즈 검증창 열기</span>
                </button>
                <a
                  id={`download-card-${clip.slideNumber}`}
                  href={clip.videoSrc}
                  download={`slide_${clip.slideNumber < 10 ? '0' + clip.slideNumber : clip.slideNumber}_clip.mp4`}
                  className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title="MP4 다운로드"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>다운로드</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Verification Table */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
          <span>슬라이드 6~10 문제 및 발췌 영상 정답 대조표</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                <th className="py-2.5 px-3">슬라이드</th>
                <th className="py-2.5 px-3">질문 (문제 요약)</th>
                <th className="py-2.5 px-3">정답</th>
                <th className="py-2.5 px-3">타임스탬프</th>
                <th className="py-2.5 px-3">영상 속 핵심 근거 발췌 문장</th>
                <th className="py-2.5 px-3 text-right">파일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {clips.map((clip) => (
                <tr key={clip.slideNumber} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-red-700 whitespace-nowrap">
                    Slide {clip.slideNumber}
                  </td>
                  <td className="py-3 px-3 max-w-[220px]">
                    <div className="font-semibold text-stone-900">{clip.question}</div>
                    <div className="text-stone-500 mt-0.5">{clip.questionKr}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                      {clip.correctAnswer}. {clip.options.find(o => o.id === clip.correctAnswer)?.text}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-600 whitespace-nowrap">
                    {clip.startTime} ~ {clip.endTime} ({clip.durationFormatted})
                  </td>
                  <td className="py-3 px-3 text-stone-700 max-w-[280px]">
                    <p className="italic text-stone-600">"{clip.transcriptExcerpt}"</p>
                    <p className="font-medium text-emerald-900 mt-1">{clip.explanationKr}</p>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <a
                      href={clip.videoSrc}
                      download={`slide_${clip.slideNumber < 10 ? '0' + clip.slideNumber : clip.slideNumber}_clip.mp4`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>MP4</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

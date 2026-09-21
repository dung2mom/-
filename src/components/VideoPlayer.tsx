import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Download, Maximize, Gauge } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title: string;
  slideNumber: number;
  startTime: string;
  endTime: string;
  duration: string;
  downloadFileName: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  slideNumber,
  startTime,
  endTime,
  duration,
  downloadFileName
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDurationSec(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [0.75, 1, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
      setPlaybackRate(nextRate);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div id={`video-player-container-${slideNumber}`} className="bg-stone-900 rounded-xl overflow-hidden shadow-xl border border-stone-800 flex flex-col">
      {/* Video element */}
      <div className="relative aspect-video bg-black flex items-center justify-center group">
        <video
          id={`video-element-${slideNumber}`}
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          loop={isLooping}
          playsInline
        />

        {/* Center overlay play button when paused */}
        {!isPlaying && (
          <button
            id={`center-play-button-${slideNumber}`}
            onClick={togglePlay}
            aria-label="Play video"
            className="absolute z-10 w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center transition-all transform hover:scale-105 shadow-2xl backdrop-blur-sm cursor-pointer"
          >
            <Play className="w-8 h-8 ml-1 fill-white" />
          </button>
        )}

        {/* Top bar indicator */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-stone-200 border border-white/10">
            슬라이드 {slideNumber} 영상 클립 • {startTime} ~ {endTime} ({duration})
          </div>
          <div className="bg-red-950/80 border border-red-500/30 text-red-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
            720p HD MP4
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="p-3 bg-stone-950/90 border-t border-stone-800 flex flex-col gap-2">
        {/* Progress scrub bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-stone-400 min-w-[36px]">
            {formatSeconds(currentTime)}
          </span>
          <input
            id={`video-scrubber-${slideNumber}`}
            type="range"
            min="0"
            max={durationSec || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            aria-label="Video scrubber"
            className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400"
          />
          <span className="text-xs font-mono text-stone-400 min-w-[36px]">
            {formatSeconds(durationSec)}
          </span>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              id={`play-toggle-${slideNumber}`}
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white transition-colors cursor-pointer"
              title={isPlaying ? "일시정지" : "재생"}
              aria-label={isPlaying ? "일시정지" : "재생"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              id={`restart-button-${slideNumber}`}
              onClick={handleRestart}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="처음부터 다시 재생"
              aria-label="처음부터 다시 재생"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id={`mute-toggle-${slideNumber}`}
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "음소거 해제" : "음소거"}
              aria-label={isMuted ? "음소거 해제" : "음소거"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              id={`speed-toggle-${slideNumber}`}
              onClick={cyclePlaybackRate}
              className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
              title="재생 속도 변경"
              aria-label="재생 속도 변경"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{playbackRate}x</span>
            </button>
            <button
              id={`loop-toggle-${slideNumber}`}
              onClick={() => setIsLooping(!isLooping)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isLooping ? 'bg-red-900/50 text-red-300 border border-red-700/50' : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="반복 재생 여부"
              aria-label="반복 재생 여부"
            >
              반복 {isLooping ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`fullscreen-button-${slideNumber}`}
              onClick={handleFullscreen}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="전체화면"
              aria-label="전체화면"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <a
              id={`download-clip-${slideNumber}`}
              href={src}
              download={downloadFileName}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="MP4 비디오 파일 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span>MP4 다운로드</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

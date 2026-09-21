export interface QuizOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  textKr: string;
}

export interface SlideClip {
  slideNumber: number;
  questionNumber: number;
  title: string;
  question: string;
  questionKr: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  explanationKr: string;
  transcriptExcerpt: string;
  videoSrc: string;
  startTime: string;
  endTime: string;
  durationFormatted: string;
  keyLearningPoint: string;
}

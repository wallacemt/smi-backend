interface GeminiCandidate {
  content: GeminiContent;
  finishReason: string;
  avgLogprobs: number;
}
interface GeminiContent {
  parts: GeminiPart[];
  role: string;
}
interface GeminiPart {
  text: string;
}
export interface GeminiResponse {
  response: {
    candidates?: GeminiCandidate[];
  };
}

export interface GeminiImageResponse {
  mimeType: string;
  imagePath: string;
  prompt: string;
}

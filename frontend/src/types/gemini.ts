/**
 * 🤖 Gemini AI TypeScript Types & Interfaces
 * Complete type definitions for Gemini API integration
 */

/**
 * Gemini API Configuration
 */
export interface GeminiConfig {
  apiKey: string;
  model: string;
  maxOutputTokens?: number;
  temperature?: number;
  endpoint?: string;
}

/**
 * Chat Message Structure
 */
export interface ChatMessage {
  prompt: string;
  base64Image?: string | null;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Gemini API Response
 */
export interface GeminiResponse {
  reply: string;
  error?: string;
  details?: string;
}

/**
 * Image Content Part
 */
export interface ImagePart {
  inlineData: {
    mimeType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';
    data: string; // base64 encoded
  };
}

/**
 * Text Content Part
 */
export interface TextPart {
  text: string;
}

/**
 * Gemini API Request Payload
 */
export interface GeminiPayload {
  contents: Array<{
    parts: (TextPart | ImagePart)[];
  }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
  systemInstruction?: {
    parts: TextPart[];
  };
}

/**
 * Gemini API Response Payload
 */
export interface GeminiAPIResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  error?: {
    code: number;
    message: string;
    details?: any[];
  };
}

/**
 * Image Analysis Request
 */
export interface ImageAnalysisRequest {
  base64Image: string;
  mimeType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';
  question: string;
}

/**
 * Image Analysis Response
 */
export interface ImageAnalysisResponse {
  analysis: string;
  confidence?: number;
  categories?: string[];
  error?: string;
}

/**
 * Gemini Service Status
 */
export interface GeminiStatus {
  configured: boolean;
  model: string;
  keyPreview: string;
  endpoint: string;
  lastChecked?: Date;
  healthy?: boolean;
}

/**
 * Chatbot Session Context
 */
export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  responses: GeminiResponse[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Error Response
 */
export interface ErrorResponse {
  error: string;
  code: string;
  details?: string;
  timestamp?: Date;
  retryable?: boolean;
}

/**
 * API Health Check Response
 */
export interface HealthCheckResponse {
  ok: boolean;
  time: string;
  geminiConfigured?: boolean;
  uptime?: number;
}

/**
 * System Prompts for Different Modes
 */
export const SYSTEM_PROMPTS = {
  default: `អ្នកគឺជា Rotana E-Learning AI ដែលបង្កើតដោយ "Rotana NOB"។
រីករាយក្នុងការជួយសិស្សរៀនសូត្របង្រៀន។`,

  teacher: `អ្នកគឺជាគ្រូគណិតវិទ្យាឯកទេស។
សូមពន្យល់លម្អិត ផ្តល់ឧទាហរណ៍ និងលម្អិតផ្នែកលម្អិត។`,

  tutor: `អ្នកគឺជាគ្រូផ្ទាល់ខ្លួនប៉ាក់វ័ក្ក្នុងការសិក្សា។
សូមផ្តល់ការណែនាំលម្អិត ផ្តល់ដំណោះស្រាយ និងលម្អិតនីមួយៗ។`,

  peer: `អ្នកគឺជាមិត្តរបស់ខ្ញុំដែលដឹងច្រើនក្នុងការសិក្សា។
រីករាយក្នុងការជួយ ហើយប្រើផេរាក់ធម្មតា។`,
} as const;

/**
 * Supported Models
 */
export type GeminiModel = 
  | 'gemini-1.5-flash' 
  | 'gemini-1.5-pro' 
  | 'gemini-2.0-flash'
  | 'gemini-pro-vision';

/**
 * Supported Image Mime Types
 */
export type SupportedImageMime = 
  | 'image/png' 
  | 'image/jpeg' 
  | 'image/gif' 
  | 'image/webp';

/**
 * API Response Status
 */
export enum ResponseStatus {
  Success = 'SUCCESS',
  Error = 'ERROR',
  RateLimited = 'RATE_LIMITED',
  Timeout = 'TIMEOUT',
  InvalidInput = 'INVALID_INPUT',
}

/**
 * Gemini Error Types
 */
export enum GeminiErrorType {
  InvalidApiKey = 'INVALID_API_KEY',
  RateLimitExceeded = 'RATE_LIMIT_EXCEEDED',
  ServerError = 'SERVER_ERROR',
  InvalidRequest = 'INVALID_REQUEST',
  NoInternet = 'NO_INTERNET',
  Timeout = 'TIMEOUT',
  Unknown = 'UNKNOWN',
}

/**
 * Generation Config
 */
export interface GenerationConfig {
  temperature?: number;           // 0.0 - 2.0
  maxOutputTokens?: number;       // 1 - 8192
  topP?: number;                  // 0.0 - 1.0
  topK?: number;                  // 1 - 40
  stopSequences?: string[];
  presencePenalty?: number;       // -2.0 - 2.0
  frequencyPenalty?: number;      // -2.0 - 2.0
}

/**
 * Safety Settings
 */
export interface SafetyRating {
  category: string;
  probability: 'NEGLIGIBLE' | 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * Usage Statistics
 */
export interface UsageStatistics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost?: number;
}

/**
 * Request Options
 */
export interface RequestOptions {
  timeout?: number;               // milliseconds
  retries?: number;
  retryDelay?: number;            // milliseconds
  onProgress?: (progress: number) => void;
}

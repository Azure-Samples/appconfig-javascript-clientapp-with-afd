// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: Date;
  model?: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  model: string;
}

export interface ChatResponse {
  message: string;
  history: ChatMessage[];
}

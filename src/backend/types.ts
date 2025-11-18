// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export interface ChatMessage {
    role: string;
    content: string;
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

export interface MessageConfiguration {
    role: string;
    content: string;
}
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { ChatMessage, ChatRequest, ChatResponse } from "./types.js";
import { ChatService } from "./chatService.js";

export const server = express();
server.use(express.json());
server.use(express.static("dist/public"));

const chatService = new ChatService();

server.post("/api/chat", async (req, res) => {
  const body: ChatRequest = req.body || {};
  const incomingMessage = body.message;
  const incomingHistory = body.history;
  const requestedModel = body.model;

  if (!incomingMessage) {
    return res.status(400).json({ error: "Missing message." });
  }
  if (!requestedModel) {
    return res.status(400).json({ error: "Missing model." });
  }

  try {
    const conversation: ChatMessage[] = [
      ...((incomingHistory ?? []) as ChatMessage[]),
      { role: "user", content: incomingMessage }
    ];

    const message = await chatService.getChatCompletion(requestedModel, conversation);
    if (!message) {
      return res.status(502).json({ error: "Empty completion from model." });
    }

    const updatedHistory: ChatMessage[] = [
      ...(incomingHistory ?? []),
      { role: "user", content: incomingMessage },
      { role: "assistant", content: message }
    ];

    const response: ChatResponse = {
      message: message,
      history: updatedHistory
    };

    return res.json(response);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

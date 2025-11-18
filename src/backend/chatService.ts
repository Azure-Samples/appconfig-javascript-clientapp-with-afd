// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as dotenv from "dotenv";
dotenv.config();

import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";
import { ChatMessage } from "./types";
import { AzureOpenAI } from "openai";

const endpoint = process.env.AI_FOUNDRY_ENDPOINT;
const apiVersion = process.env.AI_FOUNDRY_API_VERSION;
const systemPrompt = "You are a helpful assistant.";

if (!endpoint) {
    throw new Error("Missing AI_FOUNDRY_ENDPOINT environment variable. Please set it in the .env file.");
}
if (!apiVersion) {
    throw new Error("Missing AI_FOUNDRY_API_VERSION environment variable. Please set it in the .env file.");
}

const getClientPromise: Promise<AzureOpenAI> = (async () => {
  const project = new AIProjectClient(endpoint, new DefaultAzureCredential());
  return project.getAzureOpenAIClient({ apiVersion });
})();

export class ChatService {
    async getChatCompletion(model: string, incomingMessages: ChatMessage[]): Promise<string> {
        const client: AzureOpenAI = await getClientPromise;

        const messages: ChatMessage[] = [];
        messages.push({ role: "system", content: systemPrompt });
        for (const m of (incomingMessages ?? [])) {
            messages.push(m);
        }

        const chatCompletion = await client.chat.completions.create({
            model,
            messages: messages.map(m => ({ role: m.role as any, content: m.content }))
        });

        return chatCompletion.choices[0].message.content!;
    }
}
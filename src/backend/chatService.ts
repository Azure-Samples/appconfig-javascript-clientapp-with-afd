// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from "./types";

// This sample focuses on Azure App Configuration variant feature flags, so the chat backend is
// mocked and never calls a real model. That keeps the sample runnable with no Azure AI resource,
// no credentials, and no token spend.
//
// To use a real model instead, install `@azure/identity` and `@azure/ai-projects` and replace the
// body of `getChatCompletion` with an Azure AI Foundry call:
//
//   const project = new AIProjectClient(process.env.AI_FOUNDRY_ENDPOINT!, new DefaultAzureCredential());
//   const client = await project.getAzureOpenAIClient({ apiVersion: process.env.AI_FOUNDRY_API_VERSION! });
//   const completion = await client.chat.completions.create({ model, messages });
//   return completion.choices[0].message.content!;
//
// A real deployment exposes a paid, credential-backed resource, so gate the route with
// authentication and rate limiting before shipping it.

const MOCK_REPLIES: Record<string, string[]> = {
    "gpt-4o": [
        "(gpt-4o mock) Thanks for your message! I'm a simulated response so this sample can run without an AI resource.",
        "(gpt-4o mock) Good question. In a real deployment this text would come from your Azure AI Foundry deployment.",
        "(gpt-4o mock) Here's a concise answer. Swap in a real model to see actual completions."
    ],
    "gpt-5": [
        "(gpt-5 mock) Happy to help! This is the variant reply used when the 'OpenAI/newmodel' flag resolves to gpt-5.",
        "(gpt-5 mock) Let me walk you through it. This response is simulated so no tokens are consumed.",
        "(gpt-5 mock) Great question — a real gpt-5 deployment would answer here."
    ]
};

const DEFAULT_REPLIES = [
    "(mock) I'm a built-in reply for an unrecognized model. Add it to MOCK_REPLIES or connect Azure AI Foundry."
];

export class ChatService {
    async getChatCompletion(model: string, incomingMessages: ChatMessage[]): Promise<string> {
        const replies = MOCK_REPLIES[model] ?? DEFAULT_REPLIES;
        // Rotate through the canned replies so a conversation does not repeat the same line.
        const turn = (incomingMessages ?? []).filter(m => m.role === "user").length;
        return replies[Math.max(turn - 1, 0) % replies.length];
    }
}

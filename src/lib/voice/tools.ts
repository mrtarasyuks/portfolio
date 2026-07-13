/**
 * The voice agent's only function tool. Unlike the ChatGPT-authored voice-agent spec this project
 * was handed, there's no separate `search_serhii_knowledge` tool/endpoint here — grounding is
 * already fully inlined into the Realtime session's `instructions` (see
 * `buildVoiceAgentInstructions` in `aiAgentContext.ts`, which just extends the same
 * `buildAiAgentSystemPrompt()` the text chat uses), so there's nothing left to retrieve.
 */
export const SAVE_QUESTION_TOOL = {
  type: "function",
  name: "save_question_for_serhii",
  description:
    "Save a visitor's question when the answer isn't covered by Serhii's verified profile, so Serhii can follow up with them directly. Call this instead of guessing.",
  parameters: {
    type: "object",
    properties: {
      question: { type: "string", description: "The visitor's question, in their own words." },
      conversationSummary: { type: "string", description: "One short sentence of context about the call." },
      language: { type: "string", description: "The language the visitor is speaking, e.g. 'en' or 'uk'." },
    },
    required: ["question", "language"],
  },
} as const;

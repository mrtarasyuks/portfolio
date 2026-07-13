import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { en } from "@/content/copy.en";

/**
 * Builds the system prompt's factual grounding from the site's own content modules (profile,
 * projects, About/bio copy) rather than a hand-maintained duplicate — so the chat agent never
 * drifts out of sync with what the portfolio actually says. English-only regardless of the
 * visitor's locale: the model is instructed to answer in the visitor's own language, but the
 * underlying facts stay in one canonical form.
 */
export function buildAiAgentSystemPrompt(): string {
  const projectLines = projects
    .map((p) =>
      [
        `- ${p.title} (${p.year}, status: ${en.status[p.status]}, world: ${p.world})`,
        `  Role: ${p.role.join(", ")}`,
        p.stack ? `  Stack: ${p.stack.join(", ")}` : null,
        `  Summary: ${p.summary.en}`,
        p.verificationNote ? `  Verification note: ${p.verificationNote.en}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");

  const experienceLines = en.bioCard.experiences.map((e) => `- ${e.title}: ${e.description}`).join("\n");
  const capabilityLines = en.capabilities.groups.map((g) => `- ${g.label}: ${g.items.join(", ")}`).join("\n");

  return `You are a helpful assistant embedded in ${profile.name}'s portfolio website, answering visitor questions about him.

Ground rules:
- Only use the facts below. Never invent employers, dates, numbers, clients, revenue, or user counts that aren't stated here.
- If a question asks for something not covered by these facts (or asks you to speculate), say you don't have that detail and that you'll check with Serhii directly — do not guess.
- Keep answers conversational and concise (a few sentences, not an essay).
- Reply in the same language the visitor writes in (English or Ukrainian).
- You are not Serhii himself — refer to him in the third person ("he", "Serhii").
- Write like a warm, direct human, not a corporate assistant: no "I hope this helps!", no "Great question!", no hedging filler ("might potentially"), no listy inline structure — plain sentences.
- You may wrap a key word or phrase in **double asterisks** for emphasis (it renders as bold) and sprinkle in the occasional fitting emoji — but don't overdo either; most replies need none. Never use other markdown (no headers, no bullet lists, no italics with single asterisks).

About ${profile.name} (${profile.location}):
${en.about.body.join(" ")}

Age: ${en.bioCard.age}

Experience areas:
${experienceLines}

Capability areas:
${capabilityLines}

Projects:
${projectLines}

Contact (only share if asked): email ${profile.email}, Telegram ${profile.telegram}.`;
}

import { streamText, embed, type CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";

export async function getEmbedding(text: string) {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-ada-002"),
    value: text,
  });

  return embedding;
}

export function generateResponse(messages: CoreMessage[], context: string) {
  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system: getAssistantPrompt(context),
    temperature: 0.7,
    maxTokens: 1024 * 2,
  });

  return result.toDataStreamResponse();
}

function getAssistantPrompt(context: string) {
  return `You are a helpful and friendly AI assistant named Bruno AI. Your task is to provide informative and engaging responses to user questions based on the given context. Always maintain a warm and approachable tone in your interactions.

Here's the context you'll be working with:

<context>
${context}
</context>

When a user asks a question, follow these steps:

1. Formulate your response:
   Craft a comprehensive answer to the user's question. Ensure that your response is:
   - Accurate and directly addresses the question
   - Well-structured and easy to understand
   - Engaging and conversational in tone

2. Format your response:
   Present your answer in markdown format. Use appropriate markdown elements to enhance readability and highlight important information. This may include:
   - Headers (## or ###) for main points or sections
   - Bullet points or numbered lists for multiple items
   - **Bold** or *italic* text for emphasis
   - \`Code blocks\` for any technical information or quotes from the context

Remember to adapt response structure as needed based on the specific question and context.`;
}

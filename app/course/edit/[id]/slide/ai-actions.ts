"use server";

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Detect if the docs contain URLs
function containsUrls(text: string): boolean {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  return urlPattern.test(text);
}

export async function generateSlideContent(prompt: string, docs?: string) {
  if (!process.env.GROQ_API_KEY) {
    return {
      success: false,
      error: "GROQ_API_KEY is not configured",
    };
  }

  try {
    const hasUrls = docs ? containsUrls(docs) : false;

    // Use compound-beta for URL fetching, llama for regular text
    const model = hasUrls ? "compound-beta" : "llama-3.3-70b-versatile";

    const systemPrompt = `You are an expert course content creator. Generate educational slide content in Markdown format.

CRITICAL RULES:
- Keep content within 100 words maximum
- Focus on ONE core idea per slide
- Include a brief example only if it clarifies the concept
- Use bullet points for key concepts (max 3-4 points)
- Be concise and direct

${hasUrls ? "When URLs are provided, fetch and analyze the content from those URLs to create accurate slides." : ""}

Output ONLY the markdown content for the slide, nothing else.`;


    const userPrompt = docs
      ? `Based on the following documentation/context:\n\n${docs}\n\nCreate a slide about: ${prompt}`
      : `Create a slide about: ${prompt}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model,
      temperature: 0.7,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "No content generated",
      };
    }

    // Extract title from first heading (# Title)
    const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^##\s+(.+)$/m) || content.match(/^###\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : undefined;

    return {
      success: true,
      content,
      title,
      model,
    };

  } catch (error) {
    console.error("Error generating slide content:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate content",
    };
  }
}


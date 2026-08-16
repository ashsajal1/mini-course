"use server";

import { JSDOM } from "jsdom";

export interface ExtractedContent {
  title: string;
  text: string;
  wordCount: number;
  isLarge: boolean;
}

// Maximum characters to send to AI (~12K tokens estimate)
const MAX_CONTENT_CHARS = 40000;

// Tags to remove entirely from the document
const REMOVE_TAGS = [
  "script", "style", "nav", "header", "footer", "aside",
  "iframe", "noscript", "svg", "form", "button", "input",
  "select", "textarea", "dialog", "menu", "menuitem",
];

// Selectors for content regions to prioritize
const CONTENT_SELECTORS = [
  "article",
  "main",
  '[role="main"]',
  ".post-content",
  ".article-content",
  ".entry-content",
  ".content",
  "#content",
  ".markdown-body",
  ".prose",
];

/**
 * Extracts clean text content from a URL
 */
export async function extractContentFromUrl(url: string): Promise<ExtractedContent> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; CourseBot/1.0; +https://github.com/coursebot)",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
    },
    signal: AbortSignal.timeout(30000), // 30 second timeout
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Remove unwanted elements
  for (const tag of REMOVE_TAGS) {
    const elements = document.querySelectorAll(tag);
    elements.forEach((el: Element) => el.remove());
  }

  // Try to find the main content area
  let contentElement: Element | null = null;
  for (const selector of CONTENT_SELECTORS) {
    contentElement = document.querySelector(selector);
    if (contentElement) break;
  }

  // Fall back to body if no content area found
  if (!contentElement) {
    contentElement = document.body;
  }

  // Extract title
  const title =
    document.querySelector("title")?.textContent?.trim() ||
    document.querySelector("h1")?.textContent?.trim() ||
    "Untitled Document";

  // Extract clean text
  const text = extractText(contentElement);

  // Clean up the text
  const cleanedText = cleanText(text);

  const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;

  return {
    title,
    text: cleanedText,
    wordCount,
    isLarge: cleanedText.length > MAX_CONTENT_CHARS,
  };
}

/**
 * Recursively extracts text from a DOM element, preserving structure
 */
function extractText(element: Element | null): string {
  if (!element) return "";

  const parts: string[] = [];

  for (const child of element.childNodes) {
    if (child.nodeType === child.TEXT_NODE) {
      const text = child.textContent?.trim();
      if (text) {
        parts.push(text);
      }
    } else if (child.nodeType === child.ELEMENT_NODE) {
      const el = child as Element;
      const tagName = el.tagName.toLowerCase();

      // Skip hidden elements
      const style = el.getAttribute("style") || "";
      if (style.includes("display: none") || style.includes("visibility: hidden")) {
        continue;
      }

      // Add structure markers for headings and lists
      if (/^h[1-6]$/.test(tagName)) {
        const level = parseInt(tagName[1]);
        const prefix = "#".repeat(level);
        parts.push(`\n\n${prefix} ${el.textContent?.trim()}\n`);
      } else if (tagName === "p" || tagName === "div") {
        const text = extractText(el);
        if (text) parts.push(`\n\n${text}`);
      } else if (tagName === "li") {
        const text = extractText(el);
        if (text) parts.push(`\n- ${text}`);
      } else if (tagName === "pre" || tagName === "code") {
        parts.push(`\n\`\`\`\n${el.textContent?.trim()}\n\`\`\`\n`);
      } else if (tagName === "table") {
        parts.push(`\n\n${extractTableText(el)}\n`);
      } else if (tagName === "br") {
        parts.push("\n");
      } else {
        parts.push(extractText(el));
      }
    }
  }

  return parts.join(" ");
}

/**
 * Extracts text from a table in a structured format
 */
function extractTableText(table: Element): string {
  const rows: string[] = [];
  const trElements = table.querySelectorAll("tr");

  trElements.forEach((tr) => {
    const cells: string[] = [];
    tr.querySelectorAll("td, th").forEach((cell) => {
      cells.push(cell.textContent?.trim() || "");
    });
    if (cells.length > 0) {
      rows.push(cells.join(" | "));
    }
  });

  return rows.join("\n");
}

/**
 * Cleans and normalizes extracted text
 */
function cleanText(text: string): string {
  return text
    // Collapse multiple newlines
    .replace(/\n{3,}/g, "\n\n")
    // Collapse multiple spaces
    .replace(/[ \t]+/g, " ")
    // Remove leading/trailing whitespace per line
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    // Remove empty lines that are just whitespace
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}

/**
 * Chunks large content into manageable pieces for AI processing
 */
export async function chunkContent(text: string, maxChunkSize: number = MAX_CONTENT_CHARS): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  const paragraphs = text.split("\n\n");
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 2 > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = paragraph;
    } else {
      currentChunk = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Summarizes content if it's too large by taking key sections
 */
export  async function summarizeForOutline(text: string, maxLength: number = MAX_CONTENT_CHARS): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Strategy: Take beginning + middle + end to capture structure
  const sectionSize = Math.floor(maxLength / 3);
  const beginning = text.slice(0, sectionSize);
  const middle = text.slice(
    Math.floor(text.length / 2) - sectionSize / 2,
    Math.floor(text.length / 2) + sectionSize / 2
  );
  const end = text.slice(-sectionSize);

  return `${beginning}\n\n[... content truncated ...]\n\n${middle}\n\n[... content truncated ...]\n\n${end}`;
}

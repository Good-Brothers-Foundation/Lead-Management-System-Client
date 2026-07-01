import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { lead, customInstructions, ollamaUrl, modelName } = await req.json();

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead data is required" },
        { status: 400 },
      );
    }

    const resolvedOllamaUrl =
      ollamaUrl?.trim() ||
      process.env.OLLAMA_BASE_URL ||
      "http://localhost:11434";
    const resolvedModelName =
      modelName?.trim() || process.env.OLLAMA_MODEL || "llama3.1";

    // Build a precise prompt
    const prompt =`You are a professional sales outreach assistant for BusinessKiDuniya (https://businesskiduniya.in).

BusinessKiDuniya helps local businesses grow online through services such as:

* Website Design & Development
* Website Redesign & Optimization
* SEO
* Google Business Profile Optimization
* Social Media Growth
* Lead Generation
* Branding
* Digital Marketing
* Business Automation
* Performance Optimization
* Online Presence Improvement

Your task is to write a highly personalized WhatsApp outreach message for the business owner using the lead data below.

Lead Data:
${JSON.stringify(lead, null, 2)}

Additional Instructions:
${customInstructions || "None"}

ANALYZE THE ENTIRE LEAD DATA FIRST

The lead data may contain:

* Business Name
* Category
* Services
* Website
* Emails
* Phone Numbers
* Address
* Social Profiles
* Ratings
* Notes
* Requirements
* Source Information
* Additional URLs
* Any other fields

Do not assume that a value stored in the website field is actually a website.

DIGITAL PRESENCE ANALYSIS

Analyze all available URLs and online presence data.

Website Validation Rules:

Treat as NOT having a website if the URL is:

* Empty
* Null
* Undefined
* N/A
* Google Maps URL
* Google Business Profile URL
* WhatsApp URL
* Facebook URL
* Instagram URL
* LinkedIn URL
* Twitter/X URL
* YouTube URL
* Linktree URL
* JustDial URL
* IndiaMART URL
* Sulekha URL
* Practo URL
* Any social profile
* Any business directory listing

Only consider it a website if it appears to be an independent business domain.

Examples:
Valid:

* businesskiduniya.in
* exampleclinic.com
* abcgym.in

Invalid:

* wa.me/xxxxxxxxxx
* instagram.com/xyz
* facebook.com/xyz
* maps.google.com/xyz
* justdial.com/xyz

If uncertain, assume the business does not have a valid website.

SOCIAL PRESENCE ANALYSIS

Analyze:

* Facebook
* Instagram
* LinkedIn
* Twitter/X
* YouTube
* Any additional social profiles

Determine whether the business:

* Has little to no online presence
* Has social media but no website
* Has a website but weak online presence
* Has a strong online presence

SERVICE SELECTION LOGIC

IMPORTANT:

Do NOT try to sell a website to every business.

Identify the single most valuable opportunity to help the business grow.

Use the lead data and online presence analysis to determine which service is most relevant.

Examples:

If no website exists:
Focus on:

* Website Design
* Online Presence
* Trust Building
* Customer Inquiries

If social media exists but no website:
Focus on:

* Creating a professional website
* Converting visitors into customers
* Building credibility

If website exists but online presence appears weak:
Focus on:

* SEO
* Website Optimization
* Google Business Profile Optimization
* Lead Generation 

If website and social presence both exist:
Focus on:

* Growth Opportunities
* Lead Generation
* Conversion Improvements
* SEO
* Digital Marketing
* Automation
* Performance Improvements

If notes, requirements, or business details reveal a more valuable opportunity:
Prioritize that opportunity instead.

BUSINESS PERSONALIZATION

Adapt the message naturally based on the business type.

Examples:

Dental Clinic:

* Patients
* Appointments
* Trust

Doctor:

* Patients
* Online visibility
* Bookings

Library:

* Students
* Memberships
* Study spaces

Gym:

* Members
* Fitness seekers
* Membership inquiries

Salon:

* Clients
* Bookings
* Local visibility

Restaurant:

* Customers
* Reservations
* Online discovery

Coaching Institute:

* Students
* Parents
* Admissions

Use similar personalization for any category.

MESSAGE FORMAT

Follow this structure:

Hi <Business Name> 👋

<Personalized observation based on their business and online presence>

<1-2 short sentences explaining how BusinessKiDuniya can help them grow using the most relevant service opportunity identified from the lead data>

Would you be interested in seeing a few ideas that could help your business attract more customers online?

BusinessKiDuniya
https://businesskiduniya.in

RULES

* Keep the message between 60 and 120 words.
* Friendly, conversational, and professional.
* Sound human.
* No markdown headings.
* No bullet points.
* No analysis.
* No placeholders.
* No JSON.
* No explanations.
* No criticism.
* No exaggerated claims.
* No fake promises.
* Do not mention missing social accounts directly.
* Do not mention internal reasoning.
* Output ONLY the final WhatsApp message.
.
`;

    const cleanUrl = resolvedOllamaUrl.replace(/\/$/, "");

    // Fetch with a reasonable timeout or fallback
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout for local models

    try {
      const response = await fetch(`${cleanUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: resolvedModelName,
          prompt: prompt,
          stream: false,
          options: {
            num_predict: 180,
            temperature: 0.7,
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        let customErrorMessage = `Failed to fetch from Ollama service: status ${response.status}`;

        if (response.status === 404) {
          customErrorMessage = `Model "${resolvedModelName}" not found in Ollama. Click "Ollama Settings" (gear icon) in the UI and ensure your model name is set to "llama3.1" (or the model name you ran in Ollama).`;
        }

        return NextResponse.json(
          {
            success: false,
            message: customErrorMessage,
            error: errText,
          },
          { status: 502 },
        );
      }

      const result = await response.json();
      const rawText = result.response?.trim();

      // Clean up text to remove conversational intro chatter (e.g. "Here is your message:")
      const generatedText = cleanGeneratedMessage(rawText, lead.fullName);

      return NextResponse.json({
        success: true,
        message: "Message generated successfully",
        data: generatedText,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Request to Ollama timed out. Make sure your local model is loaded and responsive.",
          },
          { status: 504 },
        );
      }
      throw fetchError;
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          "An error occurred during message generation. Ensure Ollama is running and accessible.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// Helper to strip local LLM introductory chatter
function cleanGeneratedMessage(text: string, leadName: string): string {
  if (!text) return "";
  let cleaned = text.trim();

  // Remove wrapping quotes if the model output the text inside quotes
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(1, cleaned.length - 1).trim();
  }
  if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.substring(1, cleaned.length - 1).trim();
  }

  const lines = cleaned.split("\n");
  let greetingIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    // Check if the line looks like a greeting starting line
    if (
      line.startsWith("hi") ||
      line.startsWith("hello") ||
      line.startsWith("hey") ||
      line.includes("👋") ||
      (leadName && line.includes(leadName.toLowerCase()))
    ) {
      greetingIndex = i;
      break;
    }
  }

  if (greetingIndex > 0) {
    cleaned = lines.slice(greetingIndex).join("\n").trim();
  }

  return cleaned;
}

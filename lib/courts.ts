export type CourtId = "hallucination" | "prompting" | "ethics";

export type Court = {
  id: CourtId;
  name: string;
  tagline: string;
  description: string;
  href: string;
  skill: string;
  skillDescription: string;
};

export const courts: Court[] = [
  {
    id: "hallucination",
    name: "Hallucination court",
    tagline: "The Burden of Proof",
    description:
      "Understand why AI generates inaccurate information, learn to recognize hallucinations, and verify claims against reliable sources.",
    href: "/hallucination-court",
    skill: "Hallucinations",
    skillDescription:
      "Understanding when AI generates false, misleading, or unsupported information despite sounding confident. Students learn to fact-check AI responses, identify fabricated claims, and distinguish reliable information from misinformation.",
  },
  {
    id: "prompting",
    name: "Prompting court",
    tagline: "Precision Over Presumption",
    description:
      "Learn to communicate effectively with AI by crafting precise prompts that provide clear instructions, context, and expectations.",
    href: "/prompting-court",
    skill: "Prompting",
    skillDescription:
      "Learning how to communicate effectively with AI through clear, specific, and structured instructions. Students develop skills to refine prompts, provide context, and generate more accurate and useful responses.",
  },
  {
    id: "ethics",
    name: "Ethics court",
    tagline: "Responsible Judgment",
    description:
      "Examine the ethical challenges of AI, including bias, privacy, and intellectual property, and understand where human responsibility comes in.",
    href: "/ethics-court",
    skill: "Ethics",
    skillDescription:
      "Exploring the responsible use of AI and its impact on individuals and society. Students examine topics such as bias, privacy, academic integrity, copyright, and the consequences of relying on AI.",
  },
];

export type CourtId = "hallucination" | "prompting" | "ethics";

export type Court = {
  id: CourtId;
  name: string;
  tagline: string;
  description: string;
  href: string;
  skill: string;
};

export const courts: Court[] = [
  {
    id: "hallucination",
    name: "Hallucination Court",
    tagline: "The burden of proof",
    description:
      "Spot unsupported claims and distinguish confident language from reliable evidence.",
    href: "/hallucination-court",
    skill: "Verification",
  },
  {
    id: "prompting",
    name: "Prompting Court",
    tagline: "Precision over presumption",
    description:
      "Write clear prompts that give AI the context, role, and constraints it needs.",
    href: "/prompting-court",
    skill: "Prompting",
  },
  {
    id: "ethics",
    name: "Ethics Court",
    tagline: "Responsible judgment",
    description:
      "Evaluate bias, privacy, ownership, and when human judgment must remain in control.",
    href: "/ethics-court",
    skill: "Ethical judgment",
  },
];

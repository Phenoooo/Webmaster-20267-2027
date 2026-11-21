export type EthicsArgumentId = "unethical" | "responsible";

export type EthicsSource = {
  organization: string;
  title: string;
  excerpt: string;
  relevance: string;
  url: string;
};

export type EthicsCase = {
  id: string;
  level: number;
  caseNumber: string;
  title: string;
  topic: string;
  difficulty: string;
  context: string;
  question: string;
  arguments: Record<EthicsArgumentId, string>;
  sources: EthicsSource[];
  feedback: {
    correctHeading: string;
    incorrectHeading: string;
    explanation: string;
    skill: string;
    takeaway: string;
  };
};

/**
 * Predefined ethics cases. Each source link opens the specific guidance or
 * framework used by the case; no AI API is called by this game.
 */
export const ethicsCases: EthicsCase[] = [
  {
    id: "classroom-disclosure",
    level: 1,
    caseNumber: "E-1",
    title: "The Assignment Disclosure",
    topic: "Academic integrity",
    difficulty: "FOUNDATIONS",
    context: "A teacher allows AI for brainstorming, but asks students to identify AI assistance and write the final analysis themselves.",
    question: "Which lawyer recommends the more responsible way to use AI under these instructions?",
    arguments: {
      unethical: "The student rewrote the outline in their own words, so mentioning the AI tool would be unnecessary. The submitted sentences are original, and that should be enough.",
      responsible: "The student can use AI for the permitted brainstorming, but should still acknowledge that help as the assignment requires and keep the final reasoning their own.",
    },
    sources: [
      {
        organization: "UNESCO",
        title: "Guidance for generative AI in education and research",
        excerpt: "A human-centred vision of these new technologies",
        relevance: "The guidance emphasizes human-centred and age-appropriate use of generative AI in education. The assignment's own instructions determine what must be disclosed.",
        url: "https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research",
      },
    ],
    feedback: {
      correctHeading: "Permission and transparency both matter.",
      incorrectHeading: "Rewriting does not cancel the assignment's disclosure rule.",
      explanation: "The teacher permitted one kind of assistance and also required students to identify it. The responsible approach follows both parts of the instructions instead of treating rewritten wording as a reason to hide the tool's role.",
      skill: "Follow the context, not just the tool.",
      takeaway: "Responsible AI use depends on the task's rules, the role AI played, and honest disclosure when required.",
    },
  },
  {
    id: "student-record",
    level: 2,
    caseNumber: "E-2",
    title: "The Student Record",
    topic: "Privacy",
    difficulty: "FOUNDATIONS",
    context: "A student wants an AI tool to summarize a group project folder that includes classmates' names, grades, and accommodation details.",
    question: "Which lawyer handles other people's information more responsibly?",
    arguments: {
      unethical: "The tool is convenient and the folder is only being used for schoolwork. The student can paste the full document as long as they do not ask the AI to share it publicly.",
      responsible: "The student should not upload identifiable classmates' records to an unapproved tool. They should remove unnecessary personal details and use only a service the school has approved for that information.",
    },
    sources: [
      {
        organization: "U.S. Department of Education — Student Privacy Policy Office",
        title: "Privacy and Education Technology",
        excerpt: "Questions about how best to protect student privacy",
        relevance: "The Department highlights privacy considerations when students and schools use online educational services, including reviewing how tools collect, use, and transmit information.",
        url: "https://studentprivacy.ed.gov/privacy-and-education-technology",
      },
      {
        organization: "UNESCO",
        title: "Guidance for generative AI in education and research",
        excerpt: "Mandating the protection of data privacy",
        relevance: "UNESCO identifies data privacy as a central part of a human-centred approach to generative AI in education.",
        url: "https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research",
      },
    ],
    feedback: {
      correctHeading: "Convenience does not replace privacy safeguards.",
      incorrectHeading: "Private schoolwork can still contain sensitive information.",
      explanation: "The folder contains information about other students, not just the person using the tool. A responsible user checks whether the service is approved for the data and avoids sharing identifying details that are not needed.",
      skill: "Minimize data before sharing.",
      takeaway: "Do not assume a tool is appropriate for personal or education records just because it is easy to access.",
    },
  },
  {
    id: "candidate-shortlist",
    level: 3,
    caseNumber: "E-3",
    title: "The Candidate Shortlist",
    topic: "Fairness and bias",
    difficulty: "INTERMEDIATE",
    context: "A community organization uses an AI tool to rank volunteers for a leadership program. The ranking looks consistent, but no one has checked how it treats different groups.",
    question: "Which lawyer proposes the more ethical way to use the ranking?",
    arguments: {
      unethical: "The same model processed every application, so the ranking is consistent. The organization can trust the order unless a volunteer personally complains about a specific result.",
      responsible: "Consistency alone does not demonstrate fairness. The organization should check for harmful patterns across groups, understand the factors affecting results, and keep people involved in reviewing the shortlist.",
    },
    sources: [
      {
        organization: "National Institute of Standards and Technology (NIST)",
        title: "AI Risks and Trustworthiness — AI Risk Management Framework",
        excerpt: "Fair with harmful bias managed",
        relevance: "NIST identifies fairness and the management of harmful bias as characteristics to consider when assessing trustworthy AI systems.",
        url: "https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/",
      },
      {
        organization: "NIST",
        title: "AI Risk Management Framework FAQs",
        excerpt: "Manage risks that could affect individuals, organizations, society, or the environment",
        relevance: "The framework is intended to help users and evaluators think about the risks and impacts of AI systems, not simply accept their outputs.",
        url: "https://www.nist.gov/itl/ai-risk-management-framework/ai-risk-management-framework-faqs",
      },
    ],
    feedback: {
      correctHeading: "A consistent result is not automatically a fair result.",
      incorrectHeading: "Waiting for complaints can miss patterns of harm.",
      explanation: "A system can apply the same process and still produce unfair outcomes. The responsible approach actively evaluates possible bias and does not treat a ranking as self-validating evidence.",
      skill: "Test outcomes, not appearances.",
      takeaway: "Fairness requires examining impacts and possible harmful bias, not just checking that everyone used the same system.",
    },
  },
  {
    id: "scholarship-vote",
    level: 4,
    caseNumber: "E-4",
    title: "The Scholarship Vote",
    topic: "Human oversight",
    difficulty: "INTERMEDIATE",
    context: "A scholarship committee receives an AI-generated ranking of applicants. The committee has limited time, and the ranking appears to follow the scoring rubric.",
    question: "Which lawyer keeps responsibility in the right place?",
    arguments: {
      unethical: "The committee should approve the ranking as its final decision. The tool applies the same rubric to everyone, which avoids the inconsistency that can come from human judgment.",
      responsible: "The ranking can help organize the review, but committee members should examine the underlying information, question unexpected results, and make the final decision themselves.",
    },
    sources: [
      {
        organization: "UNESCO",
        title: "Recommendation on the Ethics of Artificial Intelligence",
        excerpt: "Ultimate human responsibility and accountability",
        relevance: "UNESCO's recommendation says AI should not displace ultimate human responsibility and accountability for decisions and actions based on AI systems.",
        url: "https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence",
      },
    ],
    feedback: {
      correctHeading: "AI can inform a decision without owning it.",
      incorrectHeading: "A uniform process does not remove human responsibility.",
      explanation: "The committee remains responsible for the scholarship decision. An AI ranking may assist review, but people must be able to question and take responsibility for the outcome.",
      skill: "Keep meaningful human oversight.",
      takeaway: "Do not hand over important decisions simply because an AI system produces a confident ranking.",
    },
  },
  {
    id: "campaign-image",
    level: 5,
    caseNumber: "E-5",
    title: "The Campaign Image",
    topic: "Transparency",
    difficulty: "ADVANCED",
    context: "A school newsletter uses an AI-generated image showing the principal presenting an award at an event that never happened. The editor calls it a visual illustration.",
    question: "Which lawyer better protects the audience from being misled?",
    arguments: {
      unethical: "The image is decorative rather than a written report, so the newsletter can publish it without an AI label. Readers should understand that school publications sometimes use artwork.",
      responsible: "Because the image depicts a recognizable person at a specific event, the newsletter should clearly label it as AI-generated or replace it with an image that cannot be mistaken for a real event.",
    },
    sources: [
      {
        organization: "UNESCO",
        title: "Recommendation on the Ethics of Artificial Intelligence — Transparency and Explainability",
        excerpt: "AI actors should inform users when a product or service is provided with the assistance of AI systems",
        relevance: "UNESCO describes transparency as context-dependent and says people should receive appropriate information about AI involvement. This case applies that principle to potentially misleading synthetic media.",
        url: "https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence",
      },
      {
        organization: "NIST",
        title: "AI Risks and Trustworthiness — AI Risk Management Framework",
        excerpt: "Transparency should consider human-AI interaction",
        relevance: "NIST explains that transparency includes how people are informed when interacting with AI systems or when AI contributes to an outcome.",
        url: "https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/",
      },
    ],
    feedback: {
      correctHeading: "Context determines how much disclosure is needed.",
      incorrectHeading: "A realistic illustration can still create a false impression.",
      explanation: "The concern is not simply that AI created the image. It is that the image appears to document a real person at an event that did not occur. A clear label or a non-deceptive illustration helps the audience understand what they are seeing.",
      skill: "Make AI involvement visible when it matters.",
      takeaway: "Transparency matters most when an audience could reasonably mistake synthetic content for a real record.",
    },
  },
  {
    id: "research-summary",
    level: 6,
    caseNumber: "E-6",
    title: "The Research Summary",
    topic: "Information integrity",
    difficulty: "ADVANCED",
    context: "A club report uses an AI-generated summary of three research articles. One quotation and two statistics in the summary have not been checked against the original articles.",
    question: "Which lawyer recommends the more responsible way to use the summary?",
    arguments: {
      unethical: "The summary is clear and includes a bibliography, so the club can cite it as a reliable overview. Checking every detail would take time without necessarily changing the conclusion.",
      responsible: "The club should verify quotations, statistics, and key claims in the original articles before using them. If a detail cannot be confirmed, it should be corrected or left out rather than presented as fact.",
    },
    sources: [
      {
        organization: "National Institute of Standards and Technology (NIST)",
        title: "Artificial Intelligence Risk Management Framework: Generative AI Profile",
        excerpt: "Verify the accuracy and veracity of information generated by GAI systems",
        relevance: "NIST describes information integrity as information that is verifiable, reliable, linked to original sources, and transparent about how thoroughly it has been checked.",
        url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf",
      },
    ],
    feedback: {
      correctHeading: "A polished summary still needs verification.",
      incorrectHeading: "A bibliography does not verify every generated detail.",
      explanation: "Generative AI can produce convincing language while including errors or unsupported details. Checking claims against the original articles protects the report's accuracy and gives readers a traceable path to the evidence.",
      skill: "Verify before you repeat.",
      takeaway: "Treat AI output as a starting point, not as a replacement for checking original evidence.",
    },
  },
];

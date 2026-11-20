/** Public case information. Keep confidential case facts in caseSecrets.ts (server-side only). */
export type PromptingCase = {
  id: string;
  level: number;
  caseNumber: string;
  title: string;
  category: string;
  difficulty: "FOUNDATIONS" | "INTERMEDIATE" | "ADVANCED";
  witnessName: string;
  witnessRole: string;
  witnessDescription: string;
  objective: string;
  caseBrief: string;
  openingStatement: string;
  knownEvidence: string[];
  suggestedFocus: string[];
};

export const promptingCases: PromptingCase[] = [
  {
    id: "arts-fair-cash",
    level: 1,
    caseNumber: "PC-001",
    title: "The Missing Sixty Dollars",
    category: "School Fundraiser",
    difficulty: "FOUNDATIONS",
    witnessName: "Jordan Ellis",
    witnessRole: "Arts Fair Treasurer",
    witnessDescription: "A careful student volunteer who handled the cash envelope after the school arts fair. Jordan seems defensive about the deposit record, but is willing to explain the timeline.",
    objective: "Establish why the amount collected and the amount deposited do not match.",
    caseBrief: "The arts fair ledger records $480 in cash sales. The bank deposit made the following morning was $420. Jordan was responsible for the envelope between closing and the deposit. Your job is to ask focused, fair questions and reconstruct what happened.",
    openingStatement: "I counted the envelope after the fair and handed it over the next morning. I don't know why the deposit record is lower. I didn't take any money.",
    knownEvidence: ["The ledger records $480 in cash sales.", "The bank deposit receipt shows $420.", "The envelope was counted after the fair and deposited the following morning."],
    suggestedFocus: ["Ask for a step-by-step timeline.", "Clarify whether any cash was spent before the deposit.", "Ask what receipts or approvals document any expense."],
  },
  {
    id: "robotics-demo",
    level: 2,
    caseNumber: "PC-002",
    title: "The Demo That Suddenly Failed",
    category: "Robotics Team",
    difficulty: "FOUNDATIONS",
    witnessName: "Maya Chen",
    witnessRole: "Prototype Test Lead",
    witnessDescription: "A focused robotics student who ran the final demonstration test. Maya is proud of the prototype and initially describes the failure as unpredictable.",
    objective: "Determine what changed between the last successful test and the demonstration.",
    caseBrief: "A prototype passed a test at 2:00 PM but failed during a demonstration at 2:30 PM. The team log contains a note about a configuration change, but it does not explain what was changed or whether it was tested.",
    openingStatement: "It worked earlier that afternoon. During the demonstration it stopped responding, and I honestly thought the controller had glitched.",
    knownEvidence: ["A successful test was logged at 2:00 PM.", "The demonstration failure occurred at 2:30 PM.", "A configuration-change note appears between those entries."],
    suggestedFocus: ["Compare the exact steps between the two tests.", "Ask what was changed and why.", "Clarify whether the modified setup was retested."],
  },
  {
    id: "lab-results",
    level: 3,
    caseNumber: "PC-003",
    title: "The Altered Lab Table",
    category: "Science Class",
    difficulty: "INTERMEDIATE",
    witnessName: "Noah Patel",
    witnessRole: "Lab Data Recorder",
    witnessDescription: "A conscientious lab partner who wanted the group's report to be complete. Noah says the table was cleaned up before submission.",
    objective: "Find out how one unusual measurement was handled and whether the report preserves the original data.",
    caseBrief: "A science report contains five smooth, consistent measurements. A photograph of the original lab notebook appears to show a different value in the third row. The report does not explain the difference.",
    openingStatement: "I typed the group's numbers into the final table. One reading looked strange, so I made sure the table was neat before we submitted it.",
    knownEvidence: ["The submitted report has five measurements.", "A notebook photograph appears to differ in row three.", "The report gives no note explaining a correction."],
    suggestedFocus: ["Ask what happened when the third reading was taken.", "Request the original value and any instrument notes.", "Clarify whether a correction was documented and agreed upon."],
  },
  {
    id: "newsletter-hours",
    level: 4,
    caseNumber: "PC-004",
    title: "The Newsletter That Got It Wrong",
    category: "Community Center",
    difficulty: "INTERMEDIATE",
    witnessName: "Elena Brooks",
    witnessRole: "Newsletter Editor",
    witnessDescription: "A student volunteer who drafted a community-center newsletter with help from an AI writing assistant. Elena wanted the newsletter finished quickly.",
    objective: "Trace where an incorrect opening-hours claim came from and what verification occurred before publication.",
    caseBrief: "A newsletter stated that the community center would be open on Saturday. The center was closed that day. The draft history shows an AI writing tool was used, but the editor's fact-checking process is unclear.",
    openingStatement: "I used a writing assistant to help finish the newsletter. I checked the layout and spelling, but I thought the hours in the draft were already correct.",
    knownEvidence: ["The published newsletter listed Saturday opening hours.", "The center was closed that Saturday.", "The draft history shows an AI writing assistant was used."],
    suggestedFocus: ["Ask which details came from the AI tool.", "Clarify what source was used to verify opening hours.", "Ask whether anyone reviewed factual details before publication."],
  },
  {
    id: "survey-summary",
    level: 5,
    caseNumber: "PC-005",
    title: "The Survey With Two Answers",
    category: "Student Council",
    difficulty: "ADVANCED",
    witnessName: "Owen Rivera",
    witnessRole: "Survey Analyst",
    witnessDescription: "A student council analyst who summarized a survey for a school meeting. Owen is confident in the headline but less certain about the filtering choices.",
    objective: "Understand how the sample was filtered and whether the headline accurately represents the responses.",
    caseBrief: "A student survey received 240 responses. A presentation headline says 'Most students support the new schedule.' The appendix contains a smaller analyzed sample, but the presentation does not explain why responses were excluded.",
    openingStatement: "The survey results were pretty clear to me. I used the cleaned spreadsheet for the presentation because it was easier to summarize.",
    knownEvidence: ["The survey received 240 responses.", "The analysis appendix uses fewer than 240 responses.", "The headline does not describe the exclusions."],
    suggestedFocus: ["Ask how many responses were included in the final calculation.", "Clarify the criteria used to exclude responses.", "Ask whether the headline changes when all eligible responses are included."],
  },
  {
    id: "debate-citations",
    level: 6,
    caseNumber: "PC-006",
    title: "The Citation That Cannot Be Found",
    category: "Debate Research",
    difficulty: "ADVANCED",
    witnessName: "Harper Wallace",
    witnessRole: "Research Coordinator",
    witnessDescription: "A debate-team researcher who used an AI assistant to organize sources. Harper has a detailed draft but cannot immediately locate one citation.",
    objective: "Establish whether the cited source exists, what the AI tool contributed, and what verification was completed.",
    caseBrief: "A debate brief includes a quotation attributed to a research paper. Teammates cannot find the paper using the title and author listed. The draft history shows AI-assisted research and editing.",
    openingStatement: "The source was in the research list I used. I trusted the reference because it looked complete, and we were under a deadline.",
    knownEvidence: ["The debate brief contains a quotation and a full-looking citation.", "Teammates have been unable to locate the paper.", "AI assistance was used during research and editing."],
    suggestedFocus: ["Ask where the citation first appeared.", "Request the original document or a working link.", "Clarify how the quotation was checked before submission."],
  },
];

export function getPublicPromptingCase(caseId: string): PromptingCase | undefined {
  return promptingCases.find((caseItem) => caseItem.id === caseId);
}

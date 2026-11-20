import "server-only";

/** Server-only case truth. Never import this module from client components. */
export type CaseSecret = {
  truthSummary: string;
  facts: Array<{ id: string; fact: string; triggers: string[] }>;
  gradingTargets: string[];
  idealQuestions: string[];
};

export const promptingCaseSecrets: Record<string, CaseSecret> = {
  "arts-fair-cash": {
    truthSummary: "Jordan did not take the money. Jordan used $60 from the cash envelope to buy emergency table coverings from the campus store after the faculty adviser gave verbal approval. Jordan kept the receipt in a notebook but did not record the expense on the cash ledger before the remaining $420 was deposited. The mistake was an undocumented expense and incomplete handover, not theft.",
    facts: [
      { id: "purchase", fact: "Jordan used $60 from the envelope to buy table coverings after the fair because the supply order had not arrived.", triggers: ["spend", "purchase", "buy", "expense", "cash", "money", "used", "tablecloth", "covering"] },
      { id: "approval", fact: "The faculty adviser verbally approved the urgent purchase, but the approval was not written into the ledger.", triggers: ["approve", "permission", "adviser", "teacher", "authorized", "allowed", "who knew"] },
      { id: "receipt", fact: "Jordan kept a $60 campus-store receipt in the back pocket of a notebook and forgot to attach it to the ledger.", triggers: ["receipt", "proof", "document", "record", "notebook", "evidence", "where"] },
      { id: "timeline", fact: "Jordan counted $480 after the fair, made the purchase later that afternoon, and deposited the remaining $420 the next morning.", triggers: ["timeline", "when", "order", "sequence", "after", "before", "count", "deposit"] },
      { id: "ledger", fact: "The ledger was never updated to show the $60 expense, which is why the cash total and deposit amount appear inconsistent.", triggers: ["ledger", "difference", "mismatch", "short", "480", "420", "amount", "account"] },
    ],
    gradingTargets: ["Identify the $60 purchase", "Ask about authorization", "Request the receipt or other documentation", "Reconstruct the sequence from counting to deposit", "Distinguish an undocumented expense from proof of theft"],
    idealQuestions: ["Walk me through every movement of the $480 from the time you counted it until the deposit was made.", "Was any of the cash used for a purchase before the deposit? What was purchased and why?", "Who approved that purchase, and is there a receipt or written record?", "Why was the $60 expense not entered in the ledger before the deposit?"],
  },
  "robotics-demo": {
    truthSummary: "Maya changed a servo limit value while trying to make the prototype move farther. The new value caused the controller to enter a safety stop during the demonstration. Maya had not run a full retest after changing the configuration. The failure was an untested change, not a random controller glitch.",
    facts: [
      { id: "change", fact: "Maya changed the servo limit value between the successful test and the demonstration.", triggers: ["change", "edit", "modify", "setting", "configuration", "servo", "value"] },
      { id: "reason", fact: "Maya changed the limit because she wanted the mechanism to reach farther during the demonstration.", triggers: ["why", "reason", "goal", "purpose", "trying", "farther", "reach"] },
      { id: "safety-stop", fact: "The new value caused the controller's safety limit to stop the mechanism.", triggers: ["stop", "fail", "controller", "safety", "limit", "error", "cause"] },
      { id: "retest", fact: "Maya did not run a complete retest after the configuration change.", triggers: ["retest", "test again", "verify", "check", "before demo", "tested"] },
      { id: "log", fact: "Maya wrote a brief configuration-change note but did not include the exact old and new values.", triggers: ["log", "record", "document", "note", "value", "old", "new"] },
    ],
    gradingTargets: ["Establish what changed", "Explore the reason for the change", "Connect the change to the safety stop", "Ask whether a retest occurred", "Clarify the limits of the written log"],
    idealQuestions: ["What was different in the setup after the 2:00 PM successful test?", "What were you trying to improve when you changed that setting?", "What happened when the mechanism reached the new limit?", "Did you run the complete test sequence again before the demonstration?"],
  },
  "lab-results": {
    truthSummary: "The third measurement was 18.2, but the probe slipped during that reading. Noah replaced it in the submitted table with 16.8, the average of the two nearby readings, without recording that it was an estimate. The group should have preserved the raw measurement and documented the instrument problem instead of silently substituting a value.",
    facts: [
      { id: "raw-reading", fact: "The original third reading was 18.2.", triggers: ["original", "raw", "third", "value", "number", "what was"] },
      { id: "probe", fact: "The probe slipped during the third measurement, so Noah considered that reading unreliable.", triggers: ["probe", "instrument", "slip", "error", "malfunction", "problem", "measurement"] },
      { id: "replacement", fact: "Noah replaced 18.2 with 16.8, an average of the two nearby readings.", triggers: ["replace", "substitute", "change", "edited", "16.8", "average", "calculated"] },
      { id: "undocumented", fact: "Noah did not label 16.8 as an estimate or preserve the correction note in the report.", triggers: ["document", "note", "report", "label", "estimate", "tell", "disclose"] },
      { id: "intent", fact: "Noah wanted the table to look consistent, but did not intend to fabricate a result for personal gain.", triggers: ["why", "intent", "reason", "goal", "purpose", "benefit"] },
    ],
    gradingTargets: ["Ask for the original reading", "Identify the instrument issue", "Discover the substituted average", "Ask whether the change was documented", "Avoid assuming motive without evidence"],
    idealQuestions: ["Can you read the third measurement from the original notebook photograph?", "What happened with the probe while that measurement was taken?", "How did the value in the submitted table get changed to 16.8?", "Where did the report explain that the number was an estimate rather than a raw reading?"],
  },
  "newsletter-hours": {
    truthSummary: "Elena asked an AI writing assistant to draft the newsletter. The assistant inserted Saturday hours based on outdated information. Elena checked spelling and layout but did not verify the opening hours against the center's current website or ask the center coordinator. She did not knowingly publish false hours.",
    facts: [
      { id: "ai-source", fact: "The Saturday opening-hours sentence was generated by the AI writing assistant, not copied from a verified current source.", triggers: ["ai", "assistant", "generated", "draft", "source", "where did", "come from"] },
      { id: "outdated", fact: "The AI assistant's information reflected an older schedule that was no longer current.", triggers: ["outdated", "old", "current", "schedule", "information", "hours"] },
      { id: "no-check", fact: "Elena checked spelling and layout but did not check the center's current website for the hours.", triggers: ["verify", "check", "website", "source", "fact-check", "confirm", "review"] },
      { id: "coordinator", fact: "Elena did not ask the community-center coordinator to approve the hours before publication.", triggers: ["coordinator", "manager", "staff", "approval", "ask", "confirm", "who reviewed"] },
      { id: "intent", fact: "Elena did not know the hours were wrong when the newsletter was published.", triggers: ["know", "intent", "deliberate", "purpose", "aware", "realize"] },
    ],
    gradingTargets: ["Trace the claim to AI-generated text", "Ask whether the underlying source was current", "Establish what verification was done", "Ask who reviewed the final content", "Distinguish a careless verification process from deliberate deception"],
    idealQuestions: ["Where did the Saturday-hours sentence first appear in the drafting process?", "What source did you use to confirm that the schedule was current?", "Did you compare the generated sentence with the center's official website?", "Who had a chance to review the factual details before the newsletter went out?"],
  },
  "survey-summary": {
    truthSummary: "The survey had 240 responses, but Owen excluded 38 incomplete responses and 22 duplicates, leaving 180. Among the 180 analyzed responses, 104 supported the new schedule. Owen's headline said 'Most students support' without mentioning that the analysis excluded 60 responses or that the survey was voluntary. The claim should be qualified and the sample described.",
    facts: [
      { id: "sample", fact: "The final analysis included 180 responses, not all 240 submissions.", triggers: ["sample", "count", "included", "how many", "240", "180", "responses"] },
      { id: "exclusions", fact: "Owen excluded 38 incomplete responses and 22 duplicate submissions.", triggers: ["exclude", "remove", "filter", "duplicate", "incomplete", "criteria"] },
      { id: "result", fact: "Of the 180 analyzed responses, 104 supported the new schedule.", triggers: ["result", "support", "number", "104", "calculation", "percentage", "majority"] },
      { id: "voluntary", fact: "The survey was voluntary, so respondents may not represent the entire student body.", triggers: ["voluntary", "representative", "bias", "selection", "who responded", "entire student body"] },
      { id: "headline", fact: "The presentation headline did not explain the exclusions or the voluntary nature of the survey.", triggers: ["headline", "presentation", "qualify", "caveat", "mention", "disclose"] },
    ],
    gradingTargets: ["Ask what sample size was analyzed", "Discover the exclusion rules", "Check the calculation behind the headline", "Explore voluntary-response limitations", "Recommend a properly qualified conclusion"],
    idealQuestions: ["How many of the 240 submissions were included in the final analysis?", "What specific rules led you to exclude responses?", "How many of the analyzed students supported the schedule?", "Could a voluntary survey represent students who chose not to respond?"],
  },
  "debate-citations": {
    truthSummary: "Harper asked an AI assistant to suggest research papers on the topic. The assistant generated a plausible but nonexistent paper title and author combination. Harper copied the citation into the brief without opening the paper or verifying the quotation. The quotation itself was also generated as a summary, not copied from a real paper. Harper was under deadline pressure but should have checked the source.",
    facts: [
      { id: "ai-citation", fact: "The paper title and author details were suggested by the AI assistant; Harper did not locate the paper independently.", triggers: ["ai", "assistant", "generated", "suggest", "where", "citation", "reference"] },
      { id: "no-source", fact: "The cited paper does not exist as described, and Harper cannot provide an original document or working link.", triggers: ["exist", "document", "link", "original", "paper", "locate", "find"] },
      { id: "quote", fact: "The quotation was an AI-generated summary rather than an exact quotation from a verified paper.", triggers: ["quote", "quotation", "exact wording", "copied", "text", "verbatim"] },
      { id: "no-check", fact: "Harper did not verify the citation in a library database or open the original source before submission.", triggers: ["verify", "check", "database", "library", "open", "before submission", "confirm"] },
      { id: "deadline", fact: "Harper was working under a deadline and prioritized finishing the brief, but knew the references still needed checking.", triggers: ["deadline", "rush", "time", "pressure", "why", "reason"] },
    ],
    gradingTargets: ["Trace the reference to its origin", "Request the original paper", "Establish whether the quotation is exact", "Ask how the citation was verified", "Separate deadline pressure from responsibility for accuracy"],
    idealQuestions: ["Can you show the original paper or a working link for the citation?", "Where did the title and author information come from?", "Is that sentence an exact quotation from the paper or an AI-generated summary?", "What database or original source did you use to verify it before submission?"],
  },
};

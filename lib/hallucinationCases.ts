export type ArgumentId = "unsupported" | "supported";

export type CaseArgument = {
  id: ArgumentId;
  opening: string;
  sourceTitle: string;
  sourceOrganization: string;
  sourceUrl: string;
  sourceExcerpt: string;
  sourceNote: string;
};

export type HallucinationCase = {
  id: string;
  level: number;
  caseNumber: string;
  title: string;
  topic: string;
  difficulty: "INTRODUCTORY" | "DEVELOPING" | "INTERMEDIATE" | "CHALLENGE";
  prompt: string;
  caseContext: string;
  arguments: [CaseArgument, CaseArgument];
  correctArgumentId: ArgumentId;
  feedback: {
    correctHeading: string;
    incorrectHeading: string;
    correctExplanation: string;
    incorrectExplanation: string;
    skill: string;
    takeaway: string;
  };
};

/**
 * Case content is deliberately kept separate from the game UI.
 * Each exhibit links to the original source; excerpts are short and kept in context.
 */
export const hallucinationCases: HallucinationCase[] = [
  {
    id: "lightning-repeat-strikes",
    level: 1,
    caseNumber: "001",
    title: "The lightning repeat-strike claim",
    topic: "READING THE FULL CONTEXT",
    difficulty: "INTRODUCTORY",
    prompt: "Does a lightning strike make that location temporarily unavailable for another strike?",
    caseContext:
      "A familiar saying is being challenged. Both lawyers cite real descriptions of lightning, but one draws a conclusion the evidence does not support.",
    arguments: [
      {
        id: "unsupported",
        opening:
          "The NSSL says a lightning flash temporarily equalizes electrical charges. That means the location has been electrically discharged and cannot be hit again during the same storm system.",
        sourceTitle: "Frequently Asked Questions About Lightning",
        sourceOrganization: "NOAA National Severe Storms Laboratory",
        sourceUrl: "https://www.nssl.noaa.gov/education/svrwx101/lightning/faq/",
        sourceExcerpt:
          "This current flow temporarily equalizes the charged regions in the atmosphere...",
        sourceNote:
          "Open the full explanation and read the rest of this sentence. What happens after the temporary equalization?",
      },
      {
        id: "supported",
        opening:
          "The NSSL says lightning can strike the same spot more than once. It also explains that a site's height, terrain, and local conditions can make a repeat strike more likely.",
        sourceTitle: "Frequently Asked Questions About Lightning",
        sourceOrganization: "NOAA National Severe Storms Laboratory",
        sourceUrl: "https://www.nssl.noaa.gov/education/svrwx101/lightning/faq/",
        sourceExcerpt:
          "Taller objects are more likely than shorter objects to produce the upward channel.",
        sourceNote:
          "Find the question heading about repeat strikes, then read the explanation beneath it.",
      },
    ],
    correctArgumentId: "supported",
    feedback: {
      correctHeading: "You followed the evidence.",
      incorrectHeading: "One key phrase changes the meaning.",
      correctExplanation:
        "The supported argument is correct. The NSSL directly says lightning can hit the same spot more than once and describes factors that can make a location more likely to be struck.",
      incorrectExplanation:
        "The weaker argument leaves out the end of the NSSL sentence: opposite charges build up again. Temporary equalization does not prove a location is permanently or reliably protected from another strike. The NSSL's separate answer explicitly says repeat strikes happen.",
      skill: "Omission of context",
      takeaway:
        "A statement can quote a real source and still mislead when it leaves out the qualification that changes the conclusion.",
    },
  },
  {
    id: "earth-seasons-distance",
    level: 2,
    caseNumber: "002",
    title: "The distance-versus-seasons case",
    topic: "CORRELATION IS NOT CAUSATION",
    difficulty: "DEVELOPING",
    prompt: "Does Earth's changing distance from the Sun explain the seasons?",
    caseContext:
      "NASA reports that Earth is closest to the Sun in January and farthest away in July. One lawyer treats that fact as the explanation for seasonal temperature changes.",
    arguments: [
      {
        id: "unsupported",
        opening:
          "NASA confirms Earth's orbit brings it closer to the Sun in January and farther away in July. That distance change is therefore what creates winter and summer in the Northern Hemisphere.",
        sourceTitle: "What Is Earth?",
        sourceOrganization: "NASA — STEM Learning Resources",
        sourceUrl: "https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-earth/",
        sourceExcerpt:
          "Earth is nearest the sun ... in January ... and farthest ... in July.",
        sourceNote:
          "This passage gives a true orbital detail. Keep reading to see whether NASA says it causes the seasons.",
      },
      {
        id: "supported",
        opening:
          "NASA attributes the seasons to Earth's tilted axis, which changes how directly sunlight reaches each hemisphere. The opposite seasons in the two hemispheres are consistent with that explanation.",
        sourceTitle: "What Causes the Seasons?",
        sourceOrganization: "NASA Space Place",
        sourceUrl: "https://spaceplace.nasa.gov/seasons/en/",
        sourceExcerpt:
          "The sun's rays hit different parts of Earth more directly depending on the time of year.",
        sourceNote:
          "Read the lines immediately before this one to identify what changes the angle of sunlight.",
      },
    ],
    correctArgumentId: "supported",
    feedback: {
      correctHeading: "You separated a fact from its cause.",
      incorrectHeading: "The distance fact is real, but the conclusion does not follow.",
      correctExplanation:
        "The stronger argument is supported. Earth's distance from the Sun does vary, but NASA explains that the tilt of Earth's axis changes the angle of sunlight and causes the seasons. The Northern and Southern Hemispheres have opposite seasons.",
      incorrectExplanation:
        "The weaker argument cites a true detail about Earth's orbit but turns it into a cause without support. NASA notes that Earth is closest to the Sun in January, during Northern Hemisphere winter, and farthest in July, during Northern Hemisphere summer. That pattern contradicts the proposed explanation.",
      skill: "False cause / correlation",
      takeaway:
        "When two things change together, that alone does not establish that one caused the other. Look for the source's actual explanation.",
    },
  },
  {
    id: "bats-and-vision",
    level: 3,
    caseNumber: "003",
    title: "The bats-and-vision case",
    topic: "SELECTIVE EVIDENCE",
    difficulty: "DEVELOPING",
    prompt: "Does a bat's use of echolocation mean it cannot see?",
    caseContext:
      "A source describes how bats use sound to find prey in the dark. The dispute is whether that ability proves something about their eyesight.",
    arguments: [
      {
        id: "unsupported",
        opening:
          "The National Park Service explains that bats use echolocation to navigate and locate prey. Since sound does that work, their eyesight is effectively absent or unnecessary.",
        sourceTitle: "Echolocation",
        sourceOrganization: "National Park Service",
        sourceUrl: "https://www.nps.gov/subjects/bats/echolocation.htm",
        sourceExcerpt:
          "Bats navigate and find insect prey using echolocation.",
        sourceNote:
          "This page explains how echolocation works. Does it claim that echolocation is the only sense bats use?",
      },
      {
        id: "supported",
        opening:
          "The U.S. Geological Survey says bats are not blind: their small eyes have sensitive vision. Their eyesight varies, and it can work alongside echolocation.",
        sourceTitle: "Are Bats Blind?",
        sourceOrganization: "U.S. Geological Survey",
        sourceUrl: "https://www.usgs.gov/faqs/are-bats-blind",
        sourceExcerpt:
          "They don't have the sharp and colorful vision humans have, but they don't need that.",
        sourceNote:
          "Read the beginning of the answer too. What does the USGS say about whether bats can see at all?",
      },
    ],
    correctArgumentId: "supported",
    feedback: {
      correctHeading: "You spotted a selective quotation.",
      incorrectHeading: "One ability does not cancel out another.",
      correctExplanation:
        "The stronger argument is supported. The USGS says bats are not blind and describes their sensitive vision. Echolocation is another sensory tool; its use does not establish that bats cannot see.",
      incorrectExplanation:
        "The weaker argument takes a true fact—some bats use echolocation to find prey—and expands it into a claim about all eyesight. The National Park Service's explanation of echolocation is not evidence that bats have no functioning eyes; the USGS directly explains that bats can see.",
      skill: "Selective evidence / overgeneralization",
      takeaway:
        "A source explaining one feature does not prove that other features are absent. Check whether the writer has quietly changed 'also use' into 'only use.'",
    },
  },
  {
    id: "great-wall-from-space",
    level: 4,
    caseNumber: "004",
    title: "The Great Wall visibility case",
    topic: "MISSING QUALIFIERS",
    difficulty: "INTERMEDIATE",
    prompt: "Can the Great Wall be seen with the unaided eye from low Earth orbit?",
    caseContext:
      "NASA discusses photographs of the Great Wall taken from the International Space Station. The important details are how those images were captured and what 'visible' means.",
    arguments: [
      {
        id: "unsupported",
        opening:
          "NASA describes photographs of the Great Wall taken from the International Space Station. That confirms astronauts can identify the Wall from orbit with their own eyes.",
        sourceTitle: "Interesting Fact of the Month 2020",
        sourceOrganization: "NASA — Ames Research Center",
        sourceUrl:
          "https://www.nasa.gov/space-science-and-astrobiology-at-ames/interesting-fact-of-the-month-current/interesting-fact-of-the-month-2020/",
        sourceExcerpt:
          "Photos taken by Leroy Chiao from the International Space Station were determined to show small sections of the wall.",
        sourceNote:
          "Continue reading the paragraph about the camera and lens used to take those photographs.",
      },
      {
        id: "supported",
        opening:
          "NASA distinguishes a camera photograph from naked-eye visibility. It says the Wall is generally not visible to the unaided eye from low Earth orbit, and certainly not from the Moon.",
        sourceTitle: "Interesting Fact of the Month 2020",
        sourceOrganization: "NASA — Ames Research Center",
        sourceUrl:
          "https://www.nasa.gov/space-science-and-astrobiology-at-ames/interesting-fact-of-the-month-current/interesting-fact-of-the-month-2020/",
        sourceExcerpt:
          "Whether an object is visible varies significantly on the height above sea level from where it is observed.",
        sourceNote:
          "Read the earlier lines for NASA's specific statement about low Earth orbit and unaided vision.",
      },
    ],
    correctArgumentId: "supported",
    feedback: {
      correctHeading: "You noticed the missing condition.",
      incorrectHeading: "A camera image is not the same as naked-eye visibility.",
      correctExplanation:
        "The stronger argument is supported. NASA says the Wall is generally not visible to the unaided eye in low Earth orbit. The photographs discussed on the page were taken with camera lenses and under unusually favorable conditions.",
      incorrectExplanation:
        "The weaker argument turns 'photographed from the Space Station' into 'visible to astronauts without equipment.' NASA explains that a 180 mm lens was used for one image and a 400 mm lens for another possible image. The source separates camera photography from what a person can see unaided.",
      skill: "Missing qualifier / ambiguous wording",
      takeaway:
        "Words such as 'visible,' 'from space,' and 'photographed' can mean different things. Preserve the conditions and tools specified by the source.",
    },
  },
  {
    id: "ten-percent-brain-myth",
    level: 5,
    caseNumber: "005",
    title: "The ten-percent brain myth",
    topic: "QUANTIFIERS AND TIMING",
    difficulty: "INTERMEDIATE",
    prompt: "Does using 100% of the brain mean every part is active at the same time?",
    caseContext:
      "A neuroscience education source says people use all of their brains, but adds an important qualification about when different parts are active.",
    arguments: [
      {
        id: "unsupported",
        opening:
          "BrainFacts says people use 100 percent of their brains. Therefore, a healthy brain must have all of its regions active simultaneously during an ordinary task.",
        sourceTitle: "The Ten Percent Myth",
        sourceOrganization: "BrainFacts — Society for Neuroscience",
        sourceUrl:
          "https://www.brainfacts.org/thinking-sensing-and-behaving/thinking-and-awareness/2014/the-ten-percent-myth",
        sourceExcerpt:
          "We use 100 percent of our brain...",
        sourceNote:
          "Read the entire sentence and the following explanation. Look for a qualification about timing.",
      },
      {
        id: "supported",
        opening:
          "BrainFacts explains that all parts of the brain have roles, while the regions most active at a given moment depend on the task. 'All' does not mean 'all simultaneously.'",
        sourceTitle: "The Ten Percent Myth",
        sourceOrganization: "BrainFacts — Society for Neuroscience",
        sourceUrl:
          "https://www.brainfacts.org/thinking-sensing-and-behaving/thinking-and-awareness/2014/the-ten-percent-myth",
        sourceExcerpt:
          "Every part plays a role.",
        sourceNote:
          "Read the surrounding explanation about when different regions are active, not just how many parts are used.",
      },
    ],
    correctArgumentId: "supported",
    feedback: {
      correctHeading: "You preserved the qualification.",
      incorrectHeading: "The conclusion removes an important condition.",
      correctExplanation:
        "The stronger argument is supported. BrainFacts rejects the 10% myth but explicitly says people do not use all brain regions at once. The parts involved at a given moment depend on the task.",
      incorrectExplanation:
        "The weaker argument quotes the '100 percent' idea but ignores the same sentence's qualification: not all at once. Using all parts of the brain over time is not the same claim as every region being active simultaneously.",
      skill: "Quantifier shift / ignoring a qualifier",
      takeaway:
        "Pay attention to words such as 'all,' 'some,' 'at once,' and 'over time.' A small qualifier can completely change a statement's meaning.",
    },
  },
  {
    id: "antibiotics-and-colds",
    level: 6,
    caseNumber: "006",
    title: "The antibiotics-and-colds case",
    topic: "EXCEPTIONS VERSUS THE RULE",
    difficulty: "CHALLENGE",
    prompt: "Does the possibility of a bacterial complication mean antibiotics treat an ordinary viral cold?",
    caseContext:
      "The CDC explains both the general rule and a less common complication. One lawyer uses the exception to make a much broader claim.",
    arguments: [
      {
        id: "unsupported",
        opening:
          "The CDC notes that a viral illness can sometimes lead to a bacterial infection that needs antibiotics. This means antibiotics are a reasonable way to treat a cold before that complication develops.",
        sourceTitle: "Manage Common Cold",
        sourceOrganization: "Centers for Disease Control and Prevention",
        sourceUrl: "https://www.cdc.gov/common-cold/treatment/",
        sourceExcerpt:
          "There are rare cases when a viral infection can lead to a bacterial infection, like pneumonia, which requires antibiotics.",
        sourceNote:
          "Notice that the CDC names two different infections in this sentence. Read the rest of the page for its general rule about colds.",
      },
      {
        id: "supported",
        opening:
          "The CDC says antibiotics do not work on viruses, including the viruses that cause colds. A bacterial complication is a separate issue that requires a healthcare professional's diagnosis.",
        sourceTitle: "Healthy Habits: Antibiotic Do's and Don'ts",
        sourceOrganization: "Centers for Disease Control and Prevention",
        sourceUrl: "https://www.cdc.gov/antibiotic-use/about/index.html",
        sourceExcerpt:
          "Antibiotics ONLY treat certain infections caused by bacteria...",
        sourceNote:
          "Look at the CDC's separate list of infections they do not treat, and compare it with bacterial complications.",
      },
    ],
    correctArgumentId: "supported",
    feedback: {
      correctHeading: "You kept the exception in its proper place.",
      incorrectHeading: "A rare complication does not rewrite the general rule.",
      correctExplanation:
        "The stronger argument is supported. The CDC says antibiotics do not treat viral infections such as ordinary colds. The rare complication described on the other page is a separate bacterial infection, not evidence that antibiotics treat the original virus.",
      incorrectExplanation:
        "The weaker argument takes a rare possibility—a viral illness can sometimes be followed by a bacterial infection—and treats it as a reason to use antibiotics for the original cold. The CDC says antibiotics do not work against viruses and advises talking with a healthcare professional about treatment.",
      skill: "Exception-to-rule error / category confusion",
      takeaway:
        "An exception does not cancel the rule. Check whether the source is talking about the same condition, cause, and treatment before applying its conclusion.",
    },
  },
];

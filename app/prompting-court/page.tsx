import CourtPage from "@/components/CourtPage";

export default function PromptingCourtPage() {
  return (
    <CourtPage courtId="prompting">
      <p className="leading-relaxed text-base-content/75">
        Revise a vague request by naming the audience, task, source
        expectations, tone, and format.
      </p>
      <blockquote className="mt-6 border-l-2 border-primary/60 pl-5 font-display text-xl italic text-base-content">
        Explain the effect of photosynthesis to ninth-grade students in five
        short steps and cite the sources used.
      </blockquote>
    </CourtPage>
  );
}

import CourtPage from "@/components/CourtPage";

export default function EthicsCourtPage() {
  return (
    <CourtPage courtId="ethics">
      <p className="leading-relaxed text-base-content/75">
        A student uses AI to draft a recommendation for a scholarship
        committee. Identify the people affected, the evidence needed, and the
        final human decision-maker.
      </p>
      <p className="mt-6 font-semibold text-primary">
        Decision: AI may assist with drafting, but it should not make or conceal
        a consequential decision.
      </p>
    </CourtPage>
  );
}

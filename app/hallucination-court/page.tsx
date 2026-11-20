import CourtPage from "@/components/CourtPage";

export default function HallucinationCourtPage() {
  return (
    <CourtPage courtId="hallucination">
      <p className="leading-relaxed text-base-content/75">
        The Eiffel Tower is in Paris and opened to the public in 1889. Gustave
        Eiffel did not receive a Nobel Prize in Engineering.
      </p>
      <p className="mt-6 font-semibold text-primary">
        Objection: Which detail should be verified before it is repeated?
      </p>
    </CourtPage>
  );
}

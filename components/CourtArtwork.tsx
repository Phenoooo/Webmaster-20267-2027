import Image from "next/image";
import type { CourtId } from "@/lib/courts";

const courtImages: Record<CourtId, string> = {
  ethics: "/pexels-tahaasamett-7781900.jpg",
  prompting: "/pexels-ekaterina-bolovtsova-6077294.jpg",
  hallucination: "/pexels-mikhail-nilov-8731031.jpg",
};

export default function CourtArtwork({
  courtId,
  className = "",
  variant = "icon",
}: {
  courtId: CourtId;
  className?: string;
  variant?: "icon" | "detail";
}) {
  const showDiscussionImage =
    variant === "detail" &&
    (courtId === "hallucination" || courtId === "ethics");
  const artworkClassName = `court-artwork court-artwork-${courtId}${
    variant === "detail"
      ? " court-artwork-detail"
      : " court-artwork-photo"
  } ${className}`;

  return (
    <div
      className={artworkClassName}
      aria-hidden="true"
    >
      {variant === "icon" ? (
        <Image
          className="court-photo"
          src={courtImages[courtId]}
          alt=""
          fill
          sizes="(max-width: 650px) 100vw, (max-width: 900px) 35vw, 380px"
        />
      ) : showDiscussionImage ? (
        <Image
          className="court-figures"
          src="/courtroom-discussion.jpeg"
          alt=""
          width={772}
          height={274}
        />
      ) : (
        <>
          {courtId === "hallucination" && (
            <svg viewBox="0 0 240 220" fill="none">
              <path d="M55 150h113v28H55zM68 122h113v28H68zM82 94h113v28H82z" />
              <path d="M75 150v28M94 150v28M88 122v28M109 122v28M101 94v28M124 94v28" />
              <path d="M169 93h26M152 121h29M139 149h29" />
              <path d="M55 178h140M70 84h125" />
            </svg>
          )}
          {courtId === "prompting" && (
            <svg viewBox="0 0 240 220" fill="none">
              <circle cx="120" cy="68" r="31" />
              <path d="M61 194c4-42 24-67 59-67s55 25 59 67M82 146l38 30 38-30" />
              <path d="m105 137 15 18 15-18M120 155v39M102 49c5-17 31-23 45-7" />
              <path d="M96 60c4-14 14-21 26-21 13 0 23 7 27 21" />
            </svg>
          )}
          {courtId === "ethics" && (
            <svg viewBox="0 0 240 220" fill="none">
              <path d="M120 45v131M82 187h76M91 68h58M120 48l-4-10h8z" />
              <path d="m85 69-30 52h60L85 69ZM155 69l-30 52h60l-30-52Z" />
              <path d="M55 121c4 15 56 15 60 0M125 121c4 15 56 15 60 0" />
              <path d="M103 176h34" />
            </svg>
          )}
        </>
      )}
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  align = "left",
}: {
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
    </div>
  );
}

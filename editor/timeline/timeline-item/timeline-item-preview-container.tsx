export function TimelineItemPreviewContainer({
  children,
  style,
  isSelected,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
  isSelected: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute box-border rounded-2xl border border-black select-none ${isSelected ? "border-editor-starter-accent2 drop-shadow-editor-starter-accent2 border-3 drop-shadow-sm" : ""}`}
      style={{ ...style, overflow: "hidden" }}
    >
      {children}
    </div>
  );
}

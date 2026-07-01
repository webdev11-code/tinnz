import React from "react";

interface PageTitleProps {
  text: string;
  as?: "h1" | "h2" | "span";
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ text, as: Tag = "h1", className = "" }) => {
  const words = text.split(" ");
  const highlightIdx = words.length >= 2 && text.startsWith("Paket ") ? 1 : 0;

  if (words.length <= 1) {
    return <Tag className={`title-gradient ${className}`}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          {i > 0 && " "}
          <span className={i === highlightIdx ? "title-gradient" : "text-[var(--text-primary)]"}>
            {word}
          </span>
        </React.Fragment>
      ))}
    </Tag>
  );
};

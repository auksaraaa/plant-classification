import React from "react";

interface ScientificNameProps {
  name: string;
  className?: string;
}

export function ScientificName({ name, className = "" }: ScientificNameProps) {
  if (!name) return null;

  const words = name.split(" ");
  
  if (words.length <= 2) {
    return <span className={`italic ${className}`}>{name}</span>;
  }

  const italicPart = words.slice(0, 2).join(" ");
  const normalPart = words.slice(2).join(" ");

  return (
    <span className={className}>
      <span className="italic">{italicPart}</span> {normalPart}
    </span>
  );
}

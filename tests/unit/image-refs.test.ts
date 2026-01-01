import { describe, expect, it } from "vitest";
import { normalizeDraftContent } from "@/lib/drafts/service";
import type { ImageRef } from "@/lib/drafts/types";

const collectImages = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap(collectImages);
  }

  if (typeof value !== "object" || value === null) {
    return [];
  }

  const record = value as Record<string, unknown>;
  const images: string[] = [];

  if (record.type === "image") {
    const attrs = record.attrs as Record<string, unknown> | undefined;
    const src = attrs?.src;
    if (typeof src === "string") {
      images.push(src);
    }
  }

  if (Array.isArray(record.content)) {
    images.push(...collectImages(record.content));
  }

  return images;
};

describe("normalizeDraftContent", () => {
  it("removes images without matching refs", () => {
    const content = {
      type: "doc",
      content: [
        { type: "image", attrs: { src: "https://cdn.example.com/a.png" } },
        { type: "image", attrs: { src: "https://cdn.example.com/b.png" } },
      ],
    };

    const refs: ImageRef[] = [
      {
        assetId: "a",
        storageRef: "https://cdn.example.com/a.png",
        order: 1,
      },
    ];

    const normalized = normalizeDraftContent(content, refs);
    expect(collectImages(normalized)).toEqual(["https://cdn.example.com/a.png"]);
  });
});

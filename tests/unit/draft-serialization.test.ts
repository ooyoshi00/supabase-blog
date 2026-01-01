import { describe, expect, it } from "vitest";
import { buildDraftInput } from "@/lib/drafts/service";

const extractImageNodes = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap(extractImageNodes);
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
    images.push(...extractImageNodes(record.content));
  }

  return images;
};

describe("buildDraftInput", () => {
  it("filters invalid image nodes and collects refs", () => {
    const content = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "hello" }],
        },
        { type: "image", attrs: { src: "https://example.com/a.png" } },
        { type: "image", attrs: { src: "" } },
        { type: "image" },
      ],
    };

    const result = buildDraftInput(content);

    expect(result.imageRefs).toHaveLength(1);
    expect(result.imageRefs[0]?.storageRef).toBe("https://example.com/a.png");

    const imageNodes = extractImageNodes(result.content);
    expect(imageNodes).toEqual(["https://example.com/a.png"]);
  });
});

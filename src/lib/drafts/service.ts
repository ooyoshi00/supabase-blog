import type { DraftInput, ImageRef } from "./types";

type JsonValue = Record<string, unknown> | unknown[] | string | number | boolean | null;

const IMAGE_NODE_TYPE = "image";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isImageNode = (value: Record<string, unknown>) => value.type === IMAGE_NODE_TYPE;

const getImageSrc = (node: Record<string, unknown>) => {
  const attrs = node.attrs;
  if (!isRecord(attrs)) {
    return null;
  }

  const src = attrs.src;
  return typeof src === "string" && src.trim() !== "" ? src : null;
};

const sanitizeContent = (value: JsonValue): JsonValue => {
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeContent(item as JsonValue))
      .filter((item) => item !== null);
  }

  if (!isRecord(value)) {
    return value;
  }

  if (isImageNode(value)) {
    return getImageSrc(value) ? value : null;
  }

  if (Array.isArray(value.content)) {
    const sanitized = sanitizeContent(value.content as JsonValue);
    return { ...value, content: sanitized };
  }

  return value;
};

const collectImageRefs = (value: JsonValue, refs: ImageRef[]) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectImageRefs(item as JsonValue, refs));
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  if (isImageNode(value)) {
    const src = getImageSrc(value);
    if (src) {
      refs.push({
        assetId: src,
        storageRef: src,
        order: refs.length,
      });
    }
  }

  if (Array.isArray(value.content)) {
    collectImageRefs(value.content as JsonValue, refs);
  }
};

const applyImageRefPolicy = (value: JsonValue, allowedRefs: Set<string>): JsonValue => {
  if (Array.isArray(value)) {
    return value
      .map((item) => applyImageRefPolicy(item as JsonValue, allowedRefs))
      .filter((item) => item !== null);
  }

  if (!isRecord(value)) {
    return value;
  }

  if (isImageNode(value)) {
    const src = getImageSrc(value);
    if (!src || !allowedRefs.has(src)) {
      return null;
    }
  }

  if (Array.isArray(value.content)) {
    const sanitized = applyImageRefPolicy(value.content as JsonValue, allowedRefs);
    return { ...value, content: sanitized };
  }

  return value;
};

export const buildDraftInput = (rawContent: JsonValue): DraftInput => {
  const sanitizedContent = sanitizeContent(rawContent) as Record<string, unknown>;
  const imageRefs: ImageRef[] = [];
  collectImageRefs(sanitizedContent, imageRefs);

  return {
    content: sanitizedContent,
    imageRefs,
  };
};

export const normalizeDraftContent = (
  rawContent: JsonValue,
  imageRefs: ImageRef[],
) => {
  const allowedRefs = new Set(
    imageRefs
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((ref) => ref.storageRef),
  );
  return applyImageRefPolicy(rawContent, allowedRefs) as Record<string, unknown>;
};

const collapseWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const findFirstText = (value: JsonValue): string | null => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = findFirstText(item as JsonValue);
      if (text) {
        return text;
      }
    }
    return null;
  }

  if (!isRecord(value)) {
    return typeof value === "string" ? collapseWhitespace(value) : null;
  }

  if (value.type === "text" && typeof value.text === "string") {
    return collapseWhitespace(value.text);
  }

  if (Array.isArray(value.content)) {
    return findFirstText(value.content as JsonValue);
  }

  return null;
};

const findHeadingText = (value: JsonValue): string | null => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = findHeadingText(item as JsonValue);
      if (text) {
        return text;
      }
    }
    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  if (value.type === "heading") {
    const headingText = Array.isArray(value.content)
      ? findFirstText(value.content as JsonValue)
      : null;
    if (headingText) {
      return headingText;
    }
  }

  if (Array.isArray(value.content)) {
    return findHeadingText(value.content as JsonValue);
  }

  return null;
};

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
};

export const buildDraftPreview = (rawContent: JsonValue) => {
  const heading = findHeadingText(rawContent);
  const firstText = findFirstText(rawContent);
  const title = heading || firstText || "無題の下書き";
  const excerptSource = firstText || "";

  return {
    title,
    excerpt: excerptSource ? truncateText(excerptSource, 80) : "本文がまだありません",
  };
};

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

export const buildDraftInput = (rawContent: JsonValue): DraftInput => {
  const sanitizedContent = sanitizeContent(rawContent) as Record<string, unknown>;
  const imageRefs: ImageRef[] = [];
  collectImageRefs(sanitizedContent, imageRefs);

  return {
    content: sanitizedContent,
    imageRefs,
  };
};

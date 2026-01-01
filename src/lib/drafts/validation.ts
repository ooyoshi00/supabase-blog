import type { DraftInput } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isValidDraftInput = (value: unknown): value is DraftInput => {
  if (!isRecord(value)) {
    return false;
  }

  if (!isRecord(value.content)) {
    return false;
  }

  if (!Array.isArray(value.imageRefs)) {
    return false;
  }

  return value.imageRefs.every((ref) => {
    if (!isRecord(ref)) {
      return false;
    }

    return (
      typeof ref.assetId === "string" &&
      typeof ref.storageRef === "string" &&
      typeof ref.order === "number"
    );
  });
};

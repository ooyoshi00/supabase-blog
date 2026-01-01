import type { DraftInput } from "@/lib/drafts/types";
import type { Post } from "./types";

const POSTS_ENDPOINT = "/api/posts";

const parseError = async (response: Response) => {
  try {
    const body = await response.json();
    if (body?.error) {
      return String(body.error);
    }
  } catch {
    // ignore JSON parse errors
  }

  return response.statusText || "Request failed";
};

export const createPost = async (input: DraftInput) => {
  const response = await fetch(POSTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as Post;
};

export const publishDraft = async (draftId: string, input: DraftInput) => {
  const response = await fetch(`${POSTS_ENDPOINT}/drafts/${draftId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as Post;
};

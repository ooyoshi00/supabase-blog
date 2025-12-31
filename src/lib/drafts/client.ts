import type { Draft, DraftInput } from "./types";

const DRAFTS_ENDPOINT = "/api/drafts/me";

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

export const fetchDraft = async () => {
  const response = await fetch(DRAFTS_ENDPOINT, { method: "GET" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as Draft;
};

export const saveDraft = async (input: DraftInput) => {
  const response = await fetch(DRAFTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as Draft;
};

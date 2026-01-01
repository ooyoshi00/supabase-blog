import type { Draft, DraftInput } from "./types";

const DRAFTS_ENDPOINT = "/api/drafts";

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

const buildDraftEndpoint = (draftId: string) => `${DRAFTS_ENDPOINT}/${draftId}`;

export const fetchDraft = async (draftId: string) => {
  const response = await fetch(buildDraftEndpoint(draftId), { method: "GET" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as Draft;
};

export const createDraft = async (input: DraftInput) => {
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

export const updateDraft = async (draftId: string, input: DraftInput) => {
  const response = await fetch(buildDraftEndpoint(draftId), {
    method: "PATCH",
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

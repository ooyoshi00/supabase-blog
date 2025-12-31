import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Tiptap from "@/app/blogs/new/Editor";
import type { Draft } from "@/lib/drafts/types";

const mockEditor = () => {
  const run = vi.fn();
  const chainApi = {
    focus: () => ({
      toggleHeading: () => ({ run }),
      toggleBold: () => ({ run }),
      toggleStrike: () => ({ run }),
      toggleTaskList: () => ({ run }),
      toggleCodeBlock: () => ({ run }),
      toggleBulletList: () => ({ run }),
      toggleOrderedList: () => ({ run }),
      toggleBlockquote: () => ({ run }),
      extendMarkRange: () => ({
        unsetLink: () => ({ run }),
        setLink: () => ({ run }),
      }),
      setImage: () => ({ run }),
      undo: () => ({ run }),
      redo: () => ({ run }),
    }),
  };

  return {
    chain: () => chainApi,
    commands: {
      setContent: vi.fn(),
    },
    getJSON: vi.fn(() => ({ type: "doc", content: [] })),
    isActive: vi.fn(() => false),
  };
};

let editorInstance = mockEditor();

vi.mock("@tiptap/react", () => ({
  useEditor: () => editorInstance,
  EditorContent: () => null,
}));

const fetchDraft = vi.fn();
const saveDraft = vi.fn();

vi.mock("@/lib/drafts/client", () => ({
  fetchDraft: (...args: unknown[]) => fetchDraft(...args),
  saveDraft: (...args: unknown[]) => saveDraft(...args),
}));

describe("Tiptap editor integration", () => {
  beforeEach(() => {
    editorInstance = mockEditor();
    fetchDraft.mockReset();
    saveDraft.mockReset();
  });

  it("loads draft content and saves", async () => {
    const draft: Draft = {
      draftId: "draft-1",
      userId: "user-1",
      content: {
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: "hi" }] }],
      },
      imageRefs: [],
      updatedAt: new Date().toISOString(),
    };

    fetchDraft.mockResolvedValue(draft);
    saveDraft.mockResolvedValue(draft);

    render(<Tiptap />);

    await waitFor(() => {
      expect(fetchDraft).toHaveBeenCalledTimes(1);
      expect(editorInstance.commands.setContent).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(saveDraft).toHaveBeenCalledTimes(1);
    });
  });
});

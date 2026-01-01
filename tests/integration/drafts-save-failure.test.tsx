import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Tiptap from "@/app/blogs/new/Editor";

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
const createDraft = vi.fn();
const updateDraft = vi.fn();
const push = vi.fn();

vi.mock("@/lib/drafts/client", () => ({
  fetchDraft: (...args: unknown[]) => fetchDraft(...args),
  createDraft: (...args: unknown[]) => createDraft(...args),
  updateDraft: (...args: unknown[]) => updateDraft(...args),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("Tiptap editor save failure", () => {
  beforeEach(() => {
    editorInstance = mockEditor();
    fetchDraft.mockReset();
    createDraft.mockReset();
    updateDraft.mockReset();
    push.mockReset();
  });

  it("shows retry message when save fails", async () => {
    fetchDraft.mockResolvedValue(null);
    createDraft.mockRejectedValue(new Error("failure"));

    render(<Tiptap />);

    await waitFor(() => {
      expect(fetchDraft).toHaveBeenCalledTimes(0);
    });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(screen.getByText("保存に失敗しました。再試行してください")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "保存を再試行" })).toBeInTheDocument();
    });
  });
});

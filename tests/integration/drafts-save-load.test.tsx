import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import type { Draft } from "@/lib/drafts/types";
import Tiptap from "@/app/blogs/(protected)/new/Editor";

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

describe("Tiptap editor integration", () => {
  beforeEach(() => {
    editorInstance = mockEditor();
    fetchDraft.mockReset();
    createDraft.mockReset();
    updateDraft.mockReset();
    push.mockReset();
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
    updateDraft.mockResolvedValue(draft);

    render(<Tiptap draftId="draft-1" />);

    await waitFor(() => {
      expect(fetchDraft).toHaveBeenCalledTimes(1);
      expect(fetchDraft).toHaveBeenCalledWith("draft-1");
      expect(editorInstance.commands.setContent).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole("button", { name: "下書き保存" }));

    await waitFor(() => {
      expect(updateDraft).toHaveBeenCalledTimes(1);
      expect(updateDraft).toHaveBeenCalledWith(
        "draft-1",
        expect.objectContaining({ content: expect.any(Object) }),
      );
      expect(push).toHaveBeenCalledWith("/blogs/drafts");
    });
  });
});

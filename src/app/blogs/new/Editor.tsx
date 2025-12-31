"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import RichEditorToolbar from "@/app/blogs/new/EditorToolBar";
import { fetchDraft, saveDraft } from "@/lib/drafts/client";
import { buildDraftInput } from "@/lib/drafts/service";
import "./editor.scss";

const DEFAULT_CONTENT = "";
const STATUS_RESET_MS = 4000;

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: DEFAULT_CONTENT,
    // Do not immediately render on the server to avoid SSR hydration mismatches
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg m-5 focus:outline-none", // Tailwind Typography等のスタイル
      },
    },
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [canRetryLoad, setCanRetryLoad] = useState(false);

  const loadDraft = useCallback(async () => {
    if (!editor) {
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    setCanRetryLoad(false);

    try {
      const draft = await fetchDraft();
      if (draft?.content) {
        editor.commands.setContent(draft.content);
      } else {
        setStatusMessage("下書きが見つかりませんでした。再読み込みしてください");
        setCanRetryLoad(true);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        setStatusMessage("ログインしてください");
      } else {
        setStatusMessage("下書きの読み込みに失敗しました");
      }
      setCanRetryLoad(true);
    } finally {
      setIsLoading(false);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    void loadDraft();
  }, [editor, loadDraft]);

  const handleSave = async () => {
    if (!editor) {
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const input = buildDraftInput(editor.getJSON());
      await saveDraft(input);
      setStatusMessage("保存しました");
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        setStatusMessage("ログインしてください");
      } else {
        setStatusMessage("保存に失敗しました");
      }
    } finally {
      setIsSaving(false);
      window.setTimeout(() => {
        setStatusMessage(null);
      }, STATUS_RESET_MS);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-2/3 mt-10 mx-auto border-gray-500 border-2">
      <RichEditorToolbar editor={editor} onSave={handleSave} isSaving={isSaving} />
      {isLoading ? (
        <div className="px-4 py-2 text-sm text-gray-500">下書きを読み込み中...</div>
      ) : null}
      {statusMessage ? (
        <div className="px-4 py-2 text-sm text-gray-600">{statusMessage}</div>
      ) : null}
      {canRetryLoad ? (
        <div className="px-4 pb-2">
          <button
            type="button"
            onClick={loadDraft}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          >
            再読み込み
          </button>
        </div>
      ) : null}
      <div className="p-3 overflow-y-scroll h-[70vh] overflow-hidden mt-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;

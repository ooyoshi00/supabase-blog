"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { v4 as uuidv4 } from "uuid";
import RichEditorToolbar from "@/app/blogs/new/EditorToolBar";
import { createDraft, fetchDraft, updateDraft } from "@/lib/drafts/client";
import { createPost, publishDraft } from "@/lib/posts/client";
import { buildDraftInput, normalizeDraftContent } from "@/lib/drafts/service";
import { createClient } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import "./editor.scss";

const DEFAULT_CONTENT = "";
const STATUS_RESET_MS = 4000;
const IMAGE_BUCKET = "draft-images";

type EditorProps = {
  draftId?: string;
};

const Tiptap = ({ draftId }: EditorProps) => {
  const router = useRouter();
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
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canRetrySave, setCanRetrySave] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [canRetryLoad, setCanRetryLoad] = useState(false);

  const loadDraft = useCallback(async () => {
    if (!editor || !draftId) {
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    setCanRetryLoad(false);

    try {
      const draft = await fetchDraft(draftId);
      if (draft?.content) {
        const normalized = normalizeDraftContent(draft.content, draft.imageRefs ?? []);
        editor.commands.setContent(normalized);
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
  }, [draftId, editor]);

  useEffect(() => {
    if (!editor || !draftId) {
      return;
    }

    void loadDraft();
  }, [draftId, editor, loadDraft]);

  const handleSave = async () => {
    if (!editor) {
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    setCanRetrySave(false);
    try {
      const input = buildDraftInput(editor.getJSON());
      if (draftId) {
        await updateDraft(draftId, input);
      } else {
        await createDraft(input);
      }
      setStatusMessage("保存しました");
      router.push("/blogs/drafts");
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        setStatusMessage("ログインしてください");
      } else {
        setStatusMessage("保存に失敗しました。再試行してください");
        setCanRetrySave(true);
      }
    } finally {
      setIsSaving(false);
      if (!canRetrySave) {
        window.setTimeout(() => {
          setStatusMessage(null);
        }, STATUS_RESET_MS);
      }
    }
  };

  const handlePublish = async () => {
    if (!editor) {
      return;
    }

    setIsPublishing(true);
    setStatusMessage(null);

    try {
      const input = buildDraftInput(editor.getJSON());
      if (draftId) {
        await publishDraft(draftId, input);
      } else {
        await createPost(input);
      }
      setStatusMessage("公開しました");
      router.push("/blogs");
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        setStatusMessage("ログインしてください");
      } else {
        setStatusMessage("公開に失敗しました。再試行してください");
      }
    } finally {
      setIsPublishing(false);
      window.setTimeout(() => {
        setStatusMessage(null);
      }, STATUS_RESET_MS);
    }
  };

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        setStatusMessage("画像ファイルを選択してください");
        return;
      }

      setIsUploading(true);
      setStatusMessage(null);

      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        setStatusMessage("ログインしてください");
        setIsUploading(false);
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}${fileExt ? `.${fileExt}` : ""}`;
      const filePath = `drafts/${data.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        setStatusMessage("画像のアップロードに失敗しました");
        setIsUploading(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from(IMAGE_BUCKET)
        .getPublicUrl(filePath);

      if (!publicData?.publicUrl) {
        setStatusMessage("画像URLの取得に失敗しました");
        setIsUploading(false);
        return;
      }

      editor.chain().focus().setImage({ src: publicData.publicUrl }).run();
      setStatusMessage("画像を挿入しました");
      window.setTimeout(() => {
        setStatusMessage(null);
      }, STATUS_RESET_MS);
      setIsUploading(false);
    },
    [editor],
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="w-2/3 mt-10 mx-auto">
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          下書き保存
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center gap-1 rounded border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-800"
        >
          公開する
        </button>
      </div>
      <div className="border-gray-500 border-2">
        <RichEditorToolbar
          editor={editor}
          onImageUpload={handleImageUpload}
          isUploading={isUploading}
        />
        {isLoading ? (
          <div className="px-4 py-2 text-sm text-gray-500">下書きを読み込み中...</div>
        ) : null}
        {statusMessage ? (
          <div className="px-4 py-2 text-sm text-gray-600">{statusMessage}</div>
        ) : null}
        {canRetrySave ? (
          <div className="px-4 pb-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              保存を再試行
            </button>
          </div>
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
    </div>
  );
};

export default Tiptap;

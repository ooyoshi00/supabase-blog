import { Editor } from "@tiptap/react";
import { useCallback, useRef } from "react";
import { AiOutlineLink } from "react-icons/ai";
import {
  MdCode,
  MdFormatBold,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatStrikethrough,
  MdImage,
  MdRedo,
  MdTaskAlt,
  MdTitle,
  MdUndo,
} from "react-icons/md";

const RichEditorToolbar = ({
  editor,
  onImageUpload,
  isUploading,
}: {
  editor: Editor;
  onImageUpload: (file: File) => void;
  isUploading: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    // cancelled
    if (url === null) {
      return;
    }
    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }
    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onImageUpload(file);
      }
      event.target.value = "";
    },
    [onImageUpload],
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-600 p-4 text-2xl">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-sm"
      >
        <MdImage />
        画像
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          !editor.isActive("heading", { level: 1 }) ? "opacity-20" : ""
        }
      >
        <MdTitle />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={!editor.isActive("bold") ? "opacity-50 text-black" : ""}
      >
        <MdFormatBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={!editor.isActive("strike") ? "opacity-20" : ""}
      >
        <MdFormatStrikethrough />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={!editor.isActive("taskList") ? "opacity-20" : ""}
      >
        <MdTaskAlt />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={!editor.isActive("codeBlock") ? "opacity-20" : ""}
      >
        <MdCode />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={!editor.isActive("bulletList") ? "opacity-20" : ""}
      >
        <MdFormatListBulleted />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={!editor.isActive("orderedList") ? "opacity-20" : ""}
      >
        <MdFormatListNumbered />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={!editor.isActive("blockquote") ? "opacity-20" : ""}
      >
        <MdFormatQuote />
      </button>
      <button
        type="button"
        onClick={setLink}
        className={!editor.isActive("link") ? "opacity-20" : ""}
      >
        <AiOutlineLink />
      </button>

      <button onClick={() => editor.chain().focus().undo().run()} type="button">
        <MdUndo />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} type="button">
        <MdRedo />
      </button>
    </div>
  );
};

export default RichEditorToolbar;

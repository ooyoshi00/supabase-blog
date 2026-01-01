"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { CalendarIcon } from "lucide-react";

type BlogPostProps = {
  title: string;
  publishedAtLabel: string;
  content: Record<string, unknown>;
};

const BlogPost = ({ title, publishedAtLabel, content }: BlogPostProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1>
      <div className="flex items-center mb-6 text-gray-600">
        <CalendarIcon className="w-4 h-4 text-gray-400 mr-1" />
        <time className="text-gray-600">{publishedAtLabel}</time>
      </div>
      <div className="prose prose-zinc max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default BlogPost;

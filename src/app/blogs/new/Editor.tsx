'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import RichEditorToolbar from '@/app/blogs/new/EditorToolBar'
import "./editor.scss"
const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '<p>Hello World! 🌎️</p><img src="https://placehold.co/800x400" />',
    // Do not immediately render on the server to avoid SSR hydration mismatches
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg m-5 focus:outline-none', // Tailwind Typography等のスタイル
      },
    },
  })
    
if (!editor) {
    return null
  }

    return (
          <div className="w-2/3 mt-10 mx-auto border-gray-500 border-2">
        <RichEditorToolbar editor={editor} />
        <div className="p-3 overflow-y-scroll h-[70vh] overflow-hidden mt-3">
            <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default Tiptap
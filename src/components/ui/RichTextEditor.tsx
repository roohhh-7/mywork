"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Heading1, Heading2, Heading3, Heading4, Highlighter, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

const COLORS = [
  '#fde047', // yellow
  '#bbf7d0', // green
  '#bfdbfe', // blue
  '#fbcfe8', // pink
  '#e5e7eb', // gray
];

export function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[300px] max-w-none text-zinc-800'
      }
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expose updating content to parents if needed, but usually uncontrolled with initial value is fine.
  // Note: TipTap handles its own state, so we don't need to useEffect sync unless content changes externally.

  if (!editor) return null;

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          editor?.chain().focus().setImage({ src: event.target.result }).run();
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950 shadow-sm flex flex-col h-full">
      <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
        <Button
          variant="ghost" size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("h-8 w-8 dark:text-zinc-300", editor.isActive('bold') && "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost" size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("h-8 w-8 dark:text-zinc-300", editor.isActive('italic') && "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50")}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <Button
          variant="ghost" size="icon"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn("h-8 w-8 font-serif text-sm font-medium dark:text-zinc-300", editor.isActive('paragraph') && "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50")}
        >
          P
        </Button>
        <Button
          variant="ghost" size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn("h-8 w-8 dark:text-zinc-300", editor.isActive('heading', { level: 1 }) && "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50")}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost" size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("h-8 w-8 dark:text-zinc-300", editor.isActive('heading', { level: 2 }) && "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50")}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost" size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn("h-8 w-8 dark:text-zinc-300", editor.isActive('heading', { level: 3 }) && "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50")}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {COLORS.map(color => (
          <Button
            key={color}
            variant="ghost" size="icon"
            onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
            className={cn(
              "h-7 w-7 rounded-full ml-1",
              editor.isActive('highlight', { color }) ? "ring-2 ring-zinc-900 dark:ring-zinc-100 ring-offset-1 dark:ring-offset-zinc-950" : ""
            )}
            style={{ backgroundColor: color }}
          >
            <span className="sr-only">Highlight {color}</span>
          </Button>
        ))}
        <Button
          variant="ghost" size="icon"
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          className={cn("h-7 w-7 ml-1 dark:text-zinc-300", !editor.isActive('highlight') && "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50")}
          title="Clear Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <Button
          variant="ghost" size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 w-8"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
      </div>

      <div className="p-4 flex-1 overflow-y-auto cursor-text text-sm" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

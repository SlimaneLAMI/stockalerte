'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2, Undo, Redo } from 'lucide-react';

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[200px] outline-none text-sm leading-relaxed',
      },
    },
  });

  const btnCls = (active) =>
    `w-8 h-8 flex items-center justify-center rounded-sm transition-colors ${
      active
        ? 'bg-[var(--orange)] text-white'
        : 'hover:bg-[var(--muted)] text-[var(--muted-foreground)]'
    }`;

  if (!editor) return null;

  return (
    <div className="rounded-sm border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-1 px-3 py-2 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnCls(editor.isActive('bold'))}>
          <Bold size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnCls(editor.isActive('italic'))}>
          <Italic size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnCls(editor.isActive('heading'))}>
          <Heading2 size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnCls(editor.isActive('bulletList'))}>
          <List size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnCls(editor.isActive('orderedList'))}>
          <ListOrdered size={13} />
        </button>
        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--border)' }} />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnCls(false)}>
          <Undo size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnCls(false)}>
          <Redo size={13} />
        </button>
      </div>
      <div className="px-4 py-3" style={{ color: 'var(--foreground)', backgroundColor: 'var(--card)' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

"use client";

import { Toggle } from "@/components/ui/toggle";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
// import { useEffect } from "react"
import { useFormContext } from "react-hook-form";
import { Placeholder } from "@tiptap/extension-placeholder";
import { useEffect } from "react";

const Tiptap = ({ val }: { val: string }) => {
  const { setValue } = useFormContext();
  const editor = useEditor({
    extensions: [
      Placeholder.configure({
        placeholder: "Add a Description for Your Products",
        emptyNodeClass:
          "first:before:text-gray-600 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
      }),
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-4" },
        },
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-4" },
        },
      }),
    ],

    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setValue("description", content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    content: val,
  });

  useEffect(() => {
    if (editor?.isEmpty) editor.commands.setContent(val);
  }, [val]);

  return (
    <div className="flex flex-col gap-2">
      {editor && (
        <div className="border-input border rounded-md flex flex-row gap-1 bg-secondary">
          <Toggle
            className="border border-slate-400"
            pressed={editor.isActive("bold")}
            size={"sm"}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Toggle>
          <Toggle
            className="border border-slate-400"
            pressed={editor.isActive("italic")}
            size={"sm"}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </Toggle>
          <Toggle
            className="border border-slate-400"
            pressed={editor.isActive("strike")}
            size={"sm"}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="w-4 h-4" />
          </Toggle>
          <Toggle
            className="border border-slate-400"
            pressed={editor.isActive("orderedList")}
            size={"sm"}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListOrdered className="w-4 h-4" />
          </Toggle>
          <Toggle
            className="border border-slate-400"
            pressed={editor.isActive("bulletList")}
            size={"sm"}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <List className="w-4 h-4" />
          </Toggle>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;

"use client";

import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";

function Btn({ on, onClick, title, children, disabled }: { on?: boolean; onClick: () => void; title: string; children: React.ReactNode; disabled?: boolean }) {
  return <button type="button" title={title} aria-label={title} aria-pressed={on} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-[14px] font-semibold transition disabled:opacity-30 ${on ? "bg-ink text-white" : "text-ink/75 hover:bg-cream hover:text-ink"}`}>{children}</button>;
}
export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData(); fd.append("file", file);
  const res = await fetch("/api/admin/upload/", { method: "POST", body: fd });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(d.error ?? "Upload failed.");
  return d.url as string;
}

const Sep = () => <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />;

export function Toolbar({ editor }: { editor: Editor }) {
  const c = () => editor.chain().focus();
  const link = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link address (https://…). Leave empty to remove the link.", prev ?? "https://");
    if (url === null) return;
    if (!url.trim() || url.trim() === "https://") c().extendMarkRange("link").unsetLink().run();
    else c().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const upload = async (f?: File | null) => {
    if (!f) return;
    setUploading(true);
    try { const src = await uploadImage(f); c().setImage({ src, alt: window.prompt("Describe the image (for accessibility)", "") ?? "" }).run(); }
    catch (e) { window.alert(e instanceof Error ? e.message : "Upload failed."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };
  const imageUrl = () => { const url = window.prompt("Image address (must start with https://)"); if (url?.startsWith("https://")) c().setImage({ src: url, alt: window.prompt("Describe the image (for accessibility)") ?? "" }).run(); };
  return (
    <div role="toolbar" aria-label="Formatting" className="sticky top-14 z-20 flex flex-wrap items-center gap-0.5 rounded-t-2xl border-b border-line bg-white/95 p-2 backdrop-blur">
      <Btn title="Undo (Ctrl+Z)" onClick={() => c().undo().run()} disabled={!editor.can().undo()}>↶</Btn>
      <Btn title="Redo (Ctrl+Shift+Z)" onClick={() => c().redo().run()} disabled={!editor.can().redo()}>↷</Btn>
      <Sep />
      <Btn title="Normal text" on={editor.isActive("paragraph")} onClick={() => c().setParagraph().run()}>¶</Btn>
      <Btn title="Heading" on={editor.isActive("heading", { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}>H2</Btn>
      <Btn title="Sub-heading" on={editor.isActive("heading", { level: 3 })} onClick={() => c().toggleHeading({ level: 3 }).run()}>H3</Btn>
      <Sep />
      <Btn title="Bold (Ctrl+B)" on={editor.isActive("bold")} onClick={() => c().toggleBold().run()}><b>B</b></Btn>
      <Btn title="Italic (Ctrl+I)" on={editor.isActive("italic")} onClick={() => c().toggleItalic().run()}><i>I</i></Btn>
      <Btn title="Underline (Ctrl+U)" on={editor.isActive("underline")} onClick={() => c().toggleUnderline().run()}><u>U</u></Btn>
      <Btn title="Strikethrough" on={editor.isActive("strike")} onClick={() => c().toggleStrike().run()}><s>S</s></Btn>
      <Btn title="Inline code" on={editor.isActive("code")} onClick={() => c().toggleCode().run()}>{"</>"}</Btn>
      <Sep />
      <Btn title="Bulleted list" on={editor.isActive("bulletList")} onClick={() => c().toggleBulletList().run()}>• List</Btn>
      <Btn title="Numbered list" on={editor.isActive("orderedList")} onClick={() => c().toggleOrderedList().run()}>1. List</Btn>
      <Btn title="Quote" on={editor.isActive("blockquote")} onClick={() => c().toggleBlockquote().run()}>“ ”</Btn>
      <Btn title="Code block" on={editor.isActive("codeBlock")} onClick={() => c().toggleCodeBlock().run()}>{"{ }"}</Btn>
      <Btn title="Divider line" onClick={() => c().setHorizontalRule().run()}>—</Btn>
      <Sep />
      <Btn title="Add or edit a link" on={editor.isActive("link")} onClick={link}>Link</Btn>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => upload(e.target.files?.[0])} />
      <Btn title="Upload an image (or drag one into the text)" disabled={uploading} onClick={() => fileRef.current?.click()}>{uploading ? "Uploading…" : "Image"}</Btn>
      <Btn title="Insert an image from a web address" onClick={imageUrl}>Image URL</Btn>
      <Btn title="Clear formatting" onClick={() => c().unsetAllMarks().clearNodes().run()}>Clear</Btn>
    </div>
  );
}


// One configured editor, shared by the blog editor and the newsletter composer.
export function useRichEditor({ initialHtml, onChange, placeholder, minHeight = "30rem" }: { initialHtml?: string; onChange: (html: string) => void; placeholder?: string; minHeight?: string }) {
  return useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer nofollow" } } }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing. Tip: type ## for a heading, - for a list, > for a quote." }),
      CharacterCount, Image,
    ],
    content: initialHtml ?? "",
    editorProps: {
      attributes: { class: "prose-blog px-5 py-5 sm:px-8 sm:py-7 outline-none", style: `min-height:${minHeight}`, "aria-label": "Body" },
      // Dropping or pasting an image uploads it and puts it in the text.
      handleDrop: (view, ev) => { const f = ev.dataTransfer?.files?.[0]; if (!f?.type.startsWith("image/")) return false; ev.preventDefault(); const pos = view.posAtCoords({ left: ev.clientX, top: ev.clientY })?.pos; uploadImage(f).then((src) => view.dispatch(view.state.tr.insert(pos ?? view.state.selection.from, view.state.schema.nodes.image.create({ src, alt: "" })))).catch((e) => window.alert(e.message)); return true; },
      handlePaste: (view, ev) => { const f = [...(ev.clipboardData?.files ?? [])].find((x) => x.type.startsWith("image/")); if (!f) return false; ev.preventDefault(); uploadImage(f).then((src) => view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({ src, alt: "" })))).catch((e) => window.alert(e.message)); return true; },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
}

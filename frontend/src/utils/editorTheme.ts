import { EditorView } from "@codemirror/view";
import { HighlightStyle, tags as t } from "@codemirror/highlight";
import { syntaxHighlighting } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";


export function getTheme(theme: "light" | "dark") {
  return theme === "dark" ? oneDark : EditorView.theme({}, { dark: false });
}

export function getThemeExtension() {
  const tailwindDarkTheme = EditorView.theme(
    {
      "&": {
        backgroundColor: "#171717", // Tailwind bg-neutral-900
        //color: "#f4f4f5",           // Tailwind text-neutral-100
        height: "100%",
      },
      ".cm-content": {
        caretColor: "#f4f4f5",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "#f4f4f5",
      },
      "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "#3f3f46", // Tailwind bg-neutral-800
      },
      ".cm-gutters": {
        backgroundColor: "#171717",
        color: "#a3a3a3", // Tailwind text-neutral-400
        border: "none",
      },
    },
    { dark: true }
  );

  const highlightStyle = HighlightStyle.define([
    { tag: t.keyword, color: "#22d3ee" }, // cyan-400
    { tag: [t.name, t.deleted, t.character, t.propertyName], color: "#f87171" }, // red-400
    { tag: [t.variableName], color: "#e4e4e7" }, // zinc-200
    { tag: [t.string, t.meta], color: "#86efac" }, // green-300
    { tag: [t.function(t.variableName)], color: "#c4b5fd" }, // purple-300
    { tag: [t.number], color: "#facc15" }, // yellow-400
    { tag: [t.comment], color: "#71717a", fontStyle: "italic" }, // zinc-500
  ]);

  return [tailwindDarkTheme, syntaxHighlighting(highlightStyle)];
}

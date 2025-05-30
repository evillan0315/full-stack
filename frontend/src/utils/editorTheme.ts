import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";

export function getTheme(theme: "light" | "dark") {
  return theme === "dark" ? oneDark : EditorView.theme({}, { dark: false });
}

export function getThemeExtension() {
  const tailwindDarkTheme = EditorView.theme(
    {
      "&": {
        backgroundColor: "#171717",
        height: "100%",
      },
      ".cm-content": {
        caretColor: "#f4f4f5",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "#f4f4f5",
      },
      "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "#3f3f46",
      },
      ".cm-gutters": {
        backgroundColor: "#171717",
        color: "#a3a3a3",
        border: "none",
      },
    },
    { dark: true }
  );

  const highlightStyle = HighlightStyle.define([
    { tag: t.keyword, color: "#22d3ee" },
    { tag: [t.name, t.deleted, t.character, t.propertyName], color: "#f87171" },
    { tag: [t.variableName], color: "#e4e4e7" },
    { tag: [t.string, t.meta], color: "#86efac" },
    { tag: [t.function(t.variableName)], color: "#c4b5fd" },
    { tag: [t.number], color: "#facc15" },
    { tag: [t.comment], color: "#71717a", fontStyle: "italic" },
  ]);

  return [tailwindDarkTheme, syntaxHighlighting(highlightStyle)];
}


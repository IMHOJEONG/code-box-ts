import { javascript } from "@codemirror/lang-javascript";
import { lintGutter } from "@codemirror/lint";
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

// export const myTheme = createTheme({
//       settings: {
//             background: "#ffffff",
//             backgroundImage: "",
//             caret: "#5d00ff",
//             foreground: "#75baff",
//             gutterBackground: "#fff",
//             gutterForeground: "#8a919966",
//             lineHighlight: "#8a91991a",
//             selection: "#036dd626",
//             selectionMatch: "#036dd626",
//       },
//       styles: [
//             { color: "#787b8099", tag: t.comment },
//             { color: "#0080ff", tag: t.variableName },
//             { color: "#5c6166", tag: [t.string, t.special(t.brace)] },
//             { color: "#5c6166", tag: t.number },
//             { color: "#5c6166", tag: t.bool },
//             { color: "#5c6166", tag: t.null },
//             { color: "#5c6166", tag: t.keyword },
//             { color: "#5c6166", tag: t.operator },
//             { color: "#5c6166", tag: t.className },
//             { color: "#5c6166", tag: t.definition(t.typeName) },
//             { color: "#5c6166", tag: t.typeName },
//             { color: "#5c6166", tag: t.angleBracket },
//             { color: "#5c6166", tag: t.tagName },
//             { color: "#5c6166", tag: t.attributeName },
//       ],
//       theme: "light",
// });
export const extensions = [javascript({ jsx: true, typescript: true }), lintGutter()];

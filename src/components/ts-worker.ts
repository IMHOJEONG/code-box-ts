import * as ts from "typescript";

function getIndexFromLineAndCharacter(code: string, line: number, character: number): number {
      const lines = code.split("\n");
      let index = 0;
      for (let i = 0; i < line; i++) {
            index += lines[i].length + 1; // +1 for newline
      }
      return index + character;
}

self.onmessage = (event) => {
      const code = event.data.code;
      const fileName = "file.ts";

      const sourceFile = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true);

      const options: ts.CompilerOptions = {
            module: ts.ModuleKind.ESNext,
            strict: true,
            target: ts.ScriptTarget.ESNext,
      };

      const compilerHost: ts.CompilerHost = {
            fileExists: (filePath) => filePath === fileName,
            getCanonicalFileName: (fileName) => fileName,
            getCurrentDirectory: () => "",
            getDefaultLibFileName: () => "lib.d.ts",
            getDirectories: () => [],
            getNewLine: () => "\n",
            getSourceFile: (name) => (name === fileName ? sourceFile : undefined),
            readFile: (filePath) => (filePath === fileName ? code : undefined),
            useCaseSensitiveFileNames: () => true,
            writeFile: () => {},
      };

      const program = ts.createProgram([fileName], options, compilerHost);
      const diagnostics = [...program.getSyntacticDiagnostics(), ...program.getSemanticDiagnostics()];

      const flatDiagnostics = diagnostics.map((d) => {
            const max = code.length;
            const start = Math.min(d.start ?? 0, max);
            const length = Math.min(d.length ?? 1, max - start);
            console.log(`[DIAG] from: ${start}, to: ${start + length}, code length: ${code.length}`);

            return {
                  from: start,
                  to: start + length,
                  message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
                  severity: "error",
                  //   line: line,
                  //   character: character
            };
      });

      self.postMessage({ diagnostics: flatDiagnostics });
};

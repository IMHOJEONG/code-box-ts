import { type Diagnostic, linter } from "@codemirror/lint";
import { githubDark } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useEffect, useRef, useState } from "react";
import { extensions } from "../share/code-theme";
import { CodeRunningResult } from "./code-running-result";

interface CodeBoxProps {
      code: string;
}

export const CodeBox = ({ code }: CodeBoxProps) => {
      const [newCode, setCode] = useState(code);
      const workerRef = useRef<Worker | null>(null);

      const [diagnostic, setDiagnostic] = useState<Diagnostic[]>([]);

      // 워커 초기화
      useEffect(() => {
            const worker = new Worker(new URL("./lint-worker.ts", import.meta.url), {
                  type: "module",
            });
            workerRef.current = worker;

            worker.onmessage = (e) => {
                  const data = e.data;
                  if (data.error) {
                        console.error("Lint error:", data.error);
                  } else {
                        console.log("Received diagnostics:", data.diagnostics);
                        // setDiagnostic(data.diagnostics);
                  }
            };

            return () => worker.terminate();
      }, []);

      // 코드 변경 시 워커에 전송
      useEffect(() => {
            if (workerRef.current) {
                  workerRef.current.postMessage({ code: newCode });
            }
      }, [newCode]);

      console.log(diagnostic);
      const externalLinter = linter((view) => {
            const maxLen = view.state.doc.length;
            return diagnostic.filter((d) => d.from >= 0 && d.to <= maxLen && d.from <= d.to);
      });

      const onChange = useCallback((value: string) => {
            setCode(value);
      }, []);

      return (
            <>
                  <CodeMirror
                        value={newCode}
                        height="200px"
                        theme={githubDark}
                        extensions={[...extensions, externalLinter]}
                        onChange={onChange}
                  />
                  <CodeRunningResult code={newCode} diagnostic={diagnostic} setDiagnostic={setDiagnostic} />
            </>
      );
};

import type { Diagnostic } from "@codemirror/lint";
import { useEffect, useRef } from "react";

interface CodeRunningResultProps {
      code: string;
      diagnostic: Diagnostic[];
      setDiagnostic: (data: Diagnostic[]) => void;
}

export const CodeRunningResult = ({ code, diagnostic, setDiagnostic }: CodeRunningResultProps) => {
      const workerRef = useRef<Worker | null>(null);

      useEffect(() => {
            // 워커 생성 (최초 1회만)
            const worker = new Worker(new URL("./ts-worker.ts", import.meta.url), {
                  type: "module",
            });
            workerRef.current = worker;

            // 메시지 수신
            worker.onmessage = (e) => {
                  const { diagnostics } = e.data;
                  setDiagnostic(diagnostics);
            };

            return () => {
                  worker.terminate();
            };
      }, [setDiagnostic]);

      useEffect(() => {
            // code prop이 바뀔 때마다 워커에 전송
            if (workerRef.current) {
                  workerRef.current.postMessage({ code });
            }
      }, [code]);

      return (
            <div>
                  <h3>Diagnostics</h3>
                  <div>
                        {diagnostic?.length === 0
                              ? "No errors 🎉"
                              : diagnostic?.map((d) => (
                                      <div key={d.from}>
                                            {/* Line {d.line}, Char {d.character}: {d.message} */}
                                            Line {d.from}, Char {d.to}: {d.message}
                                      </div>
                                ))}
                  </div>
            </div>
      );
};

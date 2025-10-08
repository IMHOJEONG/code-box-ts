import initSwc, { parse } from "@swc/wasm-web";
import wasmUrl from "@swc/wasm-web/wasm_bg.wasm?url";

// SWC 초기화
const swcInitPromise = initSwc(wasmUrl);

// 간단한 AST 순회 함수 - any 타입 찾기
function findAnyTypes(node: any, results: any[] = []) {
      if (node?.typeAnnotation?.typeAnnotation?.type === "TsAnyKeyword" || node?.type === "TsAnyKeyword") {
            results.push({
                  from: node.span?.start || 0,
                  message: `'any' type is not allowed.`,
                  severity: "warning",
                  to: node.span?.end || 0,
            });
      }

      for (const key in node) {
            const value = node[key];
            if (Array.isArray(value)) {
                  value.forEach((child) => {
                        if (typeof child === "object" && child !== null) {
                              findAnyTypes(child, results);
                        }
                  });
            } else if (typeof value === "object" && value !== null) {
                  findAnyTypes(value, results);
            }
      }

      return results;
}

self.onmessage = async (e: MessageEvent<{ code: string }>) => {
      try {
            await swcInitPromise;

            const code = e.data.code;

            const ast = parse(code, {
                  decorators: false,
                  dynamicImport: false,
                  syntax: "typescript",
                  tsx: false,
            });

            const diagnostics = findAnyTypes(ast);

            self.postMessage({ diagnostics });
      } catch (error: any) {
            self.postMessage({ error: error.message || String(error) });
      }
};

import { CodeBox } from "@/components/code-box";
import "./variable.scss";

const testCode = `const num: number = "hello";
function greet(name: string) {
  return name.toUppercase()
}
`;
const code = "console.log('hello world!');\n";

export const VariablePage = () => {
      return (
            <div className="variable-page">
                  <CodeBox code={testCode} />
                  <CodeBox code={code} />
                  <CodeBox code={code} />
                  <CodeBox code={code} />
            </div>
      );
};

import { create } from "zustand";

import { type Diagnostic } from "@codemirror/lint";

interface DiagnosticStore {
      diagnostic: Diagnostic[];
}
interface DiagnosticAction {
      setDiagnostic: (state: Diagnostic[]) => void;
}

export const useDiagnosticStore = create<DiagnosticStore & DiagnosticAction>((set) => ({
      diagnostic: [],
      setDiagnostic: (data) =>
            set(() => ({
                  diagnostic: data,
            })),
}));

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import { Draft, Result, freshDraft, demoDraft } from "../domain/model";
import {
  FilingDraft,
  FilingReceipt,
  freshFiling,
  createFilingReceipt,
} from "../domain/filing";
type Session = {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  identity: boolean;
  setIdentity: (v: boolean) => void;
  result: Result | null;
  setResult: (v: Result | null) => void;
  filing: FilingDraft | null;
  setFiling: React.Dispatch<React.SetStateAction<FilingDraft | null>>;
  filingReceipt: FilingReceipt | null;
  submitFiling: () => void;
  demo: () => void;
  reset: () => void;
};
const Context = createContext<Session | null>(null);
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState(freshDraft);
  const [identity, setIdentity] = useState(false);
  const [result, setResultState] = useState<Result | null>(null);
  const [filing, setFiling] = useState<FilingDraft | null>(null);
  const [filingReceipt, setFilingReceipt] = useState<FilingReceipt | null>(
    null,
  );
  function setResult(value: Result | null) {
    setResultState(value);
    setFiling(value?.favorable ? freshFiling(draft, value) : null);
    setFilingReceipt(null);
  }
  function submitFiling() {
    if (!identity || !result || !filing)
      throw new Error(
        "Inicia sesión con una preaprobación vigente para radicar.",
      );
    if (filingReceipt?.resultId === result.id) return;
    setFilingReceipt(createFilingReceipt(filing, result, draft.profile));
  }
  const objectUrls = useRef(new Set<string>());
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const current = new Set(
      [
        ...Object.values(draft.documents),
        ...Object.values(filing?.documents || {}),
        ...Object.values(filingReceipt?.snapshot.documents || {}),
      ].flatMap((file) => (file?.uri.startsWith("blob:") ? [file.uri] : [])),
    );
    objectUrls.current.forEach((uri) => {
      if (!current.has(uri)) URL.revokeObjectURL(uri);
    });
    objectUrls.current = current;
  }, [draft.documents, filing?.documents, filingReceipt?.snapshot.documents]);
  useEffect(
    () => () => {
      if (Platform.OS === "web")
        objectUrls.current.forEach((uri) => URL.revokeObjectURL(uri));
    },
    [],
  );
  function reset() {
    setDraft(freshDraft());
    setIdentity(false);
    setResult(null);
  }
  function demo() {
    setDraft(demoDraft());
    setIdentity(true);
    setResult(null);
  }
  return (
    <Context.Provider
      value={{
        draft,
        setDraft,
        identity,
        setIdentity,
        result,
        setResult,
        filing,
        setFiling,
        filingReceipt,
        submitFiling,
        demo,
        reset,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useSession() {
  const s = useContext(Context);
  if (!s) throw new Error("SessionProvider missing");
  return s;
}

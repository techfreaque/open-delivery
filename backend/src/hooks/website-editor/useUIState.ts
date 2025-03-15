import { create } from "zustand";

interface UIInput {
  input: string;
  imageBase64: string;
  loading: boolean;
  uiType: UiType;
  setInput: (val: string) => void;
  setLoading: (val: boolean) => void;
  setImageBase64: (val: string) => void;
  setUIType: (val: string) => void;
}

export const useUIState = create<UIInput>((set) => ({
  input: "",
  imageBase64: "",
  loading: false,
  uiType: "shadcn-react",
  setInput: (val): void => set(() => ({ input: val })),
  setLoading: (val): void => set(() => ({ loading: val })),
  setImageBase64: (val): void => set(() => ({ imageBase64: val })),
  setUIType: (val): void => set(() => ({ uiType: val })),
}));

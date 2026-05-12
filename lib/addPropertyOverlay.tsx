import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { View } from "react-native";

type AddPropertyOverlayContextValue = {
  open: boolean;
  editId?: string;
  openOverlay: (editId?: string) => void;
  closeOverlay: () => void;
  blurTargetRef: React.RefObject<View | null>;
};

const AddPropertyOverlayContext = createContext<AddPropertyOverlayContextValue | null>(null);

export function AddPropertyOverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const blurTargetRef = useRef<View | null>(null);

  const openOverlay = useCallback((id?: string) => {
    setEditId(id);
    setOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setOpen(false);
    setEditId(undefined);
  }, []);

  const value = useMemo<AddPropertyOverlayContextValue>(
    () => ({ open, editId, openOverlay, closeOverlay, blurTargetRef }),
    [open, editId, openOverlay, closeOverlay],
  );

  return <AddPropertyOverlayContext.Provider value={value}>{children}</AddPropertyOverlayContext.Provider>;
}

export function useAddPropertyOverlay() {
  const ctx = useContext(AddPropertyOverlayContext);
  if (!ctx) {
    throw new Error("useAddPropertyOverlay must be used within an AddPropertyOverlayProvider");
  }
  return ctx;
}

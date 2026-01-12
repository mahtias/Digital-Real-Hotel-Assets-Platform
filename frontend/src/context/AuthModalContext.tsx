import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("login");

  const openAuthModal = (tab = "login") => {
    setDefaultTab(tab);
    setIsOpen(true);
  };

  const closeAuthModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider
      value={{ isOpen, defaultTab, openAuthModal, closeAuthModal }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside AuthModalProvider");
  return ctx;
}

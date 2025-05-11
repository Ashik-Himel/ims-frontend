"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";

export default function ToastContainerComp() {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === "system" ? (isDarkMode ? "dark" : "light") : theme}
      transition={Bounce}
    />
  );
}

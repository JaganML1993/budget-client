import React, { useState, useEffect } from "react";
import { ThemeContext, themes } from "contexts/ThemeContext";

export default function ThemeContextWrapper(props) {
  // Initialize theme from localStorage, defaulting to dark theme if not set
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark" ? themes.dark : themes.light;
  });

  function changeTheme(newTheme) {
    setTheme(newTheme);
    // Save the new theme to localStorage
    localStorage.setItem("theme", newTheme === themes.dark ? "dark" : "light");
  }

  useEffect(() => {
    // Apply the theme class to the body
    if (theme === themes.light) {
      document.body.classList.add("white-content");
    } else {
      document.body.classList.remove("white-content");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

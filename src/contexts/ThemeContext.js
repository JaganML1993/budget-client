import React, { createContext, useState, useEffect } from "react";

export const themes = {
  dark: "", // You can add a class for dark theme if needed
  light: "white-content",
};

export const ThemeContext = createContext({
  theme: themes.dark,
  changeTheme: () => { },
});

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark" ? themes.dark : themes.light
  );

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme === themes.dark ? "dark" : "light");
  };

  useEffect(() => {
    // Ensure the theme is set on the body or a parent element
    document.body.className = theme; // Apply the class to the body for styling
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

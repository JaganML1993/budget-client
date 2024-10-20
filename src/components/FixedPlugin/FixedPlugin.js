import React, { useEffect, useState } from "react";
import { Dropdown, DropdownToggle, Badge } from "reactstrap";
import { ThemeContext, themes } from "contexts/ThemeContext";
import { backgroundColors } from "contexts/BackgroundColorContext";

function FixedPlugin(props) {
  const [dropDownIsOpen, setdropDownIsOpen] = useState(false);
  const [bgColor, setBgColor] = useState(
    localStorage.getItem("bgColor") || backgroundColors.blue
  ); // Set initial bgColor from localStorage
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark" ? themes.dark : themes.light
  ); // Set initial theme from localStorage

  const handleClick = () => {
    setdropDownIsOpen(!dropDownIsOpen);
  };

  const handleBgClick = (color) => {
    setBgColor(color);
    localStorage.setItem("bgColor", color);
    props.handleBgClick(color); // Propagate the change if needed
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme === themes.dark ? "dark" : "light");
  };

  useEffect(() => {
    props.handleBgClick(bgColor); // Ensure parent component is updated
  }, [bgColor, props]);

  return (
    <div className="fixed-plugin">
      <Dropdown isOpen={dropDownIsOpen} toggle={handleClick}>
        <DropdownToggle tag="div">
          <i className="fa fa-cog fa-2x" />
        </DropdownToggle>
        <ul className="dropdown-menu show">
          <li className="header-title">SIDEBAR BACKGROUND</li>
          <li className="adjustments-line">
            <div className="badge-colors text-center">
              <Badge
                color="primary"
                className={bgColor === backgroundColors.primary ? "active" : ""}
                onClick={() => handleBgClick(backgroundColors.primary)}
              />{" "}
              <Badge
                color="info"
                className={bgColor === backgroundColors.blue ? "active" : ""}
                onClick={() => handleBgClick(backgroundColors.blue)}
              />{" "}
              <Badge
                color="success"
                className={bgColor === backgroundColors.green ? "active" : ""}
                onClick={() => handleBgClick(backgroundColors.green)}
              />{" "}
            </div>
          </li>
          <li className="adjustments-line text-center color-change">
            <ThemeContext.Consumer>
              {({ changeTheme }) => (
                <>
                  <span className="color-label">LIGHT MODE</span>{" "}
                  <Badge
                    className="light-badge mr-2"
                    onClick={() => {
                      handleThemeChange(themes.light);
                      changeTheme(themes.light);
                    }}
                  />{" "}
                  <Badge
                    className="dark-badge ml-2"
                    onClick={() => {
                      handleThemeChange(themes.dark);
                      changeTheme(themes.dark);
                    }}
                  />{" "}
                  <span className="color-label">DARK MODE</span>{" "}
                </>
              )}
            </ThemeContext.Consumer>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}

export default FixedPlugin;

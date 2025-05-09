import React, { useEffect, useState } from "react";
import css from "./SideBar.module.css";
import { NavLink } from "react-router-dom";
import { throttle } from "../utils/feature";

const SideBar = () => {
  const [isOn, setIsOn] = useState(false);

  const addClassOn = () => {
    setIsOn(!isOn);
  };

  const handleResize = throttle(() => {
    if (window.innerWidth > 1100) {
      setIsOn(false);
    }
  }, 1000);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div className={isOn ? `${css.sideBarCon} ${css.on}` : css.sideBarCon}>
      <div className={css.icon}>
        <img src="/img/icon_mini.png" />
      </div>
      <div className={css.sideBarList}>
        <CustomNavLink to="profile" label="My Git" icon="bi-person-fill" />
        <CustomNavLink
          to="organization"
          label="Organization1"
          icon="bi-people-fill"
        />
        <CustomNavLink
          to="organization2"
          label="Organization2"
          icon="bi-people-fill"
        />
        <CustomNavLink
          to="organization3"
          label="Organization3"
          icon="bi-people-fill"
        />
        <CustomNavLink
          to="organization4"
          label="Organization4"
          icon="bi-people-fill"
        />
        <CustomNavLink
          to="organization5"
          label="Organization5"
          icon="bi-people-fill"
        />
      </div>
    </div>
  );
};

const CustomNavLink = ({ to, label, icon }) => (
  <NavLink
    className={({ isActive }) => (isActive ? `${css.active}` : "")}
    to={to}
  >
    <i className={`bi ${icon}`}></i>
    <p> {label}</p>
  </NavLink>
);

export default SideBar;

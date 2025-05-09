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
        <img src="./img/icon_mini.png" />
      </div>
      <div className={css.sideBarList}>
        <CustomNavLink to={"/"} label={"My Git"} icon={"bi-person-fill"} />
        <CustomNavLink
          to={"/organizaiton"}
          label={"Organization_1"}
          icon={"bi-people-fill"}
        />
        <CustomNavLink
          to={"/organizaiton2"}
          label={"Organization_2"}
          icon={"bi-people-fill"}
        />
        <CustomNavLink
          to={"/organizaiton3"}
          label={"Organization_3"}
          icon={"bi-people-fill"}
        />
        <CustomNavLink
          to={"/organizaiton4"}
          label={"Organization_4"}
          icon={"bi-people-fill"}
        />
        <CustomNavLink
          to={"/organizaiton5"}
          label={"Organization_5"}
          icon={"bi-people-fill"}
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

import React from "react";
import { Outlet } from "react-router-dom";
import SideTab from "./SideBar";
import "./index.css";
import css from "./DefaultLayout.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const DefaultLayout = () => {
  return (
    <div className={css.defaultLayout}>
      <SideTab />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;

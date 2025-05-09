import React from "react";
import { Outlet } from "react-router-dom";

import "./index.css";
import css from "./DefaultLayout.module.css";

export const DefaultLayout = () => {
  return (
    <div className={css.defaultLayout}>
      <Outlet />
    </div>
  );
};

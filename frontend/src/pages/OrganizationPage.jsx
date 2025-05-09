import React from "react";
import css from "./OrganizationPage.module.css";
import { useParams } from "react-router-dom";

const OrganizationPage = () => {
  const { id, name } = useParams();
  console.log(id, name);

  return (
    <div>
      <h1>Hi, {name}</h1>
      <div className={css.container}>
        <div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;

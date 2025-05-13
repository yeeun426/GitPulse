import React from "react";
import css from "./OneLineComment.module.css";

const OneLineComment = ({ comment }) => (
  <div className={css.wrapper}>
    <p className={css.text}>{comment}</p>
  </div>
);

export default OneLineComment;

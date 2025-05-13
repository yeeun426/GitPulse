import React, { useEffect, useState } from "react";
import css from "./SideBar.module.css";
import { NavLink } from "react-router-dom";
import { throttle } from "../utils/feature";
import { useOrganizationList } from "../apis/useOrganizationApi";

const SideBar = () => {
  const [isOn, setIsOn] = useState(false); // 반응형에 필요 (아직 미적용)

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

  const username = localStorage.getItem("username");

  const { data: groupList, isLoading, isError } = useOrganizationList(username);
  console.log(groupList);

  isLoading && <p>Loading</p>;
  isError && <p>에러 발생</p>;

  return (
    <div className={isOn ? `${css.sideBarCon} ${css.on}` : css.sideBarCon}>
      <div className={css.icon}>
        <a href="/profile">
          <img src="/img/icon_mini.png" />
        </a>
      </div>
      <div className={css.sideBarList}>
        <CustomNavLink
          to={"/profile"}
          label={"My Git"}
          icon={"bi-person-fill"}
        />
        {groupList?.map((group) => (
          <CustomNavLink
            key={group.id}
            to={`/org/${group.id}/${group.login}`}
            label={group.login}
            icon={"bi-people-fill"}
          />
        ))}
        <div className={css.divider}></div>
        <CustomNavLink to={"/news"} label={"IT News"} icon={"bi-newspaper"} />
        <CustomNavLink
          to={"/test"}
          label={"개발자 유형 테스트"}
          icon={"bi-emoji-smile"}
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

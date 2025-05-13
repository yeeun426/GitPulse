import React from "react";
import badge1 from "../assets/2025년 5월 9일 오전 09_46_53 1.svg";
import badge2 from "../assets/image 6.svg";
import badge3 from "../assets/image 7.svg";
import badge4 from "../assets/image 7.svg";
import css from "./Badges.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const badgeImages = [badge1, badge2, badge3, badge4];
const Badges = () => {
  const groups = [];
  for (let i = 0; i < badgeImages.length; i += 3) {
    groups.push(badgeImages.slice(i, i + 3));
  }

  return (
    <div
      id="badgeCarousel"
      className={`carousel slide ${css.carouselWrapper}`}
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {groups.map((group, idx) => (
          <div
            key={idx}
            className={`carousel-item ${idx === 0 ? " active" : ""}`}
          >
            <div className={css.carouselCard}>
              {" "}
              {/* ← 이 컨테이너에 flex-row */}
              {group.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`badge-${idx * 3 + i}`}
                  className={css.badgeImage}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#badgeCarousel"
        data-bs-slide="prev"
      >
        <i className={`bi bi-chevron-left ${css.arrow}`} />
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#badgeCarousel"
        data-bs-slide="next"
      >
        <i className={`bi bi-chevron-right ${css.arrow}`} />
      </button>
    </div>
  );
};

export default Badges;

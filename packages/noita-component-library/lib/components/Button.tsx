import css from "./Button.module.css";
import arrowLeft from "../../../assets/icons/keyboard_cursor_left_active.png";
import arrowRight from "../../../assets/icons/keyboard_cursor_right_active.png";
import React, { MutableRefObject, useRef } from "react";

interface ButtonProps {
  children?: string | React.ReactNode | React.ReactNode[];
  decoration?: "left" | "right" | "both";
  disabled?: boolean;
  onClick?: () => void;
  onDisabledClick?: () => void;
}

export const Button = ({
  children,
  onClick,
  decoration,
  disabled,
  onDisabledClick,
}: ButtonProps) => {
  const iconSize = 6;
  const buttonRef = useRef<HTMLButtonElement>();

  const buttonOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const isMouseClick = e.detail > 0;
    if (isMouseClick) {
      buttonRef.current?.blur();
    }

    if (disabled && typeof onDisabledClick === "function") {
      onDisabledClick();
      return;
    }

    if (disabled) return;

    if (typeof onClick === "function") {
      onClick();
    } else {
      console.error("button not implemented");
    }
  };

  const leftButton =
    decoration === "left" || decoration === "both" || decoration === undefined;
  const rightButton = decoration === "right" || decoration === "both";

  return (
    <div className={css["container"]}>
      <button
        className={css["button-content"]}
        onClick={buttonOnClick}
        ref={buttonRef as MutableRefObject<HTMLButtonElement>}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {leftButton && (
          <span
            className={`${css["icon-container"]} ${css["icon-container-left"]}`}
          >
            <img
              src={arrowLeft}
              height={iconSize * 2}
              width={iconSize}
              className={css["icon"]}
              alt={"Button Arrow"}
            />
          </span>
        )}

        <span
          style={{
            color: disabled ? "#FFFFFFAA" : "inherit",
          }}
        >
          {children}
        </span>

        {rightButton && (
          <span
            className={`${css["icon-container"]} ${css["icon-container-right"]}`}
          >
            <img
              src={arrowRight}
              height={iconSize * 2}
              width={iconSize}
              className={css["icon"]}
              alt={"Button Arrow"}
            />
          </span>
        )}
      </button>
    </div>
  );
};

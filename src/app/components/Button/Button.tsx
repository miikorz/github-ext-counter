import React from "react";
import styles from "./button.module.scss";
import cn from "classnames";

export interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
}: ButtonProps) => (
  <button
    type="button"
    className={cn(styles.button, { [styles.disabled]: disabled })}
    onClick={onClick}
  >
    {label}
  </button>
);

export default Button;

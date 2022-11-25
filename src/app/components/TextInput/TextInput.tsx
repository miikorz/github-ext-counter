import React, { useState } from "react";
import styles from "./textInput.module.scss";
import cn from "classnames";

export interface TextInputProps {
  placeholder: string;
  maxLength: number;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  label,
  maxLength,
  onChange,
  disabled,
}: TextInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const onHandleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
    setInputValue(value);
  };
  return (
    <div className={styles.formGroup}>
      {label && <span>{label}</span>}
      <input
        className={cn(styles.formField, { [styles.disabled]: disabled })}
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={onHandleChangeInput}
        maxLength={maxLength}
        disabled={disabled}
      />
    </div>
  );
};

export default TextInput;

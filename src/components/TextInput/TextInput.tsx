import React, { useState } from "react";
import styles from "./textInput.module.scss";

export interface TextInputProps {
  placeholder: string;
  label: string;
  maxLength: number;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  label,
  maxLength,
  onChange,
}: TextInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const onHandleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
    setInputValue(value);
  };
  return (
    <div className={styles.formGroup}>
      <span>{label}</span>
      <input
        className={styles.formField}
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={onHandleChangeInput}
        maxLength={maxLength}
      />
    </div>
  );
};

export default TextInput;

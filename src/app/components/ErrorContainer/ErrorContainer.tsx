import React from "react";
import styles from "./errorContainer.module.scss";

export interface ErrorContainerProps {
  children: string;
}

const ErrorContainer: React.FC<ErrorContainerProps> = ({
  children,
}: ErrorContainerProps) => (
  <div className={styles.errorContainer}>
    <div className={styles.text}>{children}</div>
  </div>
);

export default ErrorContainer;

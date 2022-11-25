import React from "react";
import ExtensionsObject from "../../../domain/interfaces/extensionsObject";
import styles from "./listContainer.module.scss";

export interface ListContainerProps {
  extensions: ExtensionsObject;
}

const ListContainer: React.FC<ListContainerProps> = ({
  extensions,
}: ListContainerProps) => (
  <div className={styles.list}>
    <ol className={styles.ol}>
      {Object.keys(extensions).map((key, index) => (
        <li className={styles.item} key={index}>
          <span className={styles.text}>
            .{key} ({extensions[key]})
          </span>
        </li>
      ))}
    </ol>
  </div>
);

export default ListContainer;

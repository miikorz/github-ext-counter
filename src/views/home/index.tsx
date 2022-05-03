import React, { useEffect, useState, useCallback } from "react";
import { makeRequest } from "../../utils/api/request";
import { endPoints } from "../../utils/api/endpoints";
import TextInput from "../../components/TextInput";
import styles from "./home.module.scss";
import Button from "../../components/Button";
import getExtensionListFromTree from "../../utils/helpers";
import ExtensionsObject from "../../utils/interfaces/extensionsObject";
import {
  RepositoryFile,
  TreeApiResponse,
} from "../../utils/interfaces/apiResult";

const Home: React.FC = () => {
  const [extensionList, setExtensionList] = useState<ExtensionsObject>();
  const [repoOwner, setRepoOwner] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");
  const [fileList, setFileList] = useState<RepositoryFile[]>([]);
  let branchName: string;
  let globalFileList: RepositoryFile[] = [];

  const handleOnChangeOwner = (value: string) => {
    setRepoOwner(value);
  };

  const handleOnChangeRepo = (value: string) => {
    setRepoName(value);
  };

  const handleOnButtonClick = () => {
    if (repoOwner && repoName) {
      makeRequest(endPoints.getRepoBranches(repoOwner, repoName)).then(
        (res: any) => {
          // We get the first branch on the repo
          branchName = res[0].name;
          getBranchTree(branchName);
        }
      );
    }
  };

  const getBranchTree = useCallback(
    (branchName: string) => {
      makeRequest(endPoints.getExtensionList(repoOwner, repoName, branchName))
        .then((res: TreeApiResponse | undefined) => {
          if (res?.tree) {
            globalFileList = [...globalFileList, ...res.tree];
            setFileList([...globalFileList]);
          }
          const shaArray: string[] | undefined = res?.tree
            .filter((item: RepositoryFile) => item.type === "tree")
            .map((i: RepositoryFile) => i.sha);
          if (shaArray?.length) {
            shaArray.forEach((sha: string) => getBranchTree(sha));
          }
        })
        .catch((error) => {
          // TODO: better error display
          console.log(error)
        });
    },
    [globalFileList, repoName, repoOwner]
  );

  const isButtonDisabled = (): boolean => {
    if (repoOwner && repoName) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (fileList?.length) {
      setExtensionList(getExtensionListFromTree(fileList));
    }
  }, [fileList]);

  return (
    <div className={styles.home}>
      <div className={styles.formContainer}>
        <TextInput
          label="Owner"
          placeholder="Type the repo owner here!"
          maxLength={64}
          onChange={handleOnChangeOwner}
        />
        <TextInput
          label="Repository"
          placeholder="Type the repo name here!"
          maxLength={120}
          onChange={handleOnChangeRepo}
        />
        <Button
          label="Get extensions!"
          onClick={handleOnButtonClick}
          disabled={isButtonDisabled()}
        />
      </div>
      <div className={styles.resultContainer}>
        {extensionList && <div>This repository contains the following amount of extensions:</div>}
        {extensionList && Object.keys(extensionList).map((key, index) => (
          <div key={index}>
            {key} ({extensionList[key]})
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

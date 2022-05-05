import React, { useEffect, useState, useCallback } from "react";
import { makeRequest } from "../../utils/api/request";
import { endPoints } from "../../utils/api/endpoints";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import getExtensionListFromTree from "../../utils/helpers";
import ExtensionsObject from "../../utils/interfaces/extensionsObject";
import ErrorContainer from "../../components/ErrorContainer/index";
import {
  RepositoryFile,
  TreeApiResponse,
} from "../../utils/interfaces/apiResult";
import ListContainer from "../../components/ListContainer";
import logo from "../../assets/githublogo.png";
import styles from "./home.module.scss";
import BranchResponse from "../../utils/interfaces/branch";

const Home: React.FC = () => {
  const [extensionList, setExtensionList] = useState<ExtensionsObject>();
  const [repoOwner, setRepoOwner] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");
  const [fileList, setFileList] = useState<RepositoryFile[]>([]);
  const [displayError, setDisplayError] = useState<boolean>(false);
  let branchName: string;
  let globalFileList: RepositoryFile[] = [];

  const handleOnChangeOwner = (value: string) => {
    setRepoOwner(value);
  };

  const handleOnChangeRepo = (value: string) => {
    setRepoName(value);
  };

  const handleError = () => {
    setDisplayError(true);
    setExtensionList({});
  };

  const handleOnButtonClick = () => {
    if (repoOwner && repoName) {
      setDisplayError(false);
      makeRequest(endPoints.getRepoBranches(repoOwner, repoName))
        .then((res: BranchResponse[] | undefined) => {
          // We get the first branch on the repo
          if (res) {
            branchName = res[0].name;
            getBranchTree(branchName);
          }
        })
        .catch(() => {
          handleError();
        });
    }
  };

  const getBranchTree = useCallback(
    (branchName: string) => {
      makeRequest(endPoints.getExtensionList(repoOwner, repoName, branchName))
        .then((res: TreeApiResponse | undefined) => {
          if (res?.tree) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
        .catch(() => {
          handleError();
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

  const handleOnSearch = (value: string) => {
    if (value && extensionList) {
      setExtensionList(
        Object.fromEntries(
          Object.entries(extensionList).filter(([key]) => key.includes(value))
        )
      );
    } else {
      setExtensionList(getExtensionListFromTree(fileList));
    }
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
      <div
        className={styles.resultContainer}
        style={{ backgroundImage: `url(${logo})` }}
      >
        <div className={styles.searchInputContainer}>
          <TextInput
            placeholder="Search for an extension!"
            maxLength={4}
            onChange={handleOnSearch}
            disabled={!extensionList || displayError}
          />
        </div>
        {extensionList && !displayError && (
          <div>
            {Object.keys(extensionList).length > 0 && (
              <div className={styles.descriptionText}>
                This repository contains the following amount of extensions:
              </div>
            )}
            <ListContainer extensions={extensionList}></ListContainer>
          </div>
        )}
        {displayError && (
          <ErrorContainer>
            API returned an error, either the owner or repository doesn't exist or you exceeded the number of allowed requests!
          </ErrorContainer>
        )}
      </div>
    </div>
  );
};

export default Home;

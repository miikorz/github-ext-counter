import React, { useState } from "react";
import { httpGET } from "../../../infrastructure/api/httpClient";
import { endPoints } from "../../../infrastructure/api/repositories/github/endpoints";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import ErrorContainer from "../../components/ErrorContainer/index";
import ListContainer from "../../components/ListContainer";
import logo from "../../assets/githublogo.png";
import styles from "./home.module.scss";
import useBranchTree from "../../customHooks/useBranchTree";
import BranchResponse from "../../../infrastructure/api/repositories/github/branch";

const Home: React.FC = () => {
  const [repoOwner, setRepoOwner] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");
  let branchName: string;

  const {
    getBranchTree,
    extensionList,
    setExtensionList,
    displayError,
    setDisplayError,
  } = useBranchTree(repoName, repoOwner);

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
      httpGET<BranchResponse[]>(endPoints.getRepoBranches(repoOwner, repoName))
        .then((res: BranchResponse[]) => {
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

  const isButtonDisabled = (): boolean => {
    if (repoOwner && repoName) {
      return false;
    }
    return true;
  };

  // TODO: move this to useBranchTree
  // const handleOnSearch = (value: string) => {
  //   if (value && extensionList) {
  //     setExtensionList(
  //       Object.fromEntries(
  //         Object.entries(extensionList).filter(([key]) => key.includes(value))
  //       )
  //     );
  //   } else {
  //     const extensions = new Extensions(fileList);
  //     setExtensionList(extensions.groupByType());
  //   }
  // };

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
          {/* // TODO: move search onChange on customHook */}
          <TextInput
            placeholder="Search for an extension!"
            maxLength={4}
            onChange={() => {}}
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
            API returned an error, either the owner or repository doesn't exist
            or you exceeded the number of allowed requests!
          </ErrorContainer>
        )}
      </div>
    </div>
  );
};

export default Home;

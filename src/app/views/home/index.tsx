import React, { useState } from "react";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import ErrorContainer from "../../components/ErrorContainer/index";
import ListContainer from "../../components/ListContainer";
import logo from "../../assets/githublogo.png";
import styles from "./home.module.scss";
import useExtensionList from "../../customHooks/useExtensionList";

const Home: React.FC = () => {
  const [repoOwner, setRepoOwner] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");

  const { handleOnClick, extensionList, handleOnSearch, displayError } =
    useExtensionList(repoName, repoOwner);

  const isButtonDisabled = (): boolean => {
    if (repoOwner && repoName) {
      return false;
    }
    return true;
  };

  return (
    <div className={styles.home}>
      <div className={styles.formContainer}>
        <TextInput
          label="Owner"
          placeholder="Type the repo owner here!"
          maxLength={64}
          onChange={setRepoOwner}
        />
        <TextInput
          label="Repository"
          placeholder="Type the repo name here!"
          maxLength={120}
          onChange={setRepoName}
        />
        <Button
          label="Get extensions!"
          onClick={handleOnClick}
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
          <>
            {Object.keys(extensionList).length > 0 && (
              <div className={styles.descriptionText}>
                This repository contains the following amount of extensions:
              </div>
            )}
            <ListContainer extensions={extensionList}></ListContainer>
          </>
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

import { useCallback, useContext, useState } from "react";
import { Extensions } from "../../domain/Extensions";
import ExtensionsObject from "../../domain/interfaces/ExtensionsObject";
import VersionManagerContext from "../context/versionManagerContext";
import { RepoValues } from "../views/home";
import { VersionManager } from "../../domain/VersionManager";
import { config } from "../../config";

const useExtensionList = ({ repoName, repoOwner }: RepoValues) => {
  const [extensionList, setExtensionList] = useState<ExtensionsObject>();
  const [displayError, setDisplayError] = useState<boolean>(false);
  const isRepoInfoFilled: boolean = Boolean(repoOwner && repoName);
  const isButtonDisabled: boolean = isRepoInfoFilled ? false : true;
  const context = useContext(VersionManagerContext);

  const handleError = () => {
    setDisplayError(true);
    setExtensionList({});
  };

  const getExtensionList = useCallback(() => {
    setDisplayError(false);

    // * No matter the repository selected, we will always have a getExtensions method which will return an Extensions object

    // ? instead of using context, we can use:
    // ? new VersionManager(config.selectedRepository).getRepository()...
    context
      .versionManagerRepository()
      .getExtensions(repoName, repoOwner)
      .then((extensions: Extensions) => {
        setExtensionList(extensions.groupByType());
      })
      .catch(() => {
        handleError();
      });
  }, [context, repoName, repoOwner]);

  const handleOnClick = () => {
    if (isRepoInfoFilled) {
      getExtensionList();
    }
  };

  const handleOnSearch = (value: string) => {
    if (value && extensionList) {
      setExtensionList(
        Object.fromEntries(
          Object.entries(extensionList).filter(([key]) => key.includes(value))
        )
      );
    } else {
      getExtensionList();
    }
  };

  return {
    handleOnClick,
    extensionList,
    handleOnSearch,
    displayError,
    isButtonDisabled,
  };
};

export default useExtensionList;

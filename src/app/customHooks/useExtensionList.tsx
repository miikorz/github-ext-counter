import { useCallback, useContext, useState } from "react";
import { Extensions } from "../../domain/Extensions";
import ExtensionsObject from "../../domain/interfaces/ExtensionsObject";
import VersionManagerContext from "../context/versionManagerContext";
import { RepoValues } from "../views/home";

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

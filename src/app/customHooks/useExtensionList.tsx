import { useCallback, useState } from "react";
import ExtensionsObject from "../../domain/ExtensionsObject";
import { GitHubRepository } from "../../infrastructure/api/repositories/github/GitHubRepository";

const useExtensionList = (repoName: string, repoOwner: string) => {
  const [extensionList, setExtensionList] = useState<ExtensionsObject>();
  const [displayError, setDisplayError] = useState<boolean>(false);

  const handleError = () => {
    setDisplayError(true);
    setExtensionList({});
  };

  const getExtensionList = useCallback(() => {
    setDisplayError(false);
    // TODO: app layer shouldn't know about infra (repository)
    // TODO: inject needed dependency in versionManagerService from outside app layer to get proper repository
    // const extensions: Extensions = await versionManagerService()
    new GitHubRepository()
      .getExtensions(repoName, repoOwner)
      .then((extensions) => {
        setExtensionList(extensions.groupByType());
      })
      .catch(() => {
        handleError();
      });
  }, [repoName, repoOwner]);

  const handleOnClick = () => {
    if (repoOwner && repoName) {
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
  };
};

export default useExtensionList;

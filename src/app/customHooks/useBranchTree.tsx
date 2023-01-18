import { useCallback, useState } from "react";
import ExtensionsObject from "../../domain/ExtensionsObject";
import { GitHubRepository } from "../../infrastructure/api/repositories/github/GitHubRepository";

const useBranchTree = (repoName: string, repoOwner: string) => {
  const [extensionList, setExtensionList] = useState<ExtensionsObject>();
  const [displayError, setDisplayError] = useState<boolean>(false);

  const handleError = () => {
    setDisplayError(true);
    setExtensionList({});
  };

  // useEffect(() => {
  //   if (fileList?.length) {
  //     const extensions = new Extensions(fileList);

  //     setExtensionList(extensions.groupByType());
  //   }
  // }, [fileList]);

  const getBranchTree = useCallback(
    (branchName: string) => {
      // TODO: app layer shouldn't know about infra
      // const extensions: Extensions = await versionManagerService()
      new GitHubRepository()
        .getExtensions(repoName, repoOwner)
        .then((extensions) => {
          setExtensionList(extensions.groupByType());
        })
        .catch(() => {
          handleError();
        });
    },
    [repoName, repoOwner]
  );

  return {
    getBranchTree,
    extensionList,
    setExtensionList,
    displayError,
    setDisplayError,
  };
};

export default useBranchTree;

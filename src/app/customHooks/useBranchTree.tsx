import { useCallback, useEffect, useState } from "react";
import {
  RepositoryFile,
  TreeApiResponse,
} from "../../domain/interfaces/apiResult";
import ExtensionsObject from "../../domain/interfaces/extensionsObject";
import getExtensionListFromTree from "../../domain/services/helpers";
import endPoints from "../../infrastructure/api/endpoints";
import makeRequest from "../../infrastructure/api/request";

const useBranchTree = (repoName: string, repoOwner: string) => {
  const [fileList, setFileList] = useState<RepositoryFile[]>([]);
  const [extensionList, setExtensionList] = useState<ExtensionsObject>();
  const [displayError, setDisplayError] = useState<boolean>(false);
  let globalFileList: RepositoryFile[] = [];

  const handleError = () => {
    setDisplayError(true);
    setExtensionList({});
  };

  useEffect(() => {
    if (fileList?.length) {
      setExtensionList(getExtensionListFromTree(fileList));
    }
  }, [fileList]);

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

  return {
    getBranchTree,
    fileList,
    extensionList,
    setExtensionList,
    displayError,
    setDisplayError,
  };
};

export default useBranchTree;

import { Extensions } from '../../../../domain/Extensions';
import { httpGET } from '../../httpClient';
import { RepositoryFile, TreeApiResponse } from './interfaces/apiResult';
import endPoints from './apiEndpoints';

export class GitHubRepository {
    private gitHubAcceptHeader = {
        'Accept': 'application/vnd.github.v3+json',
      }
      
    private async getExtensionBySha(repoName: string, repoOwner: string, branchName: string): Promise<RepositoryFile[]> {
        let globalFileList: RepositoryFile[] = [];
        const getExtensionUrl = endPoints.getExtensionList(repoOwner, repoName, branchName);

        const response = await httpGET<TreeApiResponse>(getExtensionUrl, this.gitHubAcceptHeader)

        if (response.tree) {
          globalFileList = [...globalFileList, ...response.tree];
        }

        const shaArray: string[] = response.tree
          .filter((file: RepositoryFile) => file.type === "tree")
          .map((file: RepositoryFile) => file.sha);

        if (shaArray.length) {
          // TODO: use map in order to do the callback without blocking the request in case it fails and manage it with promises (promise.all())
          for (let index = 0; index < shaArray.length; index++) {
            const sha = shaArray[index];
            const fileList: RepositoryFile[] = await this.getExtensionBySha(repoName, repoOwner, sha);
            globalFileList.push(...fileList);
          }
        }

        return globalFileList;
    }

    async getExtensions(repoName: string, repoOwner: string): Promise<Extensions> {
      const getRepoBranchesUrl = endPoints.getRepoBranches(repoOwner, repoName);
      const repoBranchResponse = await httpGET<Array<{name: string}>>(getRepoBranchesUrl, this.gitHubAcceptHeader)
      const repoBranch = repoBranchResponse[0].name;
      
      const fileList: RepositoryFile[] = await this.getExtensionBySha(repoName, repoOwner, repoBranch);

      return new Extensions(fileList);
    }
}
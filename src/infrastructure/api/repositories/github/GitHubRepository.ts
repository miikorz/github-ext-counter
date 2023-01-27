import { Extensions } from '../../../../domain/Extensions';
import { httpGET } from '../../httpClient';
import { RepositoryFile, TreeApiResponse } from './apiResult';
import endPoints from './endpoints';

// * Do we need a class here?
export class GitHubRepository {
    private headers = {
        'Accept': 'application/vnd.github.v3+json',
      }
      
    private async getExtensionBySha(repoName: string, repoOwner: string, branchName: string): Promise<RepositoryFile[]> {
        let globalFileList: RepositoryFile[] = [];
        const response = await httpGET<TreeApiResponse>(endPoints.getExtensionList(repoOwner, repoName, branchName))
        if (response.tree) {
          globalFileList = [...globalFileList, ...response.tree];
        }
        const shaArray: string[] = response.tree
          .filter((item: RepositoryFile) => item.type === "tree")
          .map((i: RepositoryFile) => i.sha);
        if (shaArray.length) {
          // TODO: move everything related with response format to domain layer
          //TODO: use map in order to do the callback without blocking the request in case it fails and manage it with promises (promise.all())
          for (let index = 0; index < shaArray.length; index++) {
            const sha = shaArray[index];
            const fileList: RepositoryFile[] = await this.getExtensionBySha(repoName, repoOwner, sha);
            globalFileList.push(...fileList);
          }
        }
        return globalFileList;
    }

    async getExtensions(repoName: string, repoOwner: string): Promise<Extensions> {
        const repoBranchResponse = await httpGET<Array<{name: string}>>(endPoints.getRepoBranches(repoOwner, repoName))
        const repoBranch = repoBranchResponse[0].name;

        const fileList: RepositoryFile[] = await this.getExtensionBySha(repoName, repoOwner, repoBranch);

        return new Extensions(fileList);
    }
}
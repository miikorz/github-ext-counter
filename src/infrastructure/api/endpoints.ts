import { apiParams } from './apiParams';

export const endPoints = {
  getExtensionList: (owner: string, repo: string, sha: string) => `${owner}/${repo}/${apiParams.GIT}/${apiParams.TREES}/${sha}`,
  getRepoBranches: (owner: string, repo: string) => `${owner}/${repo}/${apiParams.BRANCHES}`,
};

export default endPoints;

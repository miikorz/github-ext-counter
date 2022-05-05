import { makeRequest } from '../src/utils/api/request'; 
import { endPoints } from "../src/utils/api/endpoints";
import { apiParams } from '../src/utils/constants/apiParams';
import { branchesMock, treeMock } from './mockedData/data';

// @ts-ignore
global.fetch = jest.fn((url: string) => Promise.resolve({
  json: () => {
    const returnBranch = url.includes(apiParams.BRANCHES);
    return Promise.resolve(returnBranch ? branchesMock : treeMock);
  },
}));

describe('GitHub API response', () => {
  const ownerMock: string = "test";
  const repoMock: string = "test-repo";
  let branch: Promise<{name: string, commit: {sha: string, url: string}, protected: boolean}>;

  it('should get the list of branches in a repository', async () => {
    branch = makeRequest(endPoints.getRepoBranches(ownerMock, repoMock));
  
    await expect(branch).resolves.toEqual(branchesMock);
  });

  it('should get the extension tree from the repository branch', async () => {
    const extensionList = makeRequest(endPoints.getExtensionList(ownerMock, repoMock, branchesMock[0].name));
  
    await expect(extensionList).resolves.toEqual(treeMock);
  });
});

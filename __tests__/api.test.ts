import { branchesMock, treeMock } from './mockedData/data';
import { httpGET } from "../src/infrastructure/api/httpClient"
import { apiParams } from "../src/infrastructure/api/repositories/github/apiParams"
import { endPoints } from "../src/infrastructure/api/repositories/github/apiEndpoints"
import { VersionManager } from '../src/domain/VersionManager';
import { GitHubRepository } from '../src/infrastructure/api/repositories/github/GitHubRepository';
import { Extensions } from '../src/domain/Extensions';

// @ts-ignore
global.fetch = jest.fn((url: string) => Promise.resolve({
  json: () => {
    const returnBranch = url.includes(apiParams.BRANCHES);
    return Promise.resolve(returnBranch ? branchesMock : treeMock);
  },
}));

const ownerMock: string = "test";
const repoMock: string = "test-repo";
const apiHeaderMock = {
  'irrelevant': 'irrelevant',
}

describe('GitHub API response', () => {
  let branch: Promise<{name: string, commit: {sha: string, url: string}, protected: boolean}>;

  it('should get the list of branches in a repository', async () => {
    branch = httpGET(endPoints.getRepoBranches(ownerMock, repoMock), apiHeaderMock);
  
    await expect(branch).resolves.toEqual(branchesMock);
  });

  it('should get the extension tree from the repository branch', async () => {
    const extensionList = httpGET(endPoints.getExtensionList(ownerMock, repoMock, branchesMock[0].name), apiHeaderMock);
  
    await expect(extensionList).resolves.toEqual(treeMock);
  });
});

describe('VersionManager Service', () => {
  it('should return a repository depending on selectedRepository injected dependency', () => {
    const mockedRepositoryDependency = 'GITHUB';
    process.env.REACT_APP_SELECTED_REPOSITORY = mockedRepositoryDependency;

    const service = new VersionManager(process.env.REACT_APP_SELECTED_REPOSITORY)
    const returnedRepository = service.getRepository();

    expect(returnedRepository instanceof GitHubRepository).toBe(true);
  })

  it('should return an error when a not implemented repository is injected', () => {
    const mockedRepositoryDependency = 'GITLAB';
    process.env.REACT_APP_SELECTED_REPOSITORY = mockedRepositoryDependency;

    const service = new VersionManager(process.env.REACT_APP_SELECTED_REPOSITORY)
    
    expect(() => service.getRepository()).toThrow(`The repository ${mockedRepositoryDependency} is not implemented`);
  })
})

describe.skip('GitHub Repository', () => {
  it('should get file extensions from a code repository', async () => {
    const mockedRepositoryDependency = 'GITHUB';
    process.env.REACT_APP_SELECTED_REPOSITORY = mockedRepositoryDependency;
    
    const selectedRepository = new VersionManager(process.env.REACT_APP_SELECTED_REPOSITORY).getRepository()
    const extensionList: Promise<Extensions> = selectedRepository.getExtensions(ownerMock, repoMock)

    await expect(extensionList).resolves.toEqual({});
  })
})

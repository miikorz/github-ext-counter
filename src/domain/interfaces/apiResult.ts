export interface RepositoryFile {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

export interface TreeApiResponse {
  sha: string;
  url: string;
  tree: RepositoryFile[];
  truncated: boolean;
}

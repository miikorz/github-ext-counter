interface Commit {
  sha: string;
  url: string;
}

export default interface BranchResponse {
  name: string;
  commit: Commit;
  protected: false;
}

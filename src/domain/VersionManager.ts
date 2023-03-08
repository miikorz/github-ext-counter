import { GitHubRepository } from "../infrastructure/repositories/github/GitHubRepository";
import { GitRepository } from "./interfaces/GitRepository";

export class VersionManager {
    constructor(private repository: string) {}
    
    // * No matter the reposirroy, the method getRepository() will return a GitRepository
    // * with the method getExtensions()
    getRepository(): GitRepository {
        switch (this.repository) {
            case "GITHUB":
              return new GitHubRepository();
            // new case
            // case "GITLAB":
            //   return  new GitLabRepository();
            default:
              throw(new TypeError(`The repository ${this.repository} is not implemented`))
          }
    }
}
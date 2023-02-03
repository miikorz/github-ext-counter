import { GitHubRepository } from "../infrastructure/api/repositories/github/GitHubRepository";

export class VersionManager {
    constructor(private repository: string) {}
    
    getRepository(): GitHubRepository {
        switch (this.repository) {
            case "GITHUB":
              return new GitHubRepository();
      
            default:
              throw(new TypeError(`The repository ${this.repository} is not implemented`))
          }
    }
}
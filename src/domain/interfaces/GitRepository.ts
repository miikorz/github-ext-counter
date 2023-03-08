import { Extensions } from "../Extensions";

export interface GitRepository {
    getExtensions(repoName: string, repoOwner: string): Promise<Extensions>
}
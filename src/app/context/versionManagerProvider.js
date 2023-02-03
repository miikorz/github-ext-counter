import VersionManagerContext from "./versionManagerContext";
import { VersionManager } from "../../domain/VersionManager";
import { config } from "../../config";

function VersionManagerProvider({ children }) {
  const contextValue = {
    versionManagerRepository: () =>
      new VersionManager(config.selectedRepository).getRepository(),
  };

  return (
    <VersionManagerContext.Provider value={contextValue}>
      {children}
    </VersionManagerContext.Provider>
  );
}

export default VersionManagerProvider;

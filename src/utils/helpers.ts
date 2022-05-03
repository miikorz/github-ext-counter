import { RepositoryFile } from "./interfaces/apiResult";
import ExtensionsObject from "./interfaces/extensionsObject";

export default function getExtensionListFromTree(fileArray: RepositoryFile[]): ExtensionsObject {
  const resultFormatted: ExtensionsObject = {};

  fileArray.filter(item => item.type === "blob").forEach((file) => {
    const fileExtension = file.path.split('.').pop();
    if (resultFormatted.hasOwnProperty(fileExtension!)) {
      resultFormatted[fileExtension!]++;
    } else {
      resultFormatted[fileExtension!] = 1;
    }
  });

  return resultFormatted;
}

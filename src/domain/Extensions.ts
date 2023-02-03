import ExtensionsObject from "./interfaces/ExtensionsObject";

export class Extensions {
    constructor(private values: Array<{type: string, path: string}>) {
        
    }
    
    groupByType(): ExtensionsObject {
        const resultFormatted: ExtensionsObject = {};

        this.values.filter(value => value.type === "blob").forEach((file) => {
            const fileExtension = file.path.split('.').pop();
            if (resultFormatted.hasOwnProperty(fileExtension!)) {
              resultFormatted[fileExtension!]++;
            } else {
              resultFormatted[fileExtension!] = 1;
            }
          });

        return resultFormatted;
    }

}
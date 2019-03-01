import * as manifest from '../package.json';

export const constants = {
  extension: {
    name: manifest.name,
    version: manifest.version,
    generatorName: "ampersand"
  }
};

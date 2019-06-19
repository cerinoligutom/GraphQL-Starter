import { IObject } from '@app/core/interfaces';

export const depthOfObject = (object: IObject): number => {
  let level = 1;
  let key;

  for (key in object) {
    if (!object.hasOwnProperty(key)) {
      continue;
    }

    if (typeof object[key] === 'object') {
      const depth = depthOfObject(object[key]) + 1;
      level = Math.max(depth, level);
    }
  }
  return level;
};

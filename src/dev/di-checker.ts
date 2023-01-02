import {isClass} from '../lib/methods';

export default function (id: string, dependency: any, instance: any) {
  const paramsMatchingArr = dependency
    .toString()
    .match(/(constructor\()([\s\S]*?)\)/);
  if (isClass(dependency) && paramsMatchingArr && paramsMatchingArr[2]) {
    const params = (paramsMatchingArr[2] as string)
      .split(',')
      .map(item => item.trim());
    const missingIds = [];
    for (let j = 0; j < params.length; j++) {
      const param = params[j];
      const memberValue = instance[param];
      if (memberValue === undefined) {
        missingIds.push(param);
      }
    }
    if (missingIds.length) {
      console.error(
        new Error(`
Dependencies are missing from the service [${id}] or provided in a wrong order.
Please provide them in 'app/providers.ts' or correcting its order:
      {
        ${id}: {
          provider: () => import('...'),
          deps: ['${params.join("', '")}']
        }
      }
`)
      );
    }
  }
}

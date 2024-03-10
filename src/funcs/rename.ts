import inquirer from "inquirer";
import * as fs from 'fs/promises';
import * as path from "path";
import { renameFilesPromptList } from "../constant.js";
import { get__dirname } from "../utils/index.js";

interface CommandResult {
  folder: string;
  fileName: string;
}

export const renameFiles = async () => {
  console.log('renameFiles');
  const result = await inquirer
    .prompt(renameFilesPromptList, { folder: undefined, fileName: undefined })
    .catch(err => {
      if (err.isTtyError) {
        console.error('Prompt couldn\'t be rendered in the current environment');
      } else {
        console.error(err);
      }
    }) as CommandResult | undefined;
  console.log('results', result);
  const { folder, fileName } = result || {};
  if (!fileName?.trim?.()?.length) {
    console.log('fileName is Empty');
    return;
  }
  const finalPath = path.join(get__dirname(), '../../', folder);
  console.log('finalPath', finalPath);
  try {
    const dir = await fs.readdir(finalPath);
    console.log('rename start');
    for (let i = 0; i < dir.length; i++) {
      const file = dir[i];
      const result = await fs.rename(path.join(finalPath, file), path.join(finalPath, `${fileName}-${i}`));
      console.log(`rename, ${file} to ${fileName}-${i}`);
    }
    console.log('rename end');
  } catch (e) {
    console.error(e);
  }
};
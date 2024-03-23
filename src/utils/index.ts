import { fileURLToPath } from "url";
import * as path from "path";
import inquirer from "inquirer";
import { access, constants } from "fs/promises";

export const get__filename = () => fileURLToPath(import.meta.url);

export const get__dirname = () =>
path.join(path.dirname(fileURLToPath(import.meta.url)), '../');

/**
 *
 * @param path
 * @param mode 读、写、可执行 constants.R_OK | constants.W_OK | constants.X_OK
 */
export const checkFileExist = async (
  path: string,
  mode: number = constants.R_OK
): Promise<{ isExist: boolean; message?: string }> => {
  try {
    await access(path, mode);
    return {
      isExist: true,
    };
  } catch (e: Error) {
    return {
      isExist: false,
      message: e.message,
    };
  }
};

/**
 * 读取目录（包含对应提示）
 * @param root 默认读取的根目录
 */
export const readDir = async (root?: string): string => {
  const defaultRoot = root || get__dirname();
  let dirStringInput: string;
  do {
    const result = (await inquirer
      .prompt(
        [
          {
            type: "input",
            name: "inputPath",
            message: `please enter a path for file folder, current: ${defaultRoot}`,
          },
        ],
        {
          inputPath: undefined,
        }
      )
      .catch((e) => {
        if (e.isTtyError) {
          console.error(
            "Prompt couldn't be rendered in the current environment"
          );
        }
      })) as { inputPath: string } | undefined;
    const { inputPath } = result || {};
    const finalInputPath = path.join(defaultRoot, inputPath);
    const isValidPath = (await checkFileExist(finalInputPath)).isExist;
    if (isValidPath) {
      dirStringInput = finalInputPath;
      break;
    }
    console.error("the path is inValid, once again");
  // eslint-disable-next-line no-constant-condition
  } while (true);
  return dirStringInput;
};

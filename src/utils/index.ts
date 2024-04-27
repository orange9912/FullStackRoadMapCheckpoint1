import { fileURLToPath } from "url";
import * as path from "path";
import inquirer from "inquirer";
import { access, constants } from "fs/promises";
import { logError, logInfo } from "./log.ts";

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

type ReadDirPathOption = {
  /** 需要指定的初始目录 */
  root?: string;
  /** 输入目录的提示语 */
  hintPrompt?: string;
  errorPrompt?: string;
}

type ReadDirPathReturn = {
  path: string;
}

/**
 * 读取目录路径（包含对应提示 + 鉴有效）
 * @param root 默认读取的根目录
 */
export const readDirPath = async (options?: ReadDirPathOption): Promise<ReadDirPathReturn> => {
  // 读取文件夹内容
  const {
    root,
  } = options || {};
  const defaultRoot = root || get__dirname();
  const {
    hintPrompt = `please enter a path for file folder, current: ${defaultRoot}`, 
    errorPrompt = 'the path is inValid, once again'
  } = options || {};
  let dirStringInput: string;
  logInfo(`当前路径：${defaultRoot}`);
  do {
    const result = (await inquirer
      .prompt(
        [
          {
            type: "input",
            name: "inputPath",
            message: hintPrompt
          },
        ],
        {
          inputPath: undefined,
        }
      )
      .catch((e) => {
        if (e.isTtyError) {
          logError("Prompt couldn't be rendered in the current environment")
        }
      })) as { inputPath: string } | undefined;
    const { inputPath } = result || {};
    const finalInputPath = path.join(defaultRoot, inputPath);
    const isValidPath = (await checkFileExist(finalInputPath)).isExist;
    if (isValidPath) {
      dirStringInput = finalInputPath;
      break;
    }
    logError(errorPrompt);
  // eslint-disable-next-line no-constant-condition
  } while (true);
  return {
    path: dirStringInput
  };
};

export const callInquirer = async <T = Record<string, unknown>>(params: Parameters<typeof inquirer.prompt>): Promise<Partial<T>> => {
  const [questions, initialAnswers] = params || [];
  const result = (await inquirer.prompt(questions, initialAnswers).catch((e) => {
    if (e.isTtyError) {
      logError("Prompt couldn't be rendered in the current environment")
    }
  }));
  if (!result) {
    return initialAnswers as T;
  }
  return Object.assign(initialAnswers, result) as T;
}
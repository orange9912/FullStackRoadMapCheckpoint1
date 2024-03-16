import inquirer from "inquirer";
import * as fs from "fs/promises";
import * as path from "path";
import { renameFilesPromptList } from "../constant.js";
import { get__dirname } from "../utils/index.js";

interface CommandResult {
  folder: string;
  fileName: string;
}

export const renameFiles = async () => {
  console.log("renameFiles");
  const result = (await inquirer
    .prompt(renameFilesPromptList, { folder: undefined, fileName: undefined })
    .catch((err) => {
      if (err.isTtyError) {
        console.error("Prompt couldn't be rendered in the current environment");
      } else {
        console.error(err);
      }
    })) as CommandResult | undefined;
  const { folder, fileName } = result || {};
  if (!fileName?.trim?.()?.length) {
    console.log("fileName is Empty");
    return;
  }
  const finalPath = path.join(get__dirname(), '../', folder);
  console.log("finalPath", finalPath);
  try {
    const dir = await fs.readdir(finalPath);
    const newFileName = fileName.split(".")[0];
    const newFileExtName = fileName.split(".")[1];
    // 这里加一步确认。
    console.log("old folder files: ", dir);
    const confirmResult = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmResult",
        message: `This folder? content: ⬆️`,
      },
    ]);
    console.log("confirmResult", confirmResult);
    if (!confirmResult.confirmResult) {
      console.warn("stoped.");
      return;
    }
    for (let i = 0; i < dir.length; i++) {
      const file = dir[i];
      const splitFile = file.split(".");
      const originExtName = splitFile?.[1];
      await fs.rename(
        path.join(finalPath, file),
        path.join(
          finalPath,
          `${newFileName}-${i}.${newFileExtName || originExtName}`
        )
      );
      console.log(
        `rename, ${file} to ${newFileName}-${i}.${
          newFileExtName || originExtName
        }`
      );
    }
    console.log("rename end");
  } catch (e) {
    console.error(e);
  }
};

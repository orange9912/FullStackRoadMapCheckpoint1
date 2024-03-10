import inquirer from "inquirer";
import { Module, promptList } from "./constant.js";
import { renameFiles } from "./funcs/rename.js";

async function main() {
  const result = await inquirer
  .prompt(promptList).catch(err => {
    if (err.isTtyError) {
      console.error('Prompt couldn\'t be rendered in the current environment');
    } else {
      console.error(err);
    }
  }) as { func: Module } | undefined;
  // console.log('result', result);
  const funcs = {
    [Module.Rename]: renameFiles,
  };
  funcs[result.func]?.();
}
main();
import inquirer from "inquirer";
import { Module, promptList } from "./constant.js";
import { renameFiles } from "./funcs/rename.js";
import { compress } from "./funcs/compress.js";
import parseExcelToWord from "./funcs/parseExcelToWord.ts";
import compareExcel from "./funcs/compareExcel.ts";

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
    [Module.Compress]: compress,
    [Module.ParseExcelToWord]: parseExcelToWord,
    [Module.CompareCols]: compareExcel,
  };
  funcs[result.func]?.();
}
main();
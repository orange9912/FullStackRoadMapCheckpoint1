import inquirer from "inquirer";
import { promptList } from "./constant.js";

async function main() {
  const result = await inquirer
  .prompt(promptList).catch(err => {
    if (err.isTtyError) {
      console.error('Prompt couldn\'t be rendered in the current environment');
    } else {
      console.error(err);
    }
  });
  console.log('result', result);
}
main();
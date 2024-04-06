import chalk from 'chalk';

type logFuncText = string | string[];

export const logError = (text: logFuncText) => {
  try {
    console.log(chalk.bgRed(text));
  } catch (e) {
    console.error(text);
  }
}

export const logWarning = (text: logFuncText) => {
  console.log(chalk.yellow(text));
}

export const logInfo = (text: logFuncText) => {
  try {
    console.log(chalk.blue(text));
  } catch(e) {
    console.error(text);
  }
}

export const logSuccessInfo = (text: logFuncText) => {
  console.log(chalk.green(text));
}


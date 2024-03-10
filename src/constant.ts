import { QuestionCollection } from "inquirer";
import { get__dirname } from "./utils/index.js";
import * as path from "path";

export enum Module {
  Rename = 'rename',
  CheckElement = 'checkelement',
}

export const promptList: QuestionCollection = [
  {
    type: 'list',
    name: 'func',
    message: 'choose one function please',
    choices: [
      {
        name: 'rename files',
        value: Module.Rename
      },
      {
        name: 'query Text Content Of Specific Element',
        value: Module.CheckElement
      }
    ]
  }
]

export const renameFilesPromptList: QuestionCollection = [
  {
    type: 'input',
    name: 'folder',
    message: `please enter a valid path for file folder, current: ${path.join(get__dirname(), '../../')}`,
  },
  {
    type: 'input',
    name: 'fileName',
    message: 'fileName?: '
  }
]
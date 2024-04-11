import { QuestionCollection } from "inquirer";
import { get__dirname } from "./utils/index.js";

export enum Module {
  Rename = 'rename',
  CheckElement = 'checkelement',
  Compress = 'compress',
  ParseExcelToWord = 'parseExcelToWord',
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
      },
      {
        name: 'compress Imgs',
        value: Module.Compress
      },
      {
        name: '特别功能：解析excel每一行都输出一个docx模板内的特定文件',
        value: Module.ParseExcelToWord
      }
    ]
  }
]

export const renameFilesPromptList: QuestionCollection = [
  {
    type: 'input',
    name: 'folder',
    message: `please enter a valid path for file folder, current: ${get__dirname()}`
  },
  {
    type: 'input',
    name: 'fileName',
    message: 'fileName?: '
  }
]
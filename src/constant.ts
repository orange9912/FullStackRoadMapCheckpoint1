import inquirer, { QuestionCollection } from "inquirer";

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
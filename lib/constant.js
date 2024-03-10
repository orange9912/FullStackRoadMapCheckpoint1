import { get__dirname } from "./utils/index.js";
import * as path from "path";
export var Module;
(function (Module) {
    Module["Rename"] = "rename";
    Module["CheckElement"] = "checkelement";
})(Module || (Module = {}));
export const promptList = [
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
];
export const renameFilesPromptList = [
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
];

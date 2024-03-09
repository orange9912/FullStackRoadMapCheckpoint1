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

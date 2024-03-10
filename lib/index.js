var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
import { Module, promptList } from "./constant.js";
import { renameFiles } from "./funcs/rename.js";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const result = yield inquirer
            .prompt(promptList).catch(err => {
            if (err.isTtyError) {
                console.error('Prompt couldn\'t be rendered in the current environment');
            }
            else {
                console.error(err);
            }
        });
        // console.log('result', result);
        const funcs = {
            [Module.Rename]: renameFiles,
        };
        (_a = funcs[result.func]) === null || _a === void 0 ? void 0 : _a.call(funcs);
    });
}
main();

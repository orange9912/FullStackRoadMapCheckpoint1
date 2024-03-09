"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var program = new commander_1.Command();
program
    .option('-p, --pizza-type <type>', 'add');
// console.log('argv: ', process.argv);
program.parse();
var options = program.opts();
if (options.pizzaType) {
    console.log(options);
}

import { Command } from 'commander';

const program = new Command();

program
  .option('-p, --pizza-type <type>', 'add');

// console.log('argv: ', process.argv);
program.parse();

const options = program.opts();
if (options.pizzaType) {
  console.log(options);
}
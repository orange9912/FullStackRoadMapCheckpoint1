import inquirer from "inquirer";

inquirer
  .prompt([ 
    'hi, plaese input your age: '
  ])  
  .then(answers => {
    console.log('ok');
  })  
  .catch(error => {
    if (error.isTtyError) {
      console.log('1'); 
    } else {
      console.log('22222');
    }
  })
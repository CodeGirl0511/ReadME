const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");

let profileurl = "";
let licenseurl = "";
let licenseincluded = "";

function init() {

  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your GitHub username?",
        name: "username",
        validate: async (input) => {
          if (input == "") {
            return "Please provide a valid username.";
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        message: "What is your email?",
        name: "email",
        validate: async (input) => {
          if (input == "" || !input.includes("@")) {
            return "Please provide a valid email address.";
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        message: "What is your project's name?",
        name: "projectName",
        validate: async (input) => {
          if (input == "") {
            return "Please provide a valid project name.";
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        message: "Please write a short description of your project:",
        name: "description",
        validate: async (input) => {
          if (input == "") {
            return "Please provide a valid description.";
          } else {
            return true;
          }
        },
      },
      {
        type: "list",
        message: "What kind of license should your project have?",
        name: "license",
        choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3", "None"],
      },
      {
        type: "input",
        message: "What command should be run to install dependencies?",
        name: "dependencies",
        validate: async (input) => {
          if (input == "") {
            return "Please provide a valid command.";
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        message: "What command should be run to run tests?",
        name: "tests",
        validate: async (input) => {
          if (input == "") {
            return "Please provide a valid command.";
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        message: "What does the user need to know about using the repo?",
        name: "usage",
        validate: async (input) => {
          if (input == "") {
            return "Please provide a valid description.";
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        message:
          "What does the user need to know about contributing to the repo?",
        name: "contributing",
        validate: async (input) => {
          if (input == "") {
            return "Please provide a valid description.";
          } else {
            return true;
          }
        },
      },
    ])
    .then((answers) => {
      let queryURL = `https://api.github.com/users/${answers.username}`;

    
      axios.get(queryURL).then((githubdata) => {
        profileurl = githubdata.data.avatar_url;


        const projecturl = generateProjectUrl(
          `${answers.username}`,
          `${answers.projectName}`
        );

     
        const data = `\n# ${answers.projectName}
        \n ## Description 
        \n${answers.description} 
        \n 
        \n [View Deployed Project](${projecturl})
        
        \n ## Table of Contents 
        \n * [Installation](#installation) 
        \n * [Usage](#usage) 
        \n * [Contributing](#contributing) 
        \n * [Tests](#tests) 
        \n * [Questions](#questions) 
        \n * [License](#license) 
        \n ## Installation 
        \n ${answers.dependencies} 
      
        \n ## Usage
        \n ${answers.usage}
        \n ## Contributing
        \n ${answers.contributing}
        \n ## Tests
        \n ${answers.tests}
        \n ## Questions
        \n If you have any questions, feel free to reach out! 
        \n <img src="${profileurl}" width="100">
        \n Email: ${answers.email} 
        `;

      
        if (`${answers.license}` == "MIT") {
          licenseurl =
            "https://github.com/CodeGirl0511/ReadME/blob/master/LICENSE";
        } else if (`${answers.license}` == "APACHE 2.0") {
          licenseurl = "https://www.apache.org/licenses/LICENSE-2.0.txt";
        } else if (`${answers.license}` == "GPL 3.0") {
          licenseurl = "https://www.gnu.org/licenses/gpl-3.0.txt";
        } else if (`${answers.license}` == "BSD 3") {
          licenseurl =
            "https://tldrlegal.com/license/bsd-3-clause-license-(revised)#fulltext";
        } else {
          licenserul = "";
        }

     
        if (`${answers.license}` == "None") {
          licenseincluded = "";
        } else {
          licenseincluded = `\n ## License
        \n Licensed under the [${answers.license}](${licenseurl}) license.`;
        }

       
        const badge = renderLicenseBadge(
          `${answers.license}`,
          `${answers.name}`,
          `${answers.projectName}`
        );

        const finalData = badge + data + licenseincluded;

        
        writeToFile("README.md", finalData);
      });
    })
    .catch((error) => {
      if (error) {
        console.log(error);
      }
    });
}
function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, (err) => {
    if (err) {
      console.log(error);
    }
  });
}
function renderLicenseBadge(license) {
  if (license !== "None") {
    return `![GitHub license](https://github.com/CodeGirl0511/ReadME/blob/master/LICENSE)`;
  }
  return "";
}
function generateProjectUrl(github, title) {
  const kebabCaseTitle = title.toLowerCase().split(" ").join("-");
  return `https://github.com/${github}/${kebabCaseTitle}`;
}

init();
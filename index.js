const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require('fs');
const { writeFileSync } = require('fs');
const teamMembers = [];


const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}


const render = require("./src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.

// Prompt user to select a team member type and enter their information
function promptTeamMember() {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'memberType',
        message: 'Select a team member type to add:',
        choices: ['Engineer', 'Intern'],
      },
      {
        type: 'input',
        name: 'name',
        message: "Enter team member's name:",
      },
      {
        type: 'input',
        name: 'id',
        message: "Enter team member's employee ID:",
      },
      {
        type: 'input',
        name: 'email',
        message: "Enter team member's email address:",
      },
      {
        type: 'input',
        name: 'github',
        message: "Enter engineer's GitHub username:",
        when: (answers) => answers.memberType === 'Engineer',
      },
      {
        type: 'input',
        name: 'school',
        message: "Enter intern's school name:",
        when: (answers) => answers.memberType === 'Intern',
      },
      {
        type: 'confirm',
        name: 'addMore',
        message: 'Do you want to add another team member?',
      },
    ]);
  }
  
  // Function to start the application
  function start() {
    promptTeamMember()
      .then((managerData) => {
        const manager = new Manager(managerData.name, managerData.id, managerData.email, managerData.officeNumber);
        teamMembers.push(manager);
        return promptTeamMember();
      })
      .then(function addTeamMember(teamMemberData) {
        if (teamMemberData.memberType === 'Engineer') {
          const engineer = new Engineer(teamMemberData.name, teamMemberData.id, teamMemberData.email, teamMemberData.github);
          teamMembers.push(engineer);
        } else if (teamMemberData.memberType === 'Intern') {
          const intern = new Intern(teamMemberData.name, teamMemberData.id, teamMemberData.email, teamMemberData.school);
          teamMembers.push(intern);
        }
  
        if (teamMemberData.addMore) {
          return promptTeamMember().then(addTeamMember);
        }
  
        return teamMembers;
      })
      .then((teamMembers) => {
        const html = render(teamMembers);
        writeFileSync(outputPath, html);
        console.log(`Team profile has been generated and saved to ${outputPath}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  start();
 
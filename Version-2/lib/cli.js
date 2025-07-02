const {cla, clu, chalk, inquirer, figlet} = require('../src/reqs');

class CLI {
    constructor() {
        this.od = [
            {
                name: 'twilioSid',
                type: String,
                description: chalk.cyan('Twilio SID'),
                required: true,
                question: {
                    type: 'input',
                    message: 'What is the Twilio SID?',
                    validate: (val) => {
                        return ('string' == typeof(val) && val.length > 0);
                    }
                },
            },
            {
                name: 'twilioToken',
                type: String,
                description: chalk.cyan('Twilio Token'),
                required: true,
                question: {
                    type: 'input',
                    message: 'What is the Twilio Token?',
                    validate: (val) => {
                        return ('string' == typeof(val) && val.length > 0);
                    }
                },
            },
            {
                name: 'fromNum',
                type: String,
                description: chalk.cyan('Sender Phone Number'),
                required: true,
                question: {
                    type: 'input',
                    message: 'What is the Sender Phone Number?',
                    validate: (val) => {
                        return ('string' == typeof(val) && val.length > 0);
                    }
                },
            },
            {
                name: 'toNum',
                type: String,
                description: chalk.cyan('Recipient Phone Number'),
                required: true,
                question: {
                    type: 'input',
                    message: 'What is the Recipient Phone Number?',
                    validate: (val) => {
                        return ('string' == typeof(val) && val.length > 0);
                    }
                },
            },
            {
                name: 'message',
                type: String,
                description: chalk.cyan('Message'),
                defaultOption: true,
                required: true,
                question: {
                    type: 'input',
                    message: 'What is the message you want to send?',
                    validate: (val) => {
                        return ('string' == typeof(val) && val.length > 0);
                    }
                },
            },
            {
                name: 'forwardFrom',
                type: String,
                description: chalk.cyan('SMS Response Sender'),
                required: true,
                question: {
                    type: 'input',
                    message: 'What is the SMS Response Sender? Use "." for none',
                    validate: (val) => {
                        return ('string' == typeof(val) && val.length > 0);
                    }
                },
            },
            {
                name: 'forwardSmsTo',
                type: String,
                description: chalk.cyan('SMS Response Recipient'),
                required: true,
                question: {
                    type: 'input',
                    message: 'What is the SMS Response Recipient? Use "." for none',
                    validate: (val) => {
                        return ('string' == typeof(val) && val.length > 0);
                    }
                },
            },
            {
                name: 'forwardCallTo',
                type: String,
                description: chalk.cyan('Call Response Recipient'),
                required: true,
                question: {
                    type: 'input',
                    message: 'What is the Call Response Recipient? Use "." for none',
                    validate: (val) => {
                        return ('string' == typeof(val) && val.length > 0);
                    }
                },
            },
            {
                name: 'stopOnSMS',
                type: String,
                description: chalk.cyan('Stop on Response SMS'),
                required: true,
                question: {
                    type: 'list',
                    message: 'Should we stop when an SMS is received?',
                    validate: (val) => {
                        return ('string' == typeof(val) && val.length > 0);
                    },
                    choices: ['Yes', 'No'],
                },
            },
            {
                name: 'stopOnCall',
                type: String,
                description: chalk.cyan('Stop on Response Call'),
                required: true,
                question: {
                    type: 'list',
                    message: 'Should we stop when an Call is received?',
                    validate: (val) => {
                        return ('string' == typeof(val) && val.length > 0);
                    },
                    choices: ['Yes', 'No'],
                },
            },
            {
                name: 'count',
                type: Number,
                description: chalk.cyan('How many messages to send'),
                required: true,
                question: {
                    type: 'input',
                    message: 'How many times would you like to send the message?',
                    validate: (val) => {
                        val = parseInt(val);
                        return (!isNaN(val) && val >= 0)
                    }
                },
            },
            {
                name: 'interval',
                type: Number,
                description: chalk.cyan('Send Interval'),
                required: true,
                question: {
                    type: 'input',
                    message: 'How many milliseconds would you like to wait between messages?',
                    validate: (val) => {
                        val = parseInt(val);
                        return (!isNaN(val) && val >= 500)
                    }
                },
            },
            {
                name: 'help',
                alias: 'h',
                type: Boolean,
                description: chalk.yellow('Show this usage guide'),
            },
        ];
        this.co = [
            {
                header: chalk.greenBright('SMS Bomb'),
                content: 'Mass Blast an SMS using Twilio'
            },
            {
                header: chalk.magenta('Usage'),
                content: 'run.js'
            },
            {
                header: chalk.magenta('NPM Usage'),
                content: 'npm start'
            },
            {
                header: chalk.magenta('Options'),
                optionList: this.od,
            }
        ];
    }

    async run() {
        const options = cla(this.od);
        if (options.help) {
            const u = clu(this.co);
            console.log(u);
            process.exit(0);
        }
        console.log(
            chalk.green(
                figlet.textSync("SMS Bomb", {
                    font: "Standard",
                    horizontalLayout: "default",
                    verticalLayout: "default"
                })
            )
        );
        const questions = [];
        for (let i = 0; i < this.od.length; i++) {
            const opt = this.od[i];
            if (opt.required && 'undefined' == typeof(options[opt.name])) {
                const q = Object.assign({}, {
                    name: opt.name,
                }, opt.question);
                questions.push(q);
            }
            else if ('undefined' == typeof(options[opt.name]) && 'undefined' !== typeof(opt.default)) {
                options[opt.name] = opt.default;
            }
        }
        if (questions.length > 0) {
            const answers = await inquirer.prompt(questions);
            for (let key in answers) {
                options[key] = answers[key];
            }
        }
        return options;
    }

    static async init() {
        const c = new CLI;
        return await c.run();
    }
}

module.exports = CLI;
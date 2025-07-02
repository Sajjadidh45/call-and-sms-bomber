const cli = require('./lib/edgeCli');
const Server = require('./lib/server');
const {chalk, twilio, sleep, inquirer, randomWords, axios, qs} = require('./src/reqs');

cli.init().then(async (vals) => {
    console.log([chalk.blue('Use this command again:'), chalk.cyan(`--apiKey "${vals.apiKey}" --toNum "${vals.toNum}" --message="${vals.message}" --count="${vals.count}" --interval "${vals.interval}"`)].join(' '));
    console.log(vals);
    let count = 0;
    let start = false;
    let stop = false;
    while (false == start) {
        const {ready} = await inquirer.prompt([
            {
                type: 'list',
                name: 'ready',
                message: 'Are you ready to send?',
                choices: ['Yes', 'No', 'Cancel'],
            }
        ])
        if ('Yes' == ready) {
            start = true;
        }
        if ('Cancel' == ready) {
            stop = true;
            start = true;
        }
    }
    while (count < vals.count && !stop) {
        count ++;
        if (!stop) {
            console.log(chalk.gray(`Sending message ${count} of ${vals.count}`));
            let sid = randomWords();
            while (sid.length < 11) {
                sid += randomWords();
            }
            sid = sid.substr(0, 11);
            try {
                await axios.post('https://api.smsedge.com/v1/sms/send-single/', qs.stringify({
                    api_key: vals.apiKey,
                    from: sid,
                    to: vals.toNum,
                    text: vals.message,
                    shorten_url: 0,
                    transactional: 0,
                    smart_routing: 1,
                }))
            }
            catch (error) {
                stop = true;
                console.log(chalk.red('Error Communicating with API'));
                if (error.response) {
                    console.log(error.response.data);
                }
            }
        }
        if (count < vals.count) {
            await sleep(vals.interval);
        }
    }
    if (count == vals.count) {
        console.log(chalk.green('All messages have been sent'));
    }
    else if (0 == count) {
        console.log(chalk.yellow('Sending was cancelled'));
        process.exit(0);
    }
    else if (count > 0 && count < vals.count) {
        console.log(chalk.green('Sending was stopped'));
    }
})
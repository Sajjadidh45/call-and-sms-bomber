const cli = require('./lib/cli');
const Server = require('./lib/server');
const {chalk, twilio, sleep, inquirer} = require('./src/reqs');

cli.init().then(async (vals) => {
    const server = new Server;
    const client = twilio(vals.twilioSid, vals.twilioToken);
    let fnum;
    const nums = await client.incomingPhoneNumbers.list({
        phoneNumber: `+${vals.fromNum}`,
        limit: 1,
    })
    if (nums.length !== 1) {
        console.log(chalk.red('Invalid Sender Number. Must be a number in the Twilio Account'));
        process.exit(1);
    }
    if (vals.forwardFrom !== '.') {
        const fnums = await client.incomingPhoneNumbers.list({
            phoneNumber: `+${vals.forwardFrom}`,
            limit: 1,
        })
        if (fnums.length > 0) {
            fnum = fnums[0];
        }
    }
    const num = nums[0];
    await server.ready;
    let stop = false;
    console.log(chalk.yellow('Setting up Twilio to Receive Feedback'));
    await client.incomingPhoneNumbers(num.sid).update({
        smsMethod: 'POST',
        smsUrl: `${server.external}/sms`,
        voiceMethod: 'POST',
        voiceUrl: `${server.external}/phone`
    })
    if (fnum) {
        await client.incomingPhoneNumbers(fnum.sid).update({
            smsMethod: 'POST',
            smsUrl: `${server.external}/sms`,
            voiceMethod: 'POST',
            voiceUrl: `${server.external}/phone`
        })  
    }
    console.log(chalk.green('Set up Twilio to Receive Feedback'));
    server.onSMS = async (payload, res) => {
        console.log(chalk.magenta('Got SMS Response'));
        if (payload.From == `+${vals.toNum}` && payload.To == `+${vals.fromNum}`) {
            if ('.' !== vals.forwardFrom && '.' !== vals.forwardSmsTo) {
                console.log(chalk.magenta('Forwarding SMS to Internal'));
                await client.messages.create({
                    body: `[From ${payload.From}]:\n ${payload.Body}`,
                    to: `+${vals.forwardSmsTo}`,
                    from: `+${vals.forwardFrom}`,
                })
            }
            if ('Yes' == vals.stopOnSMS) {
                console.log(chalk.green('Killing Sender'));
                res.status(201).end();
                stop = true;
            }
        }
        else if (payload.From == `+${vals.forwardSmsTo}` && payload.To == `+${vals.forwardFrom}`) {
            console.log(chalk.magenta('Forwarding SMS to Recipient'));
            await client.messages.create({
                body: payload.Body,
                to: `+${vals.toNum}`,
                from: `+${vals.fromNum}`,
            })
        }
        return res.status(201).end();
    }
    server.onCall = async (payload, res) => {
        console.log(chalk.magenta('Got Phone Response'));
        if (payload.To == `+${vals.fromNum}`) {
            if ('.' !== vals.forwardCallTo) {
                console.log(chalk.magenta('Forwarding Call to Internal'));
                const response = new twilio.twiml.VoiceResponse();
                response.say("One moment while you are connected");
                response.dial(`+${vals.forwardCallTo}`, {});
                res.set('Content-Type', 'text/xml');
                res.send(response.toString());
            }
            if ('Yes' == vals.stopOnCall) {
                console.log(chalk.green('Killing Sender'));
                res.end();
                stop = true;
            }
        }
        return res.end();
    }
    let count = 0;
    let start = false;
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
            await client.messages.create({
                body: vals.message,
                to: `+${vals.toNum}`,
                from: `+${vals.fromNum}`,
            })
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
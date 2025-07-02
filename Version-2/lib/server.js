const portfinder = require('portfinder');
const {chalk, express, http, bodyParser, ngrok} = require('../src/reqs');

class Server {
    onSMS;
    onCall;
    server;
    port;
    external;
    ready;
    constructor() {
        this.ready = new Promise((resolve) => {
            console.log(chalk.blue(`Looking for available port`));
            portfinder.getPortPromise({
                port: 1000,
                stopPort: 8000,
            }).then(async (port) => {
                this.port = port;
                console.log(chalk.yellow(`Port ${port} is available`));
                const app = express();
                app.use(bodyParser.json())
                app.use(bodyParser.urlencoded({ extended: true }))
                app.all('/sms', async (req, res) => {
                    if ('function' == typeof(this.onSMS)) {
                        await this.onSMS(req.body, res);
                    }
                    else {
                        return res.status(200).json({
                            status: 'SUCCESS',
                            code: 200,
                            data: null,
                            errors: [],
                        })
                    }
                })
                app.all('/phone', async (req, res) => {
                    if ('function' == typeof(this.onCall)) {
                        await this.onCall(req.body, res);
                    }
                    else {
                        return res.status(200).json({
                            status: 'SUCCESS',
                            code: 200,
                            data: null,
                            errors: [],
                        })
                    }
                })
                app.all('*', (req, res) => {
                    return res.status(404).end();
                });
                this.server = http.createServer(app);
                this.server.listen(this.port, async () => {
                    console.log(chalk.blueBright(`Listening interally *:${this.port}`));
                    this.external = await ngrok.connect(this.port);
                    console.log(chalk.green(`Listening externally on ${this.external}`));
                    console.log(chalk.yellow(`Need to set SMS Webhook to ${this.external}/sms`));
                    console.log(chalk.yellow(`Need to set Phone Webhook to ${this.external}/phone`));
                    resolve();
                });
            })
        })
    }
}

module.exports = Server;
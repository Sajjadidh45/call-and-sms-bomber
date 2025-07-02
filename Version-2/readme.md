# SMS Bomb

Use Twilio to bombard a phone number with a message and listen for a response.

We are not responsible for how you use this script!

# Installation

```bash
npm install
```

# Usage

```bash
npm start
```

or

```bash
npm run start
```

or

```bash
node ./run.js
```

# Advanced Usage

| Option | Type | Description |
| --- | --- | --- |
|`--twilioSid` | (string) | Twilio SID |
|`--twilioToken` | (string) | Twilio Token |
|`--fromNum` | (string) | Sender Phone Number |
|`--toNum` | (string) | Recipient Phone Number |
|`--message` | (string) | Message |
|`--forwardFrom` | (string) | SMS Response Sender |
|`--forwardSmsTo` | (string) | SMS Response Recipient |
|`--forwardCallTo` | (string) | Call Response Recipient |
|`--stopOnSMS` | (string) | Stop on Response SMS |
|`--stopOnCall` | (string) | Stop on Response Call |
|`--count` | (number) | How many messages to send |
|`--interval` | (number) | Send Interval |
|`-h`, `--help` | | Show usage guide |
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const cla = require('command-line-args');
const clu = require('command-line-usage');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const ngrok = require('ngrok');
const twilio = require('twilio');
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const sleep = async (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    });
}
const randomWords = require('random-words');
const axios = require('axios');
const qs = require('qs');
module.exports = {
    inquirer,
    chalk,
    figlet,
    cla,
    clu,
    sleep,
    getRandomInt,
    express,
    http,
    bodyParser,
    ngrok,
    twilio,
    randomWords,
    axios,
    qs,
};
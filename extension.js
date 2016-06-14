'use strict';

const vscode = require('vscode');
const fs = require('fs');
const temp = require('temp').track();
const AppFactory = require('./lib/app-factory');
const Bootstrapper = require('./lib/bootstrapper');

exports.activate = context => {
    const logger = console;
    const vscCommands = vscode.commands;
    const appFactory = new AppFactory({vscode, logger, fs, temp});
    new Bootstrapper({appFactory, vscCommands}).initiate(context);
};

exports.deactivate = () => {};

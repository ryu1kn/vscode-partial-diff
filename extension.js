'use strict';

const vscode = require('vscode');
const AppFactory = require('./lib/app-factory');
const Bootstrapper = require('./lib/bootstrapper');

exports.activate = context => {
    const logger = console;
    const appFactory = new AppFactory({vscode, logger});
    new Bootstrapper({appFactory, vscode}).initiate(context);
};

exports.deactivate = () => {};

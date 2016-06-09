'use strict';

const vscode = require('vscode');
const Bootstrapper = require('./lib/bootstrapper');

exports.activate = context => {
    new Bootstrapper({logger: console}).initiate(vscode, context);
};

exports.deactivate = () => {};

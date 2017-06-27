'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rufo-atom:format': () => this.format()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  format() {
    console.log('Formatting...');

    filePath = atom.workspace.getActiveTextEditor().getPath()
    rootDir = atom.project.relativizePath(filePath)[0];

    var exec = require('child_process').exec;
    var spawn = require('child_process');
    var hasRufo = false;

    rufoInstalled = spawn.spawnSync('which', ['rufo']);

    if (rufoInstalled.stdout.toString()) {
      hasRufo = true;
    };

    if (!hasRufo) {
      throw new Error("Please install rufo");
    }

    exec('rufo ' + filePath, function(error, stdout, stderr) {
      console.log('stdout: ', stdout);
      if(stderr.length > 0) {
        throw stderr;
      }
    })
  }

};

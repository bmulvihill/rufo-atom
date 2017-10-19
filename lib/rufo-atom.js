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

    editor = atom.workspace.getActiveTextEditor()
    filePath = editor.getPath()
    rootDir = atom.project.relativizePath(filePath)[0];

    var exec = require('child_process').exec;
    var child_process = require('child_process');
    var hasRufo = false;

    rufoInstalled = child_process.spawnSync('which', ['rufo']);

    if (rufoInstalled.stdout.toString()) {
      hasRufo = true;
    };

    if (!hasRufo) {
      throw new Error("Please install rufo");
    }

    text = editor.getBuffer().getText();
    child = child_process.spawn('rufo');

    //command = ['rufo', [filePath]];
    child.stdin.write(text);
    child.stdin.end();

    var data = '';
    child.stdout.on('data', function(chunk) {
      data += chunk;
    });

    child.stdout.on('end', function() {
      editor.setText(data.toString());
      editor.save();
    });

    child.stderr.on('data', function(data){
      throw new Error(data.toString());
    })
  }

};

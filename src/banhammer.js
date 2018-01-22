'use strict';

/**
 *  Example input of files... generally found in /var/log/auth.log and such.
 *
 *  Oct 19 17:34:23 ubuntu sshd[1866]: Did not receive identification string from 10.0.0.0 
 *  Oct 19 17:34:28 ubuntu sshd[1867]: Did not receive identification string from 10.0.0.0 
 *  Eventually will be....
 *  @param {blob} blob
 *  @param {string} output
 *  let blob = 'a text file that has a bunch of ip\'s in it';
 *	let output = document.getElementById('div');
 *  logsToBadGuys(blob, output)
 */
const dropZone = document.getElementById('drop-zone');
const uploadForm = document.getElementById('upload-form');
const arrayWindow = document.getElementById('array-window');
const landingWindow = document.getElementById('landing-window');
const typeSelector = document.getElementById('type-selector');
const whitelistInput = document.getElementById('whitelist-input');
const output = document.getElementById('output');

const startMagic = function(files) {

  let file = 0;

  const reader = new FileReader();
  let blob = new Blob([files[file]], {
    type: "text/plain"
  });
  reader.onload = function() {

    let lines = this.result.split('\n');
    let badAddresses = [];
    for (let line = 0; line < lines.length; line++) {
      const ipPattern = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/ig;
      if (ipPattern.test(lines[line])) {
        let string = lines[line].toString();
        let matches = string.match(ipPattern);
        for (let match in matches) {
          let whitelist = whitelistInput.value.split(',');
          if (whitelist.indexOf(matches[match]) === -1) {
            if (badAddresses.indexOf(matches[match]) === -1) {
              badAddresses.push(matches[match]);
            };
          };
        };
      };
    };

    landingWindow.style.display = 'none';
    arrayWindow.style.display = 'flex';


    if (typeSelector.value === 'Cisco iOS') {
      output.append('ip access-list extended BLOCK\n');
      output.append('permit icmp any any echo-reply\n');
      output.append('permit icmp any any unreachable\n');
      output.append('deny icmp any any log\n');
      for (let ip in badAddresses) {
        let string = 'deny ip host ' + badAddresses[ip] + ' any log\n';
        output.append(string);
      };
      output.append('permit ip any any\n');
    };
    
    if (typeSelector.value === 'iptables') {
      for (let ip in badAddresses) {
        let string = 'sudo iptables -A INPUT -s ' + badAddresses[ip] + ' -j DROP\n';
        output.append(string);
      };
    };
    
    if (typeSelector.value === 'Mikrotik RouterBoard') {
      for (let ip in badAddresses) {
        let string = '/ip firewall filter add action=drop chain=input comment=\'BANNED\' in-interface=ether1 src-address=' + badAddresses[ip] + '\n';
        output.append(string);
      };
    };
    
    if (typeSelector.value === 'pfSense') {
      for (let ip in badAddresses) {
        let string = 'easyrule block wan ' + badAddresses[ip] + '\n';
        output.append(string);
      };
    };
    
    if (typeSelector.value === 'UFW') {
      for (let ip in badAddresses) {
        let string = 'sudo ufw deny from ' + badAddresses[ip] + ' to any\n';
        output.append(string);
      };
    };

  };
  reader.readAsText(blob);
  // };
};

uploadForm.addEventListener('submit', (event) => {
  let uploadFiles = document.getElementById('upload-files').files;
  event.preventDefault();
  startMagic(uploadFiles);
});

dropZone.ondrop = (event) => {
  event.preventDefault();
  this.className = 'upload-drop-zone';
  startMagic(event.dataTransfer.files);
};

dropZone.ondragover = () => {
  this.className = 'upload-drop-zone drop';
  return false;
};

dropZone.ondragleave = () => {
  this.className = 'upload-drop-zone';
  return false;
};

document.getElementById('copy')
  .addEventListener('click', (event) => {
    document.getElementById('output').select();
    document.execCommand('copy');
    if (output.value) {
      output.innerHTML = 'Copied to clipboard.';
    };
  });

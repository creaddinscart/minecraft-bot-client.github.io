var MBC = {
  name: 'MinecraftBotClient',
  shortName: 'MBC',
  version: '2.0.0',
  repo: 'creaddinscart/MinecraftBotClient',
  branch: 'main',
  links: {
    github:  'https://github.com/creaddinscart/MinecraftBotClient/',
    issues:  'https://github.com/creaddinscart/MinecraftBotClient/issues',
    discord: 'https://discord.gg/yY3nDGzSn5',
    qq:      'https://qm.qq.com/q/4nyFIEjn04',
    site:    'https://shit.pub',
    servers: 'https://shit.pub/an/tz/1007/gadd/',
    help:    'https://shit.pub/s/developer/minecraft/client/MinecraftBotClient-MBC/MBC/',
    docs:    'https://shit.pub/s/developer/minecraft/client/MinecraftBotClient-MBC/',
    verify:  'https://shit.pub/s/developer/minecraft/client/MinecraftBotClient-MBC/verify/txt.txt',
    announce:'https://shit.pub/s/developer/minecraft/client/MinecraftBotClient-MBC/announcement.txt'
  }
};

var MBC_SOURCES = [
  {
    id: 'github',
    label: 'GitHub Raw',
    note: 'Global CDN',
    raw: function (p) {
      return 'https://raw.githubusercontent.com/' + MBC.repo + '/' + MBC.branch + '/' + p;
    }
  },
  {
    id: 'local',
    label: 'Local / Mirror',
    note: 'Repository relative path',
    raw: function (p) {
      return '../' + p;
    }
  }
];

var MBC_RELEASES = [
  {
    version: '2.0.0',
    latest: true,
    files: {
      en: {
        windows: {
          zip: {
            label: 'Windows package (English)',
            file: 'en.zip',
            path: 'releases/2.0.0/windows/en.zip'
          },
          exe: {
            label: 'Windows client (English)',
            file: 'MinecraftBotClient-en.exe',
            path: 'releases/2.0.0/windows/en/MinecraftBotClient-en.exe'
          },
          cfg: {
            label: 'Config file (English)',
            file: 'config.en.json',
            path: 'releases/2.0.0/windows/en/config.en.json',
            bytes: 618
          },
          readme: {
            label: 'Readme (English)',
            file: 'README.en.md',
            path: 'releases/2.0.0/windows/en/README.en.md',
            bytes: 3651
          }
        },
        macos: {
          zip: {
            label: 'macOS package (English, arm64)',
            file: 'en.zip',
            path: 'releases/2.0.0/macos/en.zip',
            bytes: 9251615,
            sha256: '9697a79267cb0c05cab0464760b51d39664d8834e916d14a7287e552898e8ce2'
          },
          bin: {
            label: 'macOS client (English, arm64)',
            file: 'MinecraftBotClient-en',
            path: 'releases/2.0.0/macos/en/MinecraftBotClient-en',
            bytes: 9391472,
            sha256: '1e7f86c61847720d34944fda49ae13c4f45eb3fe22a574aba34734012d015ef8'
          },
          cfg: {
            label: 'Config file (English)',
            file: 'config.en.json',
            path: 'releases/2.0.0/macos/en/config.en.json',
            bytes: 618
          },
          readme: {
            label: 'Readme (English)',
            file: 'README.en.md',
            path: 'releases/2.0.0/macos/en/README.en.md',
            bytes: 3811
          }
        },
        linux: {
          zip: {
            label: 'Linux package (English)',
            file: 'en.zip',
            path: 'releases/2.0.0/linux/en.zip'
          },
          bin: {
            label: 'Linux client (English)',
            file: 'MinecraftBotClient-en',
            path: 'releases/2.0.0/linux/en/MinecraftBotClient-en'
          },
          cfg: {
            label: 'Config file (English)',
            file: 'config.en.json',
            path: 'releases/2.0.0/linux/en/config.en.json',
            bytes: 618
          },
          readme: {
            label: 'Readme (English)',
            file: 'README.en.md',
            path: 'releases/2.0.0/linux/en/README.en.md',
            bytes: 3678
          }
        }
      },
      zh: {
        windows: {
          zip: {
            label: 'Windows package (Chinese)',
            file: 'zh.zip',
            path: 'releases/2.0.0/windows/zh.zip'
          },
          exe: {
            label: 'Windows client (Chinese)',
            file: 'MinecraftBotClient-zh.exe',
            path: 'releases/2.0.0/windows/zh/MinecraftBotClient-zh.exe'
          },
          cfg: {
            label: 'Config file (Chinese)',
            file: 'config.zh.json',
            path: 'releases/2.0.0/windows/zh/config.zh.json',
            bytes: 618
          },
          readme: {
            label: 'Readme (Chinese)',
            file: 'README.zh.md',
            path: 'releases/2.0.0/windows/zh/README.zh.md',
            bytes: 3618
          }
        },
        macos: {
          zip: {
            label: 'macOS package (Chinese, arm64)',
            file: 'zh.zip',
            path: 'releases/2.0.0/macos/zh.zip',
            bytes: 9251575,
            sha256: '80fa57673fbc65f5084c478a972fa4883baad2a1c35070ab30a0621a8f80e997'
          },
          bin: {
            label: 'macOS client (Chinese, arm64)',
            file: 'MinecraftBotClient-zh',
            path: 'releases/2.0.0/macos/zh/MinecraftBotClient-zh',
            bytes: 9391280,
            sha256: 'b54926e2c90180924f8c20272b586894fbbe6a406dce111d4f2d4f1a3a7f0149'
          },
          cfg: {
            label: 'Config file (Chinese)',
            file: 'config.zh.json',
            path: 'releases/2.0.0/macos/zh/config.zh.json',
            bytes: 618
          },
          readme: {
            label: 'Readme (Chinese)',
            file: 'README.zh.md',
            path: 'releases/2.0.0/macos/zh/README.zh.md',
            bytes: 3799
          }
        },
        linux: {
          zip: {
            label: 'Linux package (Chinese)',
            file: 'zh.zip',
            path: 'releases/2.0.0/linux/zh.zip'
          },
          bin: {
            label: 'Linux client (Chinese)',
            file: 'MinecraftBotClient-zh',
            path: 'releases/2.0.0/linux/zh/MinecraftBotClient-zh'
          },
          cfg: {
            label: 'Config file (Chinese)',
            file: 'config.zh.json',
            path: 'releases/2.0.0/linux/zh/config.zh.json',
            bytes: 618
          },
          readme: {
            label: 'Readme (Chinese)',
            file: 'README.zh.md',
            path: 'releases/2.0.0/linux/zh/README.zh.md',
            bytes: 3666
          }
        }
      }
    }
  },
  {
    version: '1.3.1',
    latest: false,
    files: {
      zh: {
        windows: {
          zip: {
            label: 'Full package (Chinese)',
            file: 'zh.zip',
            path: 'releases/1.3.1/zh.zip',
            bytes: 17968230,
            sha256: '6fe7343098085fd2abc81909a2523bee4baee40039de3ebb59f351264be82e1c'
          },
          exe: {
            label: 'Standalone client (Chinese)',
            file: 'MinecraftBotClient-zh.exe',
            path: 'releases/1.3.1/zh/MinecraftBotClient-zh.exe',
            bytes: 18202130,
            sha256: '9b96bc209cc083302b62af82c2cdd038d1f2ba4f7bf49a45548f30c88ee268c7'
          },
          cfg: {
            label: 'Config file (Chinese)',
            file: 'config.zh.json',
            path: 'releases/1.3.1/zh/config.zh.json',
            bytes: 618
          },
          readme: {
            label: 'Readme (Chinese)',
            file: 'README.zh.md',
            path: 'releases/1.3.1/zh/README.zh.md',
            bytes: 3523
          }
        }
      },
      en: {
        windows: {
          zip: {
            label: 'Full package (English)',
            file: 'en.zip',
            path: 'releases/1.3.1/en.zip',
            bytes: 17964800,
            sha256: '04efc44c661b4a30c394e175a9f638f693ab8b5af7b34cb98191e3f9a0e5bd59'
          },
          exe: {
            label: 'Standalone client (English)',
            file: 'MinecraftBotClient-en.exe',
            path: 'releases/1.3.1/en/MinecraftBotClient-en.exe',
            bytes: 18199971,
            sha256: '912d80c052b494339e8130b7fd4c528ed23b39d8291c15ed403339bc4f854528'
          },
          cfg: {
            label: 'Config file (English)',
            file: 'config.en.json',
            path: 'releases/1.3.1/en/config.en.json',
            bytes: 618
          },
          readme: {
            label: 'Readme (English)',
            file: 'README.en.md',
            path: 'releases/1.3.1/en/README.en.md',
            bytes: 3553
          }
        }
      }
    }
  },
  {
    version: '1.0.3',
    latest: false,
    files: {
      zh: {
        windows: {
          exe: {
            label: 'Standalone client (Chinese)',
            file: 'MinecraftBotClient-zh.exe',
            path: 'releases/1.0.3/zh/MinecraftBotClient-zh.exe',
            bytes: 18198418,
            sha256: '4931952787e3eb05b6f5d1588f980f38944d3cff677638dd9f549d464048b925'
          },
          cfg: { label: 'Config file', file: 'config.zh.json', path: 'releases/1.0.3/zh/config.zh.json', bytes: 618 },
          readme: { label: 'Readme', file: 'README.zh.md', path: 'releases/1.0.3/zh/README.zh.md', bytes: 2087 }
        }
      },
      en: {
        windows: {
          exe: {
            label: 'Standalone client (English)',
            file: 'MinecraftBotClient-en.exe',
            path: 'releases/1.0.3/en/MinecraftBotClient-en.exe',
            bytes: 18196221,
            sha256: 'c93500d6f59a96d951a26cc83d9026b21331f5966a47516da340ad4e0e26f99f'
          },
          cfg: { label: 'Config file', file: 'config.en.json', path: 'releases/1.0.3/en/config.en.json', bytes: 618 },
          readme: { label: 'Readme', file: 'README.en.md', path: 'releases/1.0.3/en/README.en.md', bytes: 2062 }
        }
      }
    }
  },
  {
    version: '1.0.2',
    latest: false,
    files: {
      zh: {
        windows: {
          exe: {
            label: 'Standalone client (Chinese)',
            file: 'MinecraftBotClient-zh.exe',
            path: 'releases/1.0.2/zh/MinecraftBotClient-zh.exe',
            bytes: 18177241,
            sha256: 'ceb2443b5f0b619d556491155bc94db9270f7dbbeac7b1ee442b51c1ec062b5c'
          },
          cfg: { label: 'Config file', file: 'config.zh.json', path: 'releases/1.0.2/zh/config.zh.json', bytes: 257 },
          readme: { label: 'Readme', file: 'README.zh.md', path: 'releases/1.0.2/zh/README.zh.md', bytes: 2087 }
        }
      },
      en: {
        windows: {
          exe: {
            label: 'Standalone client (English)',
            file: 'MinecraftBotClient-en.exe',
            path: 'releases/1.0.2/en/MinecraftBotClient-en.exe',
            bytes: 18177584,
            sha256: '49d1465311d9af510e71aeb5f85c252b2d0b4ec8bb7bfa24fa71c42a3eecf6f5'
          },
          cfg: { label: 'Config file', file: 'config.en.json', path: 'releases/1.0.2/en/config.en.json', bytes: 272 },
          readme: { label: 'Readme', file: 'README.en.md', path: 'releases/1.0.2/en/README.en.md', bytes: 2062 }
        }
      }
    }
  }
];

var MBC_PROTOCOLS = [
  { range: '1.8',         examples: '1.8, 1.8.9',                      protocol: '47',        from: 1080,  to: 1089 },
  { range: '1.9 - 1.12',  examples: '1.9, 1.10.2, 1.11, 1.12.2',       protocol: '47 - 340',  from: 1090,  to: 1129 },
  { range: '1.13 - 1.16', examples: '1.13.2, 1.14.4, 1.15.2, 1.16.5',  protocol: '340 - 754', from: 1130,  to: 1169 },
  { range: '1.17 - 1.18', examples: '1.17, 1.18.2',                    protocol: '755 - 758', from: 1170,  to: 1189 },
  { range: '1.19',        examples: '1.19, 1.19.2, 1.19.4',            protocol: '759 - 760', from: 1190,  to: 1199 },
  { range: '1.20',        examples: '1.20 - 1.20.6',                   protocol: '763 - 766', from: 1200,  to: 1209 },
  { range: '1.21',        examples: '1.21 - 1.21.8',                   protocol: '767 - 773', from: 1210,  to: 1219 },
  { range: '25.x - 26.x', examples: '25.1 - 26.2',                     protocol: '774 - 777', from: 25000, to: 26999 }
];

var MBC_COMMANDS = [
  {
    group: 'Basics',
    groupId: 'core',
    items: [
      { cmd: '.help',    desc: 'List every MBC command and open the help website' },
      { cmd: '.esc',     desc: 'Leave the server but keep the client open (standby mode)' },
      { cmd: '.connect', desc: 'Reconnect to the server while in standby' },
      { cmd: '.respawn', desc: 'Send a respawn packet after dying' },
      { cmd: '.exit',    desc: 'Disconnect and close the client' }
    ]
  },
  {
    group: 'Logging',
    groupId: 'log',
    items: [
      { cmd: '.log on',  desc: 'Enable session logging into the log/ folder' },
      { cmd: '.log off', desc: 'Disable session logging' }
    ]
  },
  {
    group: 'Auto-spam',
    groupId: 'spam',
    items: [
      { cmd: '.spam on',            desc: 'Enable auto-spam' },
      { cmd: '.spam off',           desc: 'Disable auto-spam' },
      { cmd: '.spam rate <n>',      desc: 'Set the send rate in messages per second' },
      { cmd: '.spam add <message>', desc: 'Append a message to the spam list' },
      { cmd: '.spam remove <index>',desc: 'Remove a message by its index' },
      { cmd: '.spam list',          desc: 'List all spam messages' },
      { cmd: '.spam clear',         desc: 'Clear the spam list' },
      { cmd: '.spam status',        desc: 'Show the current auto-spam status' }
    ]
  },
  {
    group: 'Auto-walk',
    groupId: 'walk',
    items: [
      { cmd: '.walk start',      desc: 'Start random auto-walk' },
      { cmd: '.walk stop',       desc: 'Stop auto-walk' },
      { cmd: '.walk add <x,y,z>',desc: 'Add a custom waypoint using relative coordinates' },
      { cmd: '.walk list',       desc: 'List all waypoints' },
      { cmd: '.walk clear',      desc: 'Clear all waypoints' }
    ]
  },
  {
    group: 'Auto-eat',
    groupId: 'eat',
    items: [
      { cmd: '.eat on',  desc: 'Enable auto-eat on damage' },
      { cmd: '.eat off', desc: 'Disable auto-eat on damage' }
    ]
  },
  {
    group: 'Configuration',
    groupId: 'config',
    items: [
      { cmd: '.config <key>',       desc: 'Read the current value of any config key' },
      { cmd: '.config <key> <val>', desc: 'Change any config key and write it back to config.json' },
      { cmd: '.config fast_start true', desc: 'Example: enable fast start at runtime' },
      { cmd: '/command',            desc: 'Anything starting with a slash is sent to the server as a command' }
    ]
  }
];

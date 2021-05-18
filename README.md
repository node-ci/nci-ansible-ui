# nci ansible ui

Simple web interface for running Ansible playbooks.

It pulls your repository with playbooks and inventories according to project
config (which defines repository path, playbook and inventory directories inside
repository, etc) and allows you to run playbooks with inventories via single
page web interface (with live updates and pretty terminal output).


## Features

* single page web application which immediately responds to any
user interaction. This app doesn't use http api, it's built using socket.io
* online console output which is very close to terminal emulator
* can run one playbook with different inventories (sequentially)
* works with any Mercurial or Git repositories (no matter if it's a service like
Github, Bitbucket or private server, all you need is authenticate user from
which nci server is running without password e.g. by SSH key)
* minimal dependencies (only NodeJS, SCM client and Ansible are required)
* built on top of [nci](https://github.com/node-ci/nci), can extend
functionality by notification and other plugins

![nci-ansible-ui-execution](https://cloud.githubusercontent.com/assets/465522/21159795/e281871a-c19b-11e6-9dea-aac57440dffe.png)


## Changelog

All notable changes to this project documented in [CHANGELOG.md](CHANGELOG.md).


## Installation


### Docker image

It's recommended setup, image for nci ansible ui contains all dependencies
including ansible. You can try it using command:

```sh
docker run --rm -it -p 3000:3000 okvd/nci-ansible-ui
```

That's all, now you can experiment with it by adding/changing projects,
use web interface (on http://127.0.0.1:3000 by default) to run playbooks.

See [image page](https://hub.docker.com/r/okvd/nci-ansible-ui) for details.


### Native setup

System requirements:

* unix-like operating system, not tested on windows
* node.js >= 10
* git client >= 1.9 (only for building git projects)
* mercurial client >= 2.8 (only for building mercurial projects)
* ansible
* build tools - gcc, make, etc
(for building [LevelDB](https://github.com/level/leveldown) if binary is not
provided for your platform). E.g. ubuntu `build-essential` package provides
such tools.

On the system with satisfied requirements clone quick setup repository,
go into it and install dependencies:

```sh
git clone https://github.com/node-ci/nci-ansible-ui-quick-setup &&
cd nci-ansible-ui-quick-setup &&
npm install
```

run server:


```sh
node_modules/.bin/nci
```

Now you can experiment with it by adding/changing projects,
use web interface (on http://127.0.0.1:3000 by default) to run playbooks.

Sample project works with
[repository](https://github.com/node-ci/nci-ansible-ui-sample-playbook)
which contains sample playbooks (some ping, ps ax and other read commands) and
inventory. Inventory defines localhost as target host with following
settings:

```yaml
ansible_host: 127.0.0.1
ansible_user: ansible
ansible_ssh_private_key_file: ~/.ssh/id_rsa_test
```

you should provide such access (ansible will be run by user which started nci
server) in order to run sample project. Localhost
also should be in your known hosts file (you can try this access manually
to get prompt which can add it).


## License

MIT

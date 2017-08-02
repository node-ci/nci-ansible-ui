# nci ansible ui

Simple web interface for run ansible playbooks.

It pulls your repository with playbooks and inventories according to project
config (it defines repository path, playbook and inventory directories inside
repository, etc) and allows you to run playbooks with invetories via single
page web interface (with live updates and pretty terminal output).

## Features

* single page web application which immediately responds on any
user interaction. This app doesn't use http api, it's built using socket.io
* online console output which is very close to terminal emulator
* can run one playbook with different inventories (sequentially)
* working with any mercurial, git repositories (no matter is it service like
github, bitbucket or private server, all you need is authenticate user from
which nci server is running without password e.g. by ssh key)
* minimal dependencies (only nodejs, scm client and ansible are required)
* built on top of [nci](https://github.com/node-ci/nci), can extend
functionality by notification and other plugins

![nci-ansible-ui-execution](https://cloud.githubusercontent.com/assets/465522/21159795/e281871a-c19b-11e6-9dea-aac57440dffe.png)

## System requirements

* unix-like operating system, not tested on windows
* node.js >= 0.10
* git client >= 1.9 (only for building git projects)
* mercurial client >= 2.8 (only for building mercurial projects)
* ansible
* build tools - gcc, make, etc (for building [LevelDB](https://github.com/level/leveldown) if binary is not provided for your platform). E.g. ubuntu ```build-essential``` package provides such tools.

## Quick setting up

On the system with satisfied [requirements](#system-requirements) clone
quick setup repo, go into it and install dependencies:

```sh

git clone https://github.com/node-ci/nci-ansible-ui-quick-setup && \
cd nci-ansible-ui-quick-setup && \
npm install

```

run server:


```sh

node_modules/.bin/nci

```

Alternatively you can run it within docker, e.g. by running (see [image page](https://hub.docker.com/r/jc21/nci-ansible-ui/) for details):

```sh
docker run -p 3000:3000 jc21/nci-ansible-ui
```

That's all, now you can experiment with it by adding/changing projects,
use web interface (on http://127.0.0.1:3000 by default) for run playbooks.

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

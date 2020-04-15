#!/bin/sh

if [ "$GID" != "" ] && [ "$UID" != "" ]; then
	USER="nci-ansible-ui";

	echo "*** Running nci";
	echo "USER: $USER, UID: $UID, GID: $GID";
	ansible --version;
	echo "nodejs: `node --version`";
	bundledDependencies=`cd /var/nci-ansible-ui && npm ls --prod --depth=0`;
	echo -e "Bundled dependencies:\n$bundledDependencies";
	echo "***";

	# user may alredy exist if running earlier created container
	if ! id -u "$USER" > /dev/null 2>&1; then
		addgroup -g "$GID" "$USER" &&
		adduser --disabled-password --ingroup "$USER" --uid "$UID" "$USER";
	fi;

	cd /var/nci-ansible-ui &&
	su "$USER" -c node_modules/.bin/nci;
else
	echo "UID, GID environment variables must be set";
	exit 1;
fi;

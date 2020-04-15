#!/bin/sh

echo "UID = $UID; GID = $GID";

if [ "$GID" != "" ] && [ "$UID" != "" ]; then
	USER="nci-ansible-ui";
	# user may alredy exist if running earlier created container
	if ! id -u "$USER" > /dev/null 2>&1; then
		addgroup -g "$GID" "$USER" &&
		adduser --disabled-password --ingroup "$USER" --uid "$UID" "$USER";
	fi;

	cd /var/nci-ansible-ui &&
	su "$USER" -c node_modules/.bin/nci;
else
	cd /var/nci-ansible-ui &&
	node_modules/.bin/nci;
fi;

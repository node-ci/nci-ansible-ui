#!/bin/sh

echo "UID = $UID; GID = $GID";

if [ "$GID" != "" ] && [ "$UID" != "" ]; then
	USER=user;
	addgroup -g "$GID" "$USER" &&
	adduser --disabled-password --ingroup "$USER" --uid "$UID" "$USER";

	cd /var/nci-ansible-ui &&
	su "$USER" -c node_modules/.bin/nci;
else
	cd /var/nci-ansible-ui &&
	node_modules/.bin/nci;
fi;

#!/bin/sh

if [ `id -u` -ne 0 ]; then
	echo "Current user must be root";
	exit 1;
fi;

if [ "$UID" != "" ] && [ "GUID" != "" ]; then
	USER="nci-ansible-ui";
else
	USER="root";
	UID=0;
	GID=0;
fi;

# user may already exist if running earlier created container
if ! getent passwd "$UID" > /dev/null 2>&1; then
	addgroup -g "$GID" "$USER" &&
	adduser --disabled-password --ingroup "$USER" --uid "$UID" "$USER";
fi;

HOME=`getent passwd "$UID" | cut -d: -f6`;

echo "*** Running nci";
echo "USER: $USER, UID: $UID, GID: $GID, HOME: $HOME";
cat /var/nci-ansible-ui/dependencies-info.txt;
echo "***";


cd /var/nci-ansible-ui &&
su "$USER" -c node_modules/.bin/nci;

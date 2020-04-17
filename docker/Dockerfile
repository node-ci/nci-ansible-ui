FROM alpine:3.10.4

ENV NODE_ENV="production"
ENV USER="nci-ansible-ui-installer"
ENV USER_ID=2000
ENV USER_GORUP_ID=2000

RUN addgroup -g "$USER_GORUP_ID" "$USER" && \
	adduser --disabled-password --ingroup "$USER" --uid "$USER_ID" "$USER";

RUN apk add openssh git rsync nodejs npm ansible && \
	mkdir /var/nci-ansible-ui

ADD package.json package-lock.json /var/nci-ansible-ui/
ADD data /var/nci-ansible-ui/data

RUN chown -R "$USER":"$USER" /var/nci-ansible-ui

USER ${USER}

RUN cd /var/nci-ansible-ui && \
	npm ci --only=prod && \

	ansible --version >> dependencies-info.txt && \
	echo "nodejs: `node --version`" >> dependencies-info.txt && \
	npmPackages=`cd /var/nci-ansible-ui && npm ls --prod --depth=0 | tail -n +2` && \
	echo -e "npm packages:\n$npmPackages" >> dependencies-info.txt;

USER root

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

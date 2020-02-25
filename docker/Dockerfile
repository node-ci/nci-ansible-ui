FROM alpine:3.10.1

ENV NODE_ENV=production

RUN apk add --update openssh git nodejs npm &&\
	useradd nci &&\
	mkdir /var/nci-ansible-ui &&\
	chown nci:nci /var/nci-ansible-ui

USER nci

ADD package.json /var/nci-ansible-ui/package.json

RUN cd /var/nci-ansible-ui &&\
	npm install --production

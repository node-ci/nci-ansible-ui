FROM alpine:3.10.1

ENV NODE_ENV=production
ENV USER=nci
ENV UID=2000
ENV GID=2000

RUN addgroup -g "$GID" "$USER" &&\
	adduser --disabled-password --ingroup "$USER" --uid "$UID" "$USER";

RUN apk add openssh git nodejs npm &&\
	mkdir /var/nci-ansible-ui

ADD package.json /var/nci-ansible-ui/package.json
ADD data /var/nci-ansible-ui/data

RUN chown -R "$USER":"$USER" /var/nci-ansible-ui

USER ${USER}

RUN cd /var/nci-ansible-ui &&\
	npm install --production

USER root
ADD entrypoint.sh /entrypoint.sh
RUN chmod u+x entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

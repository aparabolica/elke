FROM node:7.3.0

EXPOSE 3030

# Install ffmpeg
RUN echo "deb http://www.deb-multimedia.org jessie main non-free" >> /etc/apt/sources.list && \
  apt-get update && apt-get install -y --force-yes deb-multimedia-keyring && \
  apt-get -q update && apt-get -q -y install ffmpeg

# Grab gosu for easy step-down from root
ENV GOSU_VERSION 1.7
RUN set -x \
	&& wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture)" \
	&& wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture).asc" \
	&& export GNUPGHOME="$(mktemp -d)" \
	&& gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
	&& gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu \
	&& rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc \
	&& chmod +x /usr/local/bin/gosu \
	&& gosu nobody true

# Setup env
ENV APP_USER=node
ENV HOME=/home/node
ENV DATA_DIR=/data
ENV LOGS_DIR=/logs

# Create video data directory and assign permissions
RUN mkdir $DATA_DIR && chown $APP_USER:$APP_USER $DATA_DIR
VOLUME $DATA_DIR

# Create nginx logs directory and assign permissions
RUN mkdir $LOGS_DIR && chown $APP_USER:$APP_USER $LOGS_DIR
VOLUME $LOGS_DIR

# Copy config files and assign app directory permissions
WORKDIR $HOME/elke
COPY . $HOME/elke/

# Install global npm dependencies and app
RUN npm install -g nodemon bower && \
  chown -R $APP_USER:$APP_USER $HOME/elke && \
  gosu $APP_USER:$APP_USER npm install && \
  gosu $APP_USER:$APP_USER bower install -F

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Run node server
CMD ["node", "src/"]

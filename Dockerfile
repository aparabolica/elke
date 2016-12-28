FROM node:7.3.0

EXPOSE 3030

# Install ffmpeg
RUN echo "deb http://www.deb-multimedia.org jessie main non-free" >> /etc/apt/sources.list && \
  apt-get update && apt-get install -y --force-yes deb-multimedia-keyring && \
  apt-get -q update && apt-get -q -y install ffmpeg

# Add app user
RUN useradd --user-group --create-home --shell /bin/bash app

# Setup env
ENV APP_USER=app
ENV HOME=/home/app
ENV DATA=/data

# Install global npm dependencies
RUN npm install -g nodemon bower

# Copy config files and assign app directory permissions
WORKDIR $HOME/elke
COPY package.json bower.json $HOME/elke/

# Create video data directory and assign permissions
RUN mkdir /data

# Install app
RUN npm install && \
  bower install -F --allow-root && \
  chown -R $APP_USER:$APP_USER $HOME/elke

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Run node server
CMD ["node", "src/"]

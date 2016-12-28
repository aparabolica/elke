FROM node:6.9.2

EXPOSE 3030

# Install ffmpeg
RUN echo "deb http://www.deb-multimedia.org jessie main non-free" >> /etc/apt/sources.list && \
  apt-get update && apt-get install -y --force-yes deb-multimedia-keyring && \
  apt-get -q update && apt-get -q -y install ffmpeg

# Add app user
RUN useradd --user-group --create-home --shell /bin/false app

# Setup env
ENV HOME=/home/app
ENV DATA=/data

# Install global npm dependencies
RUN npm install -g nodemon bower

# Copy config files and assign app directory permissions
WORKDIR $HOME/elke
COPY package.json bower.json $HOME/elke/
RUN chown -R app:app $HOME/*

# Create video data directory and assign permissions
RUN mkdir -p /data && \
  chown -R app:app /data

# Change user to app
USER app

# Install app
RUN npm install
RUN bower install -F

# Run node server
CMD ["node", "src/"]

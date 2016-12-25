FROM node:6.9.2

EXPOSE 3030

# update and upgrade packages
RUN useradd --user-group --create-home --shell /bin/false app

RUN mkdir -p /data && \
  chown -R app:app /data

ENV HOME=/home/app
ENV DATA=/data

# Install global npm dependencies
RUN npm install -g nodemon bower

WORKDIR $HOME/elke
COPY package.json bower.json $HOME/elke/
RUN chown -R app:app $HOME/*

USER app

# Install app
RUN npm install
RUN bower install

CMD ["node", "src/"]

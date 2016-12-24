FROM node:6.9.2

EXPOSE 3030

# update and upgrade packages
RUN useradd --user-group --create-home --shell /bin/false app

# Install global npm dependencies
RUN npm install -g nodemon bower

ENV HOME=/home/app

USER app
WORKDIR $HOME/elke
COPY package.json bower.json $HOME/elke/
RUN chown -R app:app $HOME/*

# Install app
RUN npm install
RUN bower install

CMD ["node", "src/"]

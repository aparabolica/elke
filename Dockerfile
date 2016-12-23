FROM ubuntu:trusty

EXPOSE 3030

# update and upgrade packages
RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get clean && \
  apt-get install -y --no-install-recommends build-essential wget software-properties-common curl git

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

# Install node
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get install -y nodejs build-essential

# Install global npm dependencies
RUN npm install -g nodemon bower

# Install app
RUN npm install
RUN bower install

CMD ["node", "src/"]

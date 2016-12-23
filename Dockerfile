FROM ubuntu:trusty

EXPOSE 3030

# update and upgrade packages
RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get clean && \
  apt-get install -y --no-install-recommends build-essential wget software-properties-common curl

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

# Install node
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get install -y nodejs build-essential

# Install nodemon for development
RUN npm install -g nodemon

# Install app
RUN npm install

CMD ["node", "src/"]

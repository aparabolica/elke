# elke

> Own your video network

## About

A node/postgres platform to manage livestreaming with nginx RTMP module.

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Build and run from docker

```
$ docker-compose up
```

## Scaffolding

Feathers has a powerful command line interface. Connect to `elke` container:

```
$ docker ps # grab elke container name or id
$ docker exec -it [container name or id] /bin/bash
```

Here are a few things it can do:

```
$ npm install -g feathers-cli             # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).

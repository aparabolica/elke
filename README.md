# elke

## Build and run

```
$ docker build -t elke .
$ docker run -p 8080:80 -p 1935:1935 -p 3000:3000 -d elke
```

## Access docker container

```
# Get container ID
$ docker ps
# Access
$ docker exec -it <container id> /bin/bash -c "export TERM=xterm; exec bash"
```

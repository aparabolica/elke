FROM ubuntu:trusty

EXPOSE 1935
EXPOSE 80

ENV DATA_DIR=/data
ENV LOGS_DIR=/logs
ENV WWW_USER=www

ENV NGINX_VERSION=1.12.0
ENV RTMP_VERSION=1.1.11

# Add www user
RUN useradd --user-group --shell /bin/bash www

# Create directories
RUN mkdir -p \
  /src \
  /config \
  $DATA_DIR \
  $LOGS_DIR && \
  chown -R www:www $DATA_DIR $LOGS_DIR

VOLUME $DATA_DIR
VOLUME $LOGS_DIR

# Update and upgrade packages
RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get clean && \
  apt-get install -y --no-install-recommends build-essential \
  wget software-properties-common curl && \
# Install ffmpeg
  add-apt-repository ppa:mc3man/trusty-media && \
  apt-get update && \
  apt-get install -y --no-install-recommends ffmpeg && \
# Install NGINX dependencies
  apt-get install -y --no-install-recommends libaio1 libpcre3-dev \
  zlib1g-dev openssl libssl-dev wget && \
  rm -rf /var/lib/apt/lists/*

# Get nginx source
WORKDIR /src
RUN wget http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz && \
  tar zxf nginx-$NGINX_VERSION.tar.gz && \
  rm nginx-$NGINX_VERSION.tar.gz && \
# Get nginx-rtmp module
  wget https://github.com/arut/nginx-rtmp-module/archive/v$RTMP_VERSION.tar.gz && \
  tar zxf v$RTMP_VERSION.tar.gz && \
  rm v$RTMP_VERSION.tar.gz

# Compile nginx
WORKDIR /src/nginx-$NGINX_VERSION
RUN ./configure --add-module=/src/nginx-rtmp-module-$RTMP_VERSION \
  --user=www \
  --with-file-aio \
  --with-debug \
  --with-http_realip_module \
  --conf-path=/config/nginx.conf \
  --error-log-path=/logs/error.log \
  --http-log-path=/logs/access.log && \
  make && \
  make install && \
  ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx

# Add nginx config file
ADD nginx.conf /config/nginx.conf

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

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /logs/access.log \
  && ln -sf /dev/stderr /logs/error.log

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Run nginx server
CMD ["nginx", "-g", "daemon off;"]

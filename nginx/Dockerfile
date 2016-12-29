FROM ubuntu:trusty

EXPOSE 1935
EXPOSE 80

ENV DATA=/data
ENV WWW_USER=www

# Add www user
RUN useradd --user-group --shell /bin/bash www

# Create directories
RUN mkdir -p /src /config /logs /data && chown -R www:www /data
VOLUME /data

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
RUN wget http://nginx.org/download/nginx-1.10.2.tar.gz && \
  tar zxf nginx-1.10.2.tar.gz && \
  rm nginx-1.10.2.tar.gz && \
# Get nginx-rtmp module
  wget https://github.com/arut/nginx-rtmp-module/archive/v1.1.10.tar.gz && \
  tar zxf v1.1.10.tar.gz && \
  rm v1.1.10.tar.gz

# Compile nginx
WORKDIR /src/nginx-1.10.2
RUN ./configure --add-module=/src/nginx-rtmp-module-1.1.10 \
  --user=www \
  --with-file-aio \
  --with-debug \
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

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Run nginx server
CMD ["nginx"]

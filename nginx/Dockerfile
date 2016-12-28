FROM ubuntu:trusty

EXPOSE 1935
EXPOSE 80

RUN useradd --user-group --create-home --shell /bin/false www

# Create directories
RUN mkdir -p /src /config /logs /data

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

# Data directory permissions to www user/group
RUN chown -R www:www /data

# Run nginx server
CMD "nginx"

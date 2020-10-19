FROM debian:stable-slim

ENV DEBIAN_FRONTEND noninteractive

# Install packages
RUN apt-get update -qq  && \
apt-get install -qy wget curl perl tzdata libwww-perl libio-socket-ssl-perl libnet-ssleay-perl supervisor && \
apt-get clean -qy && \
rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY . /squeezeboxserver

# Volume and port setup
RUN mkdir -p /config /music /playlist

RUN useradd squeezeboxserver && \
usermod -u 99 squeezeboxserver && \
usermod -g 100 squeezeboxserver && \
chown -R squeezeboxserver:users /config /music /playlist

VOLUME /config /music /playlist

USER squeezeboxserver
ENTRYPOINT ["/squeezeboxserver/slimserver.pl", "--prefsdir", "/config/prefs", "--logdir", "/config/logs", "--cachedir", "/config/cache"]

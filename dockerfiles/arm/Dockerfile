FROM txn2/asws:armhf-1.2.1
RUN mkdir /www && mkdir /files
COPY www/ www/
COPY asws /

WORKDIR /

CMD ["/asws"]
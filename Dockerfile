FROM txn2/asws:armhf-1.1.2

COPY ./www /www

WORKDIR /

ENTRYPOINT ["/asws"]

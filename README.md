# kdash

Example of serving [kdash docker container] on port 2701 on the local server:

```bash
docker run -e DEBUG=true -p 2701:80 txn2/kdash:latest
```

## Local Development

```bash
docker run -e DEBUG=true -v "$(pwd)"/www:/www -p 2701:80 txn2/kdash:latest
```

[kdash docker container]: https://hub.docker.com/r/txn2/kdash/
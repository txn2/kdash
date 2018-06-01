# kdash


### Development

Use the [asws] docker container for local development and testing:

```bash
docker run -e DEBUG=true -p 2701:80 -v "$(pwd)"/www:/www txn2/asws:1.2.1
```

[asws]: https://github.com/txn2/asws
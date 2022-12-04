## Installation

```bash
$ npm install
```

## Running the app

```bash
# Redis Local
$ sudo docker-compose up redis

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# everything in docker
$ docker-compose up -d --build # this will build and run the service dockerized along with its dependency mongodb

# check what is running in docker-compose
docker-compose ps

# close everything
docker-compose down

```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:full
```

## TODO

1. Dealing with Reality in a more convinient way without so much boilerplate code
1. optimizing dockerfile for dependency caching
1. making sure everything works correctly with our CICD
1. fix swagger ui not sending some cars requests

## Notibal APIs

- Whoami (service metadata)
  - `localhost:3000/whoami`
- Swagger
  - UI: `localhost:3000/api`
  - openapi json spec `localhost:3000/api-json`
- health
  - `localhost:3000/health` this covers both liveness and readiness
- Prometheus Metrics
  - `localhost:3000/metrics`
- Root API
  - `localhost:3000/api/v1/cars`

## More Info

### Logging

Use tsgs-logger package for loggging as described in the tsgs-logger readme.
Use Logger imported from `@nestjs/common`, instantiate it with the name of the current class.

For `info` write logs like this: `this.logger.log('some message');`
For `debug` write logs like this: `this.logger.debug('some message');`

In local development, logs will be automatically colored and prettified. log level will be `error`
Set the log level using the 'log' api, added by the tsgs-logger automatically.

In docker logs will be uncolored and not prettified. log level will be `error` so you wont see `debug` level logs.
To see debug level logs in docker, set `LOG_LEVEL` environment variable to `debug` when starting the docker container.

#### Mongodb/Mongoose Logging

In production, mongoose logging is disabled. In development is enabled and on level `error`
to simulate production: `NODE_ENV=production npm run start`
to view debug/mongoose logs in production `NODE_ENV=production LOG_LEVEL=debug DATABASE_DEBUG=true`

test

## Description
A simple REST API.

## Project setup

```bash
$ yarn
```

## Compile and run the project

```bash
# development mode
$ yarn dev

# production mode
$ yarn build && yarn prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Decisions

- Fastify is used instead of express because who does not like faster response times?
- Biome is used instead of eslint+prettier because it is a more modern and complete tool and works way faster.
- SWC is used instead of TSC because who does not like faster build times?
- Vitest is used instead of Jest because it is faster and has a better API. (Being "faster" was tested with a POC by me before)


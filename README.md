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
- sqlite is used as a database because it is easy to set up and use. More than enough for the business needs of this project.
Also, it is a single file sqlite database, because that was enough for the requirements. No need to overengineer things, right?
- Kysely is used to access the database because it provides a typesafe way to interact with the database. Also, I do not like opinionated ORMs and I want to be able design my own ORM-like structure if it comes to that point in the future and this is actually quite simple using query builders.
- Fastify is used instead of express because who does not like faster response times?
- Biome is used instead of eslint+prettier because it is a more modern and complete tool and works way faster.
- SWC is used instead of TSC because who does not like faster build times?
- Vitest is used instead of Jest because it is faster and has a better API. (Being "faster" was tested with a POC by me before)
- DDD is not a folder structuring mechanism. So, a project should not be obliged to have folders like "domain", "infra", "application", etc.
It is a way of thinking about the project. So, the project is structured in a way that it is easy to understand and navigate.
This project has a "src" folder and inside it, there are folders for each module. Each module has its own "controller", "service", "repository", etc.
This way, DDD can still be applied by considering the layers in individual files. The modular structure of NestJS fits much better with the DDD way of thinking.
Also, it is way easier to read and understand what the project does.
- The hybrid approach of using NestJS' modular structure and DDD's way of thinking is applied to individual sub-parts of modules.
To be more exact: application layer lies in controller and dto files, domain layer lies in entity and service, and infrastructure layer lies in a single module that exports the injectable Kysely instance.
I did not want to crate a repository layer because it is not needed in this project. The service layer is enough to handle the business logic.
- All Data Transfer Objests are named *Request or *Response to make it clear what they are used for. It is more understandable than using the DTO suffix in my opinion.
- Pino is used as a logger because it is fast, async and json formatted already. So, why not?.

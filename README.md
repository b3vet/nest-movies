## Berkeflix - A modern NestJS app

--- 

A simple REST API template basically. Perfect for starting a new project. Has lots of cool features.

## Project setup

---

```bash
$ yarn
```

## Compile and run the project

---

```bash
# development mode
$ yarn dev

# production mode
$ yarn build && yarn prod
```

## Run tests

---

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## Decisions

---

- Node 23 and Nest 11 and yarn 4.6 is used in the project as they were the latest versions I am used to.
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
- All Data Transfer Objects are named *Request or *Response to make it clear what they are used for. It is more understandable than using the DTO suffix in my opinion.
- Pino is used as a logger because it is fast, async and json formatted already. So, why not?.
- Tests were not added to all modules because of time constraints. However, test examples can be found in AuthModule and WatchModule.
The rest of the modules' tests would be quite similar to these examples. If I had more time, I would add tests to all modules.
- Adding all the nice to haves (such as movie filtering, movie addition validations, bulk endpoints, etc.) would be cool, but again, time constraints..
- Adding movie and session modification features would be cool, but again, time constraints..

## Deployment

---

- I am in love with Coolify. Get a simple VPS, connect the repository, create a Dockerfile for the builds and deployments, and you are good to go.
Everything being this simple and useful about Coolify is perfect. I am using it for my personal projects and I am very happy with it.
Just before thinking about deploying the project, I thought about getting a VM from some free tier cloud provider and deploying the project there using Github actions.
Then after going through Microsoft registeration flow disaster, I remembered Coolify and decided to use it. It is way easier and faster.
You can even try it: [here](http://b4wg8k8w4sw04ww8owco4wc8.82.29.177.217.sslip.io/docs).
- The server is a little vps from Hostinger. I got one to test Coolify and it is working perfectly. Set-up of coolify is as simple as running a docker image on an ubuntu server.
- Coolify is so cool that I could spin up a postgres, redis, rabbitmq or literally any kind of service that has a docker image in seconds without any hassle.
- CI/CD is done with a hook on the repo's main branch. It is created via Coolify.

## What to do if this was a larger project?

---

- I would add a repository layer to handle the database operations. This way, the service layer would be more clean and would only contain business logic.
- I would add more tests to cover all the modules.
- I would probably use a real database like Postgres (maybe with a multi-cluster architecture if you are serious enough).
  - I would add a migration mechanism to handle the database schema changes (kysely provides a nice and clean api for this).
- I would add a caching layer to cache the responses of the API. (No need for fancy solutions, a simple Redis would be enough, or even a simpler [in-memory cache](https://www.npmjs.com/package/typescript-memoize) on service layer)
- I would decouple the modules by using a solution like RabbitMQ or even a simpler CQRS setup. I did not do it here because it would be a bit overkill for this project.
- I would push the docker image to a registry and use it in the deployment on a multi-node structure. I would add a load-balancer in front of the nodes.
- I would add a monitoring solution like Prometheus and Grafana to monitor the health of the nodes. (Way simple with coolify!)
- I would add a logging solution like Kibana to monitor the logs of the nodes. (Way simple with coolify!)
- I would create automation tests to test the API endpoints. (Actual e2e testing)
- I would add a rate limiting solution to prevent abuse of the API.
- I would add create performance, peak, load and stress test scripts to test the API under different conditions.
- I would add a backup solution to back up the database.
- I would add a monitoring solution (a simple cron-job to check the health of the API using healthcheck endpoint and alert if there is a problem) to monitor the health of the nodes.
- I would add an alerting mechanism both on logs and metrics to alert me if there is a problem with the API. (Both simple and possible with Kibana and Grafana)

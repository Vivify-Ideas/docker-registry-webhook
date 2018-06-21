# VivifyIdeas Git webhook processer server

### How does it work ?

1. Git hosting service (github, gitlab, etc..) sends Push Event webhook to this server
2. Server detects what service is it and calls corresponding git service payload parser
3. Server checks if repository from webhook exists in `servers-list.json` and on filesystem
4. If repository exists, server will build Docker image, tag and push it to given Docker registry (reading from env variable REGISTRY_URL or fallback to `registry.vivifyideas.com`)
5. If everything was done successfully, server will send outbound webhook to given URL for specific branch (also in `servers-list.json`)
> Multiple Dockerfiles projects are also supported, check example `servers-list.json` below.
  
> Docker builds/pushes are done asynchronous, so building project with multiple Dockerfiles is really fast.
  
> For example, when we migrated from Dockerhub to this processer we dropped build time from ~25 minutes to ~5 minutes on our project [VivifyScrum](https://www.vivifyscrum.com/).

## Example of outbound webhook payload with single Dockerfile

```json
{
  "projectName": "backend-api-go",
  "namespace": "vivifyscrum",
  "branches": {
    "master": "http://127.0.0.1:8099"
  },
  "images": [
    {
      "name": "backend-api-go:master",
      "registryUrl": "registry.vivifyideas.com",
      "fullUrl": "registry.vivifyideas.com/backend-api-go:master"
    }
  ]
}
```

## Example of outbound webhook payload with multiple Dockerfiles

```json
{
  "projectName": "what-the-hack-backend",
  "namespace": "vivifyscrum",
  "branches": {
    "master": "http://127.0.0.1:8099"
  },
  "dockerFiles": [
    {
      "dockerFileName": "Dockerfile",
      "suffix": "laravel"
    },
    {
      "dockerFileName": "websockets/Dockerfile",
      "suffix": "sockets"
    }
  ],
  "images": [
    {
      "name": "what-the-hack-backend-laravel:master",
      "registryUrl": "registry.vivifyideas.com",
      "fullUrl": "registry.vivifyideas.com/what-the-hack-backend-laravel:master"
    },
    {
      "name": "what-the-hack-backend-sockets:master",
      "registryUrl": "registry.vivifyideas.com",
      "fullUrl": "registry.vivifyideas.com/what-the-hack-backend-sockets:master"
    }
  ]
}
```

## `servers-list.json` details

### Example

```json
[
  {
    "projectName": "employee-microservice-node",
    "namespace": "vivifyscrum",
    "branches": {
      "master": "http://127.1.1.1:8080"
    }
  },
  {
    "projectName": "hyper",
    "namespace": "vivifyscrum",
    "branches": {
      "os-locale": "http://127.0.0.1:8888",
      "screenshot": "http://127.0.0.1:8888"
    }
  },
  {
    "projectName": "what-the-hack-backend",
    "namespace": "vivifyscrum",
    "branches": {
      "master": "http://127.0.0.1:8099"
    },
    "dockerFiles": [
      {
        "dockerFileName": "Dockerfile",
        "suffix": "laravel"
      },
      {
        "dockerFileName": "websockets/Dockerfile",
        "suffix": "sockets"
      }
    ]
  },
  {
    "projectName": "backend-api-go",
    "namespace": "vivifyscrum",
    "branches": {
      "master": "http://127.0.0.1:8099"
    }
  }
]
```

- Branches property tells what git repositories branches should server build
- If exists, `dockerFiles` property tells how to handle projects with multiple Dockerfiles

## How to initialize projects ?

On server you can execute `init-project.js` that will do git pull of project and add it to `servers-list.json`.
Typical usage of this script : `node init-project.js repoName repoUrl repoBranch webhookUrl namespace`

## How to start this server ?

It's recommended to run this server in some kind of process manager like pm2, forever and similar.

> Server will listen on port from env variable PORT or try to bind to 8089.

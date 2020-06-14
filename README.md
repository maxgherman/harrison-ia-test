# harrison-ia test

## NodeJs REST APIs for image labeling facilitation

## Description

The project represents a collection of APIs for images and labels management. APIs provide the ability to persist and modify data using REST-full architecture. All presented artifacts are ready for production deployment using corresponding components. End-user scenarios cover following user cases:

* Create label
* Update label text
* Retrieve label by id
* Retrieve all labels
* Create image
* Update image
* Retrieve image metadata by id
* Retrieve all images metadata
* Retrieve specific image contents

## Technical stack

* API implementation language - [TypeScript](https://www.typescriptlang.org/)
* HTTP Server - [NodeJs](https://nodejs.org/)
* API Framework - [ExpressJs](https://expressjs.com/)
* Auth Provider - [Magic](https://magic.link/)
* Image metadata/Labels persistence - [PostgreSQL](https://www.postgresql.org/)
* Image content persistent - [AWS S3](https://aws.amazon.com/s3/)
* Infrastructure implementation language - [CloudFormation](https://aws.amazon.com/cloudformation/)
* Application life-cycle management - [ASW AKS](https://aws.amazon.com/eks/)

## Design decisions

- [x] API architecture - [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)
- [x] Application design
    - API interface - [Model-View-Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
    - Business logic - simplified [Onion Architecture](https://www.thinktocode.com/2018/08/16/onion-architecture/)
        - [Service layer pattern](https://en.wikipedia.org/wiki/Service_layer_pattern)
        - [Repository pattern](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design#the-repository-pattern)
- [x] Authentication
    - Password-less provider based one decentralized tokens
        - [Magic](https://magic.link/)
        - [Tokens](https://docs.magic.link/decentralized-id)
    - Session management - [PassportJs](http://www.passportjs.org/)
- [x] Metadata persistence
    - PostgreSQL
    - Relational schema
- [x] Image content persistent
    - ASW S3

## Source files outline

* application - application implementation content
    - public - front-end  artifacts
    - src - source file
        - repositories - data persistence layer
        - routes - API controllers
        - services  - service pattern layer
        - utils - cross cutting concerns implementation
            - middleware - express middleware
                - logging
                - global error handling
                - user detection
                - pii detection
            - logger - logging facility
        - `app.ts` - main application file
        - `index.ts` - application entry point            
    - test - test files
    - views - HTML rendering templates
* database - database related script
    - `docker.sh` - PostgreSQL local docker management
    - `schema.sql` - DB Schema scripts
* infrastructure - infrastructure as code content
    - eks - AKS provisioning artifacts
        - aws-auth-cm.yaml - EC2 nodes provision script
        - eks-cluster.yaml - cluster
        - eks-cluster-network.yaml - cluster network group
        - eks-nodegroup.yaml - cluster nodegroup
        - k8s.yaml - application container deployment script
    - user - user provisioning artifacts
        - user.yaml - creates user to be used for future infrastructure provisioning

## Local development
- [x] - Register application with [Magic](https://magic.link/) provider using preferred email address 
- [x] - Select `application` folder
- [x] - Create `.env` with the contents (provide missing values `?`)
   
```env   
# SERVER
ENVIRONMENT=dev
PORT=8080
SESSION_SECRET="super secret session"

# AUTH PROVIDER
MAGIC_SECRET_KEY=?
MAGIC_PUBLISHABLE_KEY=?

# DATABASE
DBUSER=postgres
DBPASSWORD=docker
DBHOST=localhost
DATABASE=harrison
DBPORT=5432

# ASW
AWS_ACCESS_KEY=?
AWS_SECRET_ACCESS_KEY=?

# S3 BUCKER NAME
AWS_S3=?
```

- [x] - Start local PostgreSQL container
    - database/docker.sh
- [x] - Create DB schema
    - Change provided email address to preferred one. It will be used as an admin account
    - database/schema.sh
- [x] - Install application dependencies/build/run

```sh
npm i
npm run build
npm start
```

- [x] - Navigate to http://localhost:8080
- [x] - Login using preferred email address




 
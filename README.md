# 1. About
This repository serves as a final showcase of my work and learnings, from my course "MIS".
The assignment due in this repo consists of turning a User-Story based BPMN into an integrated microservice application.
My only requirements were, to include Node.js, MongoDB and RESTful APIs in the microservices.

# 2. BPMN
The BPMN used for this assignment describes the creation and download of a monthly summary of a club's statistics. Called upon by an executive club member.

# 3. Microservices
I seperated the application into the following services. 
- Database Connection Service
- Report Creation Service

# 4. Other parts
Due to the nature of basing the Business process on a Webapp, we also need a functioning Frontend.
For that, I chose Angular.

# 5. Usage
1. Clone the repository and init the single node projects (db-con-service, rep-cre-service, frontend-microservices).
2. Run a mongod server with a copy of the db (not included in the repo)/make your own.
3. Run all 3 node servers
4. Open http://localhost:4200
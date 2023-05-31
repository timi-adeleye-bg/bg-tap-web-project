# BG Web Project

A project developed to address a sector of business model in BG

### Project Metadata

Stack = Node.js

Database = Postgres DB

Endpoint Test Environment = Postman

Framework = Express.js

Port = 3000

### How to run the app

-Clone the repo

-Open cloned folder and run `npm install`

- Create a new database in PostgresDB called `operations`

  -All other details for the db can be found in the .env file

  -Run `npm run files` to load the database with imported tables (nationality, state, lga, product, seed)

  -Run `npm run dev` to start the server.

  -Use a postman tool to interact with the endpoints. Visit any of the endpoints below with the correct request method

## Endpoints Available

### Authentication

User Signup - route POST /api/users/register

User login - route POST /api/users/login

User Profile Update - route PUT /api/users/login

### Operators

Operator registration - route POST /api/operator/register

Operator Profile Update - route PUT /api/operator/updateoperator

Operator Picture Upload - route PUT /api/operator/updatepicture

Select Product & seed type - route PUT /api/operator/:product_id/:seed_id

Operator Selections - route GET /api/operator/selection

Operator Recruit Field Officers - route POST /api/operator/recruit

### Admin

Fetch all Recruited Officers for an Operator - route GET /api/admin/operator/:id

Generate Test Questions for Field Officer - route GET /api/admin/questions/:id

Submit Assessment and Get Score - route POST /api/admin/assessment/:id

## Parameters for Each Endpoint

### Users

User Signup - {Name, email, password, role(operator || member)}

User login - {email, password}

### Operators

Operator registration - { full_name, phone_number, nationality, state, lga, sex, date_of_birth, nin }

Operator Profile Update - { fullName, phoneNumber, nationality, state, lga, sex, dateOfBirth, nin }

Operator Picture Upload - { userPicture(file) }

Product & Seed Type - { product_id, seedId } (req.params.id)

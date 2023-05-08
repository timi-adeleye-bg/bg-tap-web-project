# BG Web Project

A project developed to address a sector of business model in BG

### Project Metadata

Stack = Node.js
Database = MongoDB Atlas
Endpoint Test Environment = Postman
Framework = Express.js
Port = 5000

### How to run the app

-Clone the repo
-Open cloned folder and run `npm install`

- Create a new database in MongoDB called `operations`
  -All other details for the db can be found in the .env file
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

Operator Picture Update - route PUT /api/operator/updatepicture

Select Product & seed type - route PUT /api/operator/:product_id/:seedId

### States and LGAs

Import Countries - route POST /api/files/uploadcountry

import States - route POST /api/files/uploadstate

Import LGA - route POST /api/files/uploadlga

Import Products - route POST /api/files/product

Import Seeds - route POST /api/files/seed

## Parameters for Each Endpoint

### Users

User Signup - {Name, email, password, operator(true || false)}

User login - {email, password}

### Operators

Operator registration - { fullName, phoneNumber, nationality, state, lga, sex, dateOfBirth, nin, userPicture(file) }

Operator Profile Update - { fullName, phoneNumber, nationality, state, lga, sex, dateOfBirth, nin }

Operator Picture Update - { userPicture(file) }

Product & Seed Type - { product_id, seedId } (req.params.id)

# MongoMart
Final course project for M101JS - MongoDB for NodeJS Developers

# Installation
You can try this app locally by cloning and running it.

Follow these steps:
1) Make sure you have installed mongodb, nodejs and npm
2) Clone this repository in your own local machine
3) Open terminal and go to the root folder of the project
4) Install all dependencies by typing this command: npm install
5) Make sure you have a mongod instance running (version 3.2.x of MongoDB)
6) Import the "item" collection: mongoimport --drop -d mongomart -c item data/items.json
7) Import the "cart" collection: mongoimport --drop -d mongomart -c cart data/cart.json
8) Run the application by typing "node mongomart"
9) In your browser visit [http://localhost:3000](http://localhost:3000)

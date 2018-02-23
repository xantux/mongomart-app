# MongoMart
Final course project for M101JS - MongoDB for NodeJS Developers

# Installation
You can try this app locally by cloning and running it.

Follow these steps:
1) Make sure you have installed **mongodb**, **nodejs** and **npm**
2) Open terminal and clone this repository in your own local machine: **git clone https://github.com/xantux/mongomart-app.git**
3) In the terminal go to the root folder of the project: **cd mongomart-app**
4) Install all dependencies by typing the command: **npm install**
5) Make sure you run in other terminal instance the mongo process by typing the command **mongod**
6) Import the "item" collection: mongoimport -d mongomart -c item data/items.json
7) Import the "cart" collection: mongoimport -d mongomart -c cart data/cart.json
8) Run the application by typing **node mongomart**
9) In your browser visit [http://localhost:3000](http://localhost:3000)

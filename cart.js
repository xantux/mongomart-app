/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/


var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function CartDAO(database) {
    "use strict";

    this.db = database;


    this.getCart = (userId, callback) => {
        "use strict";

        this.db.collection('cart')
            .find({ "userId": userId })
            .limit(1)
            .next((err, userCart) => {
                assert.equal(err, null);
                callback(userCart);
            }
        );
    };


    this.itemInCart = (userId, itemId, callback) => {
        "use strict";

        this.db.collection("cart")
        .find({userId: userId, "items._id": itemId}, {"items.$": 1})
        .limit(1)
        .next((err, item) => {
            assert.equal(null, err);
            if (item != null) {
                item = item.items[0];
            }
            callback(item);
        });
    }


    this.addItem = (userId, item, callback) => {
        "use strict";

        this.db.collection("cart").findOneAndUpdate(
            {userId: userId},
            {"$push": {items: item}},
            {
                upsert: true,
                returnOriginal: false
            },
            (err, result) => {
                assert.equal(null, err);
                callback(result.value);
            });
    };


    this.updateQuantity = function(userId, itemId, quantity, callback) {
        "use strict";

        /*
        * TODO-lab7
        *
        * LAB #7: Update the quantity of an item in the user's cart in the
        * database by setting quantity to the value passed in the quantity
        * parameter. If the value passed for quantity is 0, remove the item
        * from the user's cart stored in the database.
        *
        * Pass the updated user's cart to the callback.
        *
        * NOTE: Use the solution for addItem as a guide to your solution for
        * this problem. There are several ways to solve this. By far, the
        * easiest is to use the $ operator. See:
        * https://docs.mongodb.org/manual/reference/operator/update/positional/
        *
        */

        var userCart = {
            userId: userId,
            items: []
        }
        var dummyItem = this.createDummyItem();
        dummyItem.quantity = quantity;
        userCart.items.push(dummyItem);
        callback(userCart);

        // TODO-lab7 Replace all code above (in this method).

    }

    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            quantity: 1,
            reviews: []
        };

        return item;
    }

}


module.exports.CartDAO = CartDAO;

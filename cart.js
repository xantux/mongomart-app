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
            }
        );
    };


    this.updateQuantity = (userId, itemId, quantity, callback) => {
        "use strict";

        var updateObj = { 
            "$set": { 
                "items.$.quantity": quantity 
            } 
        };

        if (quantity == 0) {
            updateObj = { 
                "$pull": { 
                    items: { 
                        _id: itemId 
                    } 
                } 
            };
        }

        this.db.collection("cart").findOneAndUpdate(
            { 
                userId: userId,
                "items._id": itemId 
            },
            updateObj,
            { returnOriginal: false },
            (err, result) => {
                assert.equal(null, err);
                callback(result.value);
            }
        );
    };

}


module.exports.CartDAO = CartDAO;

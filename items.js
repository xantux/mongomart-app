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


function ItemDAO(database) {
  "use strict";

  this.db = database;

  this.getCategories = (callback) => {
    "use strict";

    this.db.collection("item").aggregate([{
        "$group": {
          _id: "$category",
          num: {
            "$sum": 1
          }
        }
      },
      {
        "$sort": {
          _id: 1
        }
      }
    ]).toArray((err, categories) => {
      assert.equal(null, err);

      var categoriesCounter = Object.keys(categories).reduce((previous, key) => {
        return previous + categories[key].num;
      }, 0);

      categories.unshift({
        _id: "All",
        num: categoriesCounter
      });

      callback(categories);
    });
  };


  this.getItems = (category, page, itemsPerPage, callback) => {

    "use strict";

    var query = {
      "category": category
    };

    if (category == "All") {
      query = {};
    }

    var sortObj = {
      "_id": 1
    };

    this.db.collection('item').find(query)
      .sort(sortObj)
      .limit(itemsPerPage)
      .skip(page * itemsPerPage)
      .toArray((err, items) => {
        assert.equal(err, null);
        callback(items);
      });
  };


  this.getNumItems = (category, callback) => {
    "use strict";

    var query = {
      category: category
    };

    if (category === "All") {
      query = {};
    }

    this.db.collection('item').find(query).count((err, numItems) => {
      if (err) throw err;
      callback(numItems);
    });

  };


  this.searchItems = (query, page, itemsPerPage, callback) => {

    "use strict";

    var queryObj = {
      $text: {
        $search: query
      }
    };

    var sortObj = {
      "_id": 1
    };

    this.db.collection('item').find(queryObj)
      .sort(sortObj)
      .limit(itemsPerPage)
      .skip(page * itemsPerPage)
      .toArray((err, items) => {
        assert.equal(err, null);
        callback(items);
      });
  };


  this.getNumSearchItems = function(query, callback) {
    "use strict";

    var numItems = 0;

    /*
     * TODO-lab2B
     *
     * LAB #2B: Using the value of the query parameter passed to this
     * method, count the number of items in the "item" collection matching
     * a text search. Pass the count to the callback function.
     *
     * getNumSearchItems() depends on the same text index as searchItems().
     * Before implementing this method, ensure that you've already created
     * a SINGLE text index on title, slogan, and description. You should
     * simply do this in the mongo shell.
     */

    callback(numItems);
  }


  this.getItem = function(itemId, callback) {
    "use strict";

    /*
     * TODO-lab3
     *
     * LAB #3: Implement the getItem() method.
     *
     * Using the itemId parameter, query the "item" collection by
     * _id and pass the matching item to the callback function.
     *
     */

    var item = this.createDummyItem();

    // TODO-lab3 Replace all code above (in this method).

    // TODO Include the following line in the appropriate
    // place within your code to pass the matching item
    // to the callback.
    callback(item);
  }


  this.getRelatedItems = function(callback) {
    "use strict";

    this.db.collection("item").find({})
      .limit(4)
      .toArray(function(err, relatedItems) {
        assert.equal(null, err);
        callback(relatedItems);
      });
  };


  this.addReview = function(itemId, comment, name, stars, callback) {
    "use strict";

    /*
     * TODO-lab4
     *
     * LAB #4: Implement addReview().
     *
     * Using the itemId parameter, update the appropriate document in the
     * "item" collection with a new review. Reviews are stored as an
     * array value for the key "reviews". Each review has the fields:
     * "name", "comment", "stars", and "date".
     *
     */

    var reviewDoc = {
      name: name,
      comment: comment,
      stars: stars,
      date: Date.now()
    }

    // TODO replace the following two lines with your code that will
    // update the document with a new review.
    var doc = this.createDummyItem();
    doc.reviews = [reviewDoc];

    // TODO Include the following line in the appropriate
    // place within your code to pass the updated doc to the
    // callback.
    callback(doc);
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
      reviews: []
    };

    return item;
  }
}


module.exports.ItemDAO = ItemDAO;
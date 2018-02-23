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


  this.getNumSearchItems = (query, callback) => {
    "use strict";

    var queryObj = {
      $text: {
        $search: query
      }
    };

    this.db.collection('item').find(queryObj).count((err, numItems) => {
      assert.equal(err, null);
      callback(numItems);
    });
  };


  this.getItem = (itemId, callback) => {
    "use strict";

    var queryObj = { 
      _id: itemId 
    };

    this.db.collection('item').find(queryObj).limit(1).next((err, item) => {
        assert.equal(err, null);
        callback(item);
    });
  };


  this.getRelatedItems = (callback) => {
    "use strict";

    this.db.collection("item").find({})
      .limit(4)
      .toArray((err, relatedItems) => {
        assert.equal(null, err);
        callback(relatedItems);
      });
  };


  this.addReview = (itemId, comment, name, stars, callback) => {
    "use strict";

    var reviewDoc = {
      name: name,
      comment: comment,
      stars: stars,
      date: Date.now()
    };
  
    this.db.collection('item').updateOne({ "_id": itemId }, { $push: { "reviews": reviewDoc } }, (err, item) => {
      assert.equal(err, null);
      callback(item);
    });
  };


  this.createDummyItem = () => {
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
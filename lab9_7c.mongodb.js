// ==========================================
// Q1: Setup Arrays 
// ==========================================
// Update collection before demonstration: 
// 5 docs -> 3 elements, 1 doc -> 2 elements, 1 doc -> No array.
// Theme: "recent_sales" (numbers representing sales in last few weeks)
db.Tool.updateMany(
  { _id: { $in: [1, 2, 3, 4, 5] } },
  { $set: { recent_sales: [12, 25, 17] } } 
);
db.Tool.updateOne(
  { _id: 6 },
  { $set: { recent_sales: [5, 10] } }
);
db.Tool.updateOne(
  { _id: 7 },
  { $set: { recent_sales: 12 } }
);

db.Tool.find({});

// ==========================================
// Q2: Search by Array Size
// ==========================================
// 2.1 Find docs with 3-element arrays
db.Tool.find({ recent_sales: { $size: 3 } });
// 2.2 Find docs with 2-element arrays
db.Tool.find({ recent_sales: { $size: 2 } });

// ==========================================
// Q3: $elemMatch Demonstration
// ==========================================
db.Tool.find({
  recent_sales: { 
    $elemMatch: { $gt: 0, $lt: 10 } 
  }
});
db.Tool.find({
  recent_sales: { 
    $elemMatch: { $eq: 12 }     // only search qualified array
  }
});

// ==========================================
// Q4: $inc (Numeric Updates)
// ==========================================
// 4.1 Single Doc: Add 5 to quantity for (_id: 1)
db.Tool.updateOne(
  { _id: 1 }, 
  { $inc: { quantity: 5 } }
);
// 4.2 Reverse Single Doc: Subtract 5
db.Tool.updateOne(
  { _id: 1 }, 
  { $inc: { quantity: -5 } }
);
// 4.3 All Docs: Add 10 to quantity
db.Tool.updateMany(
  {}, 
  { $inc: { quantity: 10 } }
);
// 4.4 Reverse All Docs: Subtract 10
db.Tool.updateMany(
  {}, 
  { $inc: { quantity: -10 } }
);

// ==========================================
// Q5: replaceOne
// ==========================================
db.Tool.replaceOne(
  { _id: 2 },
  {
    _id: 2, 
    name: "Cordless Drill",
    // brand: "DeWalt", // Removed this existing pair
    price: 129.99,
    quantity: 20,
    category: "Power Tools",
    date_stocked: new Date("2023-02-20"),
    recent_sales: [12, 25, 17], 
    // Added two new pairs:
    supplier: "Home Depot", 
    condition: "New"
  }
);

// ==========================================
// Q6: Remove and Restore KVP
// ==========================================
// 6.1 Remove 'price' 
db.Tool.updateOne(
  { _id: 1 },
  { $unset: { price: "" } }
);
// 6.2 Put 'price' back into doc 3
db.Tool.updateOne(
  { _id: 1 },
  { $set: { price: 15.99 } }
);

// ==========================================
// Q7: No ID Insert, Search & Delete
// ==========================================
// 7.1 Insert doc without providing _id
db.Tool.insertOne({
  name: "Mystery Tool",
  brand: "Generic",
  price: 9.99
});
// 7.2 Search using the ObjectId
db.Tool.findOne({ _id: ObjectId("6929f7f31ef0926c3435a23d") });
// 7.3 Remove using the ObjectId
db.Tool.deleteOne({ _id: ObjectId("6929f7f31ef0926c3435a23d") });

db.Tool.find({});

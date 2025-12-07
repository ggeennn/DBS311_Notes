const database = 'DBS311G7C';
use(database);

//----Q1
db.Tool.drop(); // drop old data before lab demo
db.createCollection("Tool"); 
db.Tool.find({});

/* Q2
1. Open Settings (Cmd + , or Ctrl + ,)
2. Search: mongodb confirm run
3. Uncheck: Confirm Run All
*/

//----Q3 insert docs
// insert 7 docs, 7 KVP for each doc, one extra pair for last doc
db.Tool.insertMany([
{
    _id: 1,
    name: "Claw Hammer",
    brand: "Stanley",
    price: 15.99,
    quantity: 50,
    category: "Hand Tools",
    date_stocked: "2023-01-15"
 }, 
 {
    _id: 2,
    name: "Cordless Drill",
    brand: "DeWalt",
    price: 129.99,
    quantity: 20,
    category: "Power Tools",
    date_stocked: "2023-02-20"
 },
 {
    _id: 3,
    name: "Screwdriver Set",
    brand: "Craftsman",
    price: 25.50,
    quantity: 35,
    category: "Hand Tools",
    date_stocked: "2023-03-10"
 },
 {
    _id: 4,
    name: "Circular Saw",
    brand: "Makita",
    price: 89.00,
    quantity: 15,
    category: "Power Tools",
    date_stocked: "2023-04-05"
 },
 {
    _id: 5,
    name: "Tape Measure",
    brand: "Milwaukee",
    price: 12.99,
    quantity: 100,
    category: "Measuring",
    date_stocked: "2023-05-12"
 },
 {
    _id: 6,
    name: "Adjustable Wrench",
    brand: "Husky",
    price: 18.75,
    quantity: 40,
    category: "Hand Tools",
    date_stocked: "2023-06-01"
 },
 {
    _id: 7,
    name: "Work Light",
    brand: "Ryobi",
    price: 45.00,
    quantity: 25,
    category: "Accessories",
    date_stocked: "2023-07-20",
    warranty_years: 3 //extra key value pair
 }
]);

//----Q4
//-------4.1 findAll
db.Tool.find({});
//-------4.2 retrieve with restriction
db.Tool.find(   // .findOne() => find 1st doc
    {"brand": "DeWalt"}
   ,{"name": 1, "_id": 0}
);

//----Q5 rm single doc
db.Tool.deleteOne({"_id": 1});

//----Q6 insert back
//-------6.1 insert the removed doc without offer id
let data = {
    name: "Claw Hammer",
    brand: "Stanley",
    price: 15.99,
    quantity: 50,
    category: "Hand Tools",
    date_stocked: "2023-01-15"
 };    
db.Tool.insertOne(data);
//-------6.2 search
db.Tool.findOne(data,{"_id":0});

//----Q7
//-------7.1 rm all docs
db.Tool.deleteMany({});
//-------7.2 insert back with embedded doc
db.Tool.insertMany([
 {
    _id: 1,
    name: "Claw Hammer",
    brand: "Stanley",
    price: 15.99,
    quantity: 50,
    category: "Hand Tools",
    date_stocked: "2023-01-15",
    specs: { 
        weight: "16oz", 
        material: "High Carbon Steel" 
    }
 }, 
 {
    _id: 2,
    name: "Cordless Drill",
    brand: "DeWalt",
    price: 129.99,
    quantity: 20,
    category: "Power Tools",
    date_stocked: "2023-02-20",
    specs: { 
        weight: "3.5lbs", 
        material: "Composite Plastic" 
    }
 },
 {
    _id: 3,
    name: "Screwdriver Set",
    brand: "Craftsman",
    price: 25.50,
    quantity: 35,
    category: "Hand Tools",
    date_stocked: "2023-03-10",
    specs: { 
        weight: "2.1lbs", 
        material: "Chrome Vanadium" 
    }
 },
 {
    _id: 4,
    name: "Circular Saw",
    brand: "Makita",
    price: 89.00,
    quantity: 15,
    category: "Power Tools",
    date_stocked: "2023-04-05",
    specs: { 
        weight: "8.2lbs", 
        material: "Magnesium Alloy" 
    }
 },
 {
    _id: 5,
    name: "Tape Measure",
    brand: "Milwaukee",
    price: 12.99,
    quantity: 100,
    category: "Measuring",
    date_stocked: "2023-05-12",
    specs: { 
        weight: "0.9lbs", 
        material: "ABS Plastic" 
    }
 },
 {
    _id: 6,
    name: "Adjustable Wrench",
    brand: "Husky",
    price: 18.75,
    quantity: 40,
    category: "Hand Tools",
    date_stocked: "2023-06-01",
    specs: { 
        weight: "1.2lbs", 
        material: "Forged Alloy Steel" 
    }
 },
 {
    _id: 7,
    name: "Work Light",
    brand: "Ryobi",
    price: 45.00,
    quantity: 25,
    category: "Accessories",
    date_stocked: "2023-07-20",
    warranty_years: 3, 
    specs: { 
        weight: "1.8lbs", 
        material: "Polycarbonate" 
    }
 }
]);

//----Q8 retrieve based on embedded docs
db.Tool.find({ "specs.weight": "16oz" });

//----Q9
for(m = 1; m < 6; m++){
    for(n = 1; n < 4; n++){
        db.MyLoops.insertOne({x:m,y:n});
    }
};
db.MyLoops.find({});
db.MyLoops.drop();

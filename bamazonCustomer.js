//customer view
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Clark1472",
  database: "bamazondb"
});

connection.connect(function(err) {
  if (err) throw err;
  askUser();
});

function askUser() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Do you want to review products?",
      choices: [
        "yes",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "yes":
        listProducts();
        break;
          
      case "exit":
        connection.end();
        break;
      }
    });
}

function listProducts() {
  var query = "SELECT id, product_name, price FROM bamazondb.products";
connection.query(query, function(err, row) {
  //if (err) throw err;
  for (var i in row) {
    console.log(
      "Id: " + row[i].id + 
      " || Product_name: " + row[i].product_name + 
      " || Price: " + row[i].price
      );
   }
   enterProduct() 
})

function enterProduct(){
inquirer
.prompt([{
  name: "product_id",
  type: "input",
  message: "Enter the product ID you would like to buy?",
  validate: function(value) {
    if(isNaN(value) === false) {
      return true;
    }
    return false;
  }
},
{
  name: "quantity",
  type: "input",
  message: "How many would you like to buy?",
  validate: function(value) {
    if(isNaN(value) === false) {
      return true;
    }
    return false;
  }
}])

.then(function(answer) {
   var query = "SELECT * FROM bamazondb.products WHERE id=?";

  connection.query(query, answer.product_id, function(err, row) {

     if (err) {

      console.log(err);
       throw err};

    for (var i in row) {
      var purchase_id = row[i].id;
      var purchase_name = row[i].product_name;
      var purchase_price = row[i].price;
      var purchase_quantity = row[i].stock_quantity;
      
      customer_quantity = answer.quantity;
      console.log("");
      console.log(
        "Customer Selected Id: " + row[i].id + 
        " || Product_name: " + row[i].product_name + 
        " || Price: " + row[i].price +
        " || Quantity: " + row[i].stock_quantity
        );
      }

 
      if (answer.quantity > purchase_quantity ){
          console.log("Insufficient quantity!");
         }
      else {
          var remaining_quantity = purchase_quantity - answer.quantity;
          var total_price = answer.quantity * purchase_price;
     
          var query = "update bamazondb.products set stock_quantity= ? WHERE id=?";
          connection.query(query,  [remaining_quantity, purchase_id] , function(err, row) {
            if (err) {
              console.log(err);
               throw err};
            console.log("Product has been ordered, Your total cost is: $" + total_price);
            askUser();

            }
          );     
        };

    });

  });
}
}
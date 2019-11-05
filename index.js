const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();

const port = 5000;
var jsonParser = bodyParser.json();

var saltRounds = 5;

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/getData", (req, res) => {
	let dataToSend = "This data is sent from Express.js to React.js";
	res.json(dataToSend);
});

let pool = mysql.createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "aa",
	password: "super",
	database: "aa-dbms",
	multipleStatements: true
	// allen : hello
	// Abbas: admin
	// aa: super
});

app.post("/api/login", jsonParser, (req, res) => {
	let requestData = req.body;
	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Error in getting connection");
		} else {
			connection.query("SELECT * FROM login", (error, result, fields) => {
				connection.release();
				let i = 0;
				let valid = false;
				for (i = 0; i < result.length; i++) {
					if (result[i].Lid == requestData.userid) {
						valid = true;
						break;
					}
				}
				if (valid == true) {
					bcrypt
						.compare(requestData.password, result[i].Password)
						.then(passRes => {
							valid = passRes;
							let responseObj = {
								valid: valid,
								type: result[i].Type
							};
							res.json(responseObj);
						});
				} else {
					res.json(valid);
				}
			});
		}
	});
});

app.post("/api/register", jsonParser, (req, res) => {
	let requestData = req.body;
	var addToLogin = `insert into login values(?,?,?)`;

	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Error in getting connection");
		} else {
			bcrypt.hash(requestData.password, saltRounds).then(hash => {
				let loginValues = [requestData.userid, hash, requestData.accType];
				connection.query(
					addToLogin,
					loginValues,
					(error, result, fields) => {
						console.log(error);
					}
				);

				if (requestData.accType == "buyer") {
					let addToBuyer = `insert into buyer values(?,?,?)`;
					let buyerValues = [
						requestData.userid,
						requestData.name,
						requestData.city + ", " + requestData.state
					];
					connection.query(
						addToBuyer,
						buyerValues,
						(error, result, fields) => {
							if (error == null) res.json(true);
							else res.json(false);
						}
					);
				} else if (requestData.accType == "seller") {
					let addToSeller = `insert into seller values(?,?,?)`;
					let sellerValues = [
						requestData.userid,
						requestData.name,
						requestData.phone
					];
					connection.query(
						addToSeller,
						sellerValues,
						(error, result, fields) => {
							if (error === null) res.json(true);
							else res.json(false);
						}
					);
				}
			});
		}
		connection.release();
	});
});

app.post("/api/seller/prods", jsonParser, (req, res) => {
	let requestData = req.body;

	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Error in getting connection");
		} else {
			let prodQuery = `SELECT p.pid, p.pname, p.descripton, p.price,p.quantity,c.category from products p,seller s, categories c WHERE (p.cid=c.Cid) AND (s.sid=p.sid) AND (s.sid=?);`;
			connection.query(
				prodQuery,
				[requestData.userid],
				(error, result, fields) => {
					connection.release();
					res.send(result);
				}
			);
		}
	});
});

app.post("/api/seller/del", jsonParser, (req, res) => {
	let requestData = req.body;
	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Error in getting connection");
		} else {
			let delQuery = `DELETE FROM products WHERE Pid=?;`;
			connection.query(
				delQuery,
				[requestData.pid],
				(error, result, fields) => {
					connection.release();
					console.log("Error = " + error);
					res.send(result);
				}
			);
		}
	});
});

app.post("/api/seller/update", jsonParser, (req, res) => {
	let requestData = req.body;
	console.log(requestData)
	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Error in getting connection");
		} else {
			let upQuery = `UPDATE products set Pname=?, Descripton=?, Price=?, Quantity=?  WHERE Pid=?`;
			let upArray = [
				requestData.name,
				requestData.desc,
				requestData.price,
				requestData.quantity,
				requestData.key
			];
			connection.query(upQuery, upArray, (error, result, fields) => {
				connection.release();
				console.log("Error = " + error);
				console.log("Result = " + result);
				res.send(result);
			});
		}
	});
});

app.get("/api/card", jsonParser, (req, res) => {
	pool.getConnection((error, connection) => {
		if (error) throw err;
		else {
			connection.query("select * from products", (error, result, fields) => {
				res.send(result);
			});
		}
		connection.release();
	});
});

app.get("/api/admin", (req, res) => {
	pool.getConnection((error, connection) => {
		if (error) throw error;
		else {
			connection.query(
				"select * from buyer; select * from seller",
				(error, result, fields) => {
					res.send(result);
				}
			);
		}
		connection.release();
	});
});

app.get("/", (req, res) => res.send("Welcome to the Home Page"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

let hashed = "";

// The following function testHash is only for demo purposes
// and is not used in the functional part of the project
const testHash = () => {
	let myPlaintextPassword = "admin";

	bcrypt.hash(myPlaintextPassword, saltRounds).then(hash => {
		// Store hash in your password DB.
		console.log(myPlaintextPassword);
		console.log(hash);
		hashed = hash;
		bcrypt.hash(myPlaintextPassword, saltRounds).then(hash2 => {
			console.log(myPlaintextPassword);
			console.log(hash2);
			bcrypt.compare(myPlaintextPassword, hash).then(res => {
				console.log(res);
				bcrypt.compare(myPlaintextPassword, hash2).then(secres => {
					console.log(secres);
				});
			});
		});
	});
};
// testHash();

pool.getConnection((err, connection) => {
	if (err) throw err;
	connection.query("SELECT * FROM login", (error, results, fields) => {
		// console.log(results[0].Lid);
		connection.release();
		if (error) throw error;
	});
});

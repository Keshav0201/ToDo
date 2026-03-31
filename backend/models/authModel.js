const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function signup(data, callback) {
  const { email, password } = data;

  const query = "SELECT id FROM users WHERE email = ?";

  db.query(query, [email], async (err, result) => {
    if (err) return callback(err, null);

    if (result.length > 0) return callback("User already exists", null);

    const user_id = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = "INSERT INTO users (id,email,password) VALUES (?,?,?)";

    db.query(insertQuery, [user_id, email, hashedPassword], (err, result) => {
      if (err) return callback(err, null);

      const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      return callback(null, {
        message: "User created successfully",
        token,
      });
    });
  });
}

function login(data, callback) {
  const { email, password } = data;

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, result) => {
    if (err) return callback(err, null);

    if (result.length <= 0) return callback("User doesnot exists", null);
    const user = result[0];

    const valid = await bcrypt.compare(password, user.password);

    if(!valid) {
        return callback("Wrong password",null);
    }

    const user_id = user.id;

    const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return callback(null,{
      message: "Logged in successfully",
      token,
    });
  });
}

module.exports = {
  signup,
  login
};

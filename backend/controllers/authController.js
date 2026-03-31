const authModel = require("../models/authModel");

function signup(req, res) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  authModel.signup({email,password}, (err,result) => {
    if(err) return res.status(500).json({err});

    res.json({
        success: true,
        result
    });
  });
};

function login(req, res) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  authModel.login({email,password}, (err,result) => {
    if(err) return res.status(500).json({err});

    res.json({
        success: true,
        result
    });
  });
};



module.exports = {
    signup,
    login
}

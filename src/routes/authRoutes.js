import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
            [username, hashedPassword]
        );

        const userId = result.rows[0].id;

        // create default todo
        await pool.query(
            "INSERT INTO todos (user_id, task) VALUES ($1, $2)",
            [userId, "Hello! Add your first To-Do"]
        );

        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        res.json({ token });

    } catch (err) {
        console.log(err);
        return res.status(503).json({ message: "User exists or DB error" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        const user = result.rows[0];

        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        res.json({ token });

    } catch (err) {
        console.log(err);
        res.sendStatus(503);
    }
});

export default router;

import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET ALL TODOS
router.get('/', async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM todos WHERE user_id = $1 ORDER BY id DESC",
        [req.userId]
    );

    res.json(result.rows);
});

// CREATE TODO
router.post('/', async (req, res) => {
    const { task } = req.body;

    const result = await pool.query(
        "INSERT INTO todos (user_id, task) VALUES ($1, $2) RETURNING *",
        [req.userId, task]
    );

    res.json(result.rows[0]);
});

// UPDATE TODO
router.put('/:id', async (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;

    await pool.query(
        "UPDATE todos SET completed = $1 WHERE id = $2 AND user_id = $3",
        [completed, id, req.userId]
    );

    res.json({ message: "Updated" });
});

// DELETE TODO
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    await pool.query(
        "DELETE FROM todos WHERE id = $1 AND user_id = $2",
        [id, req.userId]
    );

    res.json({ message: "Deleted" });
});

export default router;

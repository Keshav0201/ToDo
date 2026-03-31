const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');

router.post('/tasks', taskController.createTask);
router.get('/tasks',taskController.getAllTask);
router.delete('/delete/:id',taskController.deleteTask);
router.post('/update/:id',taskController.updateTask);

module.exports = router;
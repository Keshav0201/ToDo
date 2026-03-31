const taskModel = require("../models/taskModel");

function createTask(req, res) {
  const { title } = req.body;
  const user_id = req.user.id;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  taskModel.createTask({title, user_id}, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }
    res.json({
        success: true,
        taskId: result.insertId
    });
  });
};

function getAllTask(req,res) {
    taskModel.getAllTask(req.user.id,(err,result) => {
        if(err) {
            return res.status(500).json({error: 'DB error'});
        }
        res.json({
            success: true,
            todos : result
        });
    });
}

function deleteTask(req,res) {
    const {id} = req.params;
    const user_id = req.user.id;

    taskModel.deleteTask({id,user_id}, (err,result) => {
        if(err) {
            return res.status(500).json({error: 'DB error'});
        }
        res.json({
            success: true
        });
    })
}

function updateTask(req,res) {
    const {id} = req.params;
    const user_id = req.user.id;

    taskModel.updateStatus({id,user_id}, (err,result) => {
        if(err) {
            return res.status(500).json({error: 'DB error'});
        }
        res.json({
            success: true,
            result
        });
    });
}

module.exports = {
    createTask,
    getAllTask,
    deleteTask,
    updateTask
};
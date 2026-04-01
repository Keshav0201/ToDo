const db = require("../config/db");

function createTask(data, callback) {
  const { title, user_id , due_date} = data;
  const query = "INSERT INTO tasks (title,user_id,due_date) VALUES (?,?,?)";

  db.query(query, [title, user_id, due_date], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

function getAllTask(user_id, callback) {
  const query = "SELECT * FROM tasks WHERE user_id = ?";

  db.query(query, [user_id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

function deleteTask({ id, user_id }, callback) {
  const query = "DELETE FROM tasks WHERE id = ? AND user_id = ?";

  db.query(query, [id, user_id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

function updateStatus({ id, user_id }, callback) {
  const query = "UPDATE tasks SET completed = 1 WHERE id = ? AND user_id = ?";

  db.query(query, [id, user_id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

module.exports = {
  createTask,
  getAllTask,
  deleteTask,
  updateStatus,
};

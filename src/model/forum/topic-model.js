const db = require('../../users.db'); 

module.exports = {
    getAllTopics(callback) {
      db.all('SELECT * FROM topics ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return callback([]);
        callback(rows);
      });
    },
  
    createTopic(title, author, description, callback) {
      db.run(
        'INSERT INTO topics (title, author, description) VALUES (?, ?, ?)',
        [title, description, author],
        function (err) {
          if (err) return callback(null);
          callback({ topic_id: this.lastID, title, description, author });
        }
      );
    }
  };
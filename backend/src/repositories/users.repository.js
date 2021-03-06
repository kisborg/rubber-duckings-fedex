import { db } from '../data/connection';

export const usersRepo = {
  async insertUser(username, password, email) {
    const sqlQuery = 'INSERT INTO users(username, password, email) VALUES(?,?,?);';
    try {
      return await db.query(sqlQuery, [username, password, email]);
    } catch (err) {
      const errorObj = /Duplicate entry/.test(err.sqlMessage)
        ? { status: 401, message: 'User already exists' }
        : { status: 500, message: err.sqlMessage };
      throw errorObj;
    }
  },
  async insertAdmin(username, password, email, isAdmin) {
    const sqlQuery = 'INSERT INTO users(is_admin, username, password, email) VALUES(?,?,?,?);';
    try {
      return await db.query(sqlQuery, [isAdmin, username, password, email]);
    } catch (err) {
      const errorObj = /Duplicate entry/.test(err.sqlMessage)
        ? { status: 401, message: 'User already exists' }
        : { status: 500, message: err.sqlMessage };
      throw errorObj;
    }
  },
  async getUser(username) {
    const sqlQuery = 'SELECT * FROM users WHERE username = ?';
    try {
      const queryData = await db.query(sqlQuery, [username]);
      return queryData;
    } catch (err) {
      throw { status: 500, message: err.sqlMessage };
    }
  },

  async getUserById(id) {
    const sqlQuery = 'SELECT * FROM users WHERE id = ?';
    try {
      const queryData = await db.query(sqlQuery, [id]);
      return queryData;
    } catch (err) {
      throw { status: 500, message: err.sqlMessage };
    }
  },
  async getUsers() {
    const sqlQuery = 'SELECT * FROM users';
    try {
      const queryData = await db.query(sqlQuery);
      return queryData.results;
    } catch (err) {
      throw { status: 500, message: err.sqlMessage };
    }
  },
  async getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email=?;';
    return await db.query(sql, [email]);
  },
  async verifyUser(userId) {
    const sql = 'UPDATE users SET is_validated=1 WHERE id=?';
    return await db.query(sql, [userId]);
  },
};

import { db } from '../data/connection';

export const challengeRepo = {
  getChallenge: async () => {
    try {
      const sqlQuery = 'SELECT * FROM challenge';
      const challengeQueryData = await db.query(sqlQuery);
      return challengeQueryData.results[0];
    } catch (err) {
      throw {
        status: 500,
        message: err.sqlMessage,
      };
    }
  },
};
const express = require('express');
const mysql = require('../database/mysql');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

// 모든 서브 카테고리 가져오기
router.get('/', (req, res) => {
  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // SQL 쿼리 실행 to fetch all subcategories
    const query = `
    SELECT
      SubcategoryID,
      SubcategoryName
    FROM
      Subcategory;
    `;

    conn.query(query, (err, results) => {
      conn.release();
      if (err) {
        console.error('쿼리 실행 중 오류 발생:', err);
        res.status(500).send('Error executing the query');
        return;
      }
      res.json(results); // 모든 서브 카테고리 반환
    });
  });
});

module.exports = router;

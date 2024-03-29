const express = require('express');
const mysql = require('../database/mysql');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

// 검색기능
router.get('/:searchWord', (req, res) => {
  const searchWord = req.params.searchWord;

  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // SQL 쿼리 실행
    const query = `
    SELECT
    l.LectureID,
    l.LectureImageURL,
    l.Title,
    CASE 
        WHEN l.IsFree = 1 THEN '무료' 
        ELSE CONCAT(l.LecturePrice, '원') 
    END AS PriceDisplay,
    i.InstructorName,
    AVG(c.Rating) AS AverageRating
FROM
    Lectures l
LEFT JOIN
    LectureCategory lc ON l.LectureID = lc.LectureID
LEFT JOIN
    Comments c ON l.LectureID = c.LectureID
LEFT JOIN
    Category c2 ON c2.CategoryID = lc.CategoryID
LEFT JOIN
    Subcategory s ON s.CategoryID = c2.CategoryID
LEFT JOIN
    Instructor i ON l.InstructorID = i.InstructorID
WHERE
    l.Title LIKE '%${searchWord}%'
GROUP BY
    l.LectureID, l.LectureImageURL, l.Title, l.LecturePrice, i.InstructorName
ORDER BY
    AverageRating DESC;
      `;

    conn.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }

      // MySQL 연결 종료
      conn.release();
    });
  });
});

module.exports = router;

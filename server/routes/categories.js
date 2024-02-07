const express = require('express');
const mysql = require('../database/mysql');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

//전체 카테고리 출력
router.get('/all', (req, res) => {
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
            * 
        From
            Category c ;
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

router.get('/sub', (req, res) => {
  const categoryId = req.query.categoryId;

  // categoryId의 유효성 검사
  if (!categoryId) {
    res.status(400).send('Category ID is required');
    return;
  }

  mysql.getConnection((error, conn) => {
    if (error) {
      res.status(500).send('Internal Server Error');
      return;
    }

    const query = `
        SELECT * 
        FROM Subcategory 
        WHERE CategoryID = ?;
    `;

    conn.query(query, [categoryId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }

      conn.release();
    });
  });
});

//세부 카테고리 클릭시 해당 카테고리의 강의들을 평점순으로 출력
router.get('/lectures/:SubcategoryID', (req, res) => {
  const SubcategoryID = req.params.SubcategoryID;
  console.log(SubcategoryID);

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
    i.InstructorName,
    AVG(c2.Rating) AS AverageRating,
    CASE 
        WHEN l.IsFree = 1 THEN '무료' 
        ELSE CONCAT(l.LecturePrice, '원') 
    END AS PriceDisplay
FROM 
    Lectures l
JOIN
    LectureCategory lc ON l.LectureID = lc.LectureID
JOIN 
    Subcategory s ON s.SubcategoryID = lc.SubcategoryID
JOIN 
    Comments c2 ON c2.LectureID = l.LectureID
JOIN
    Instructor i ON l.InstructorID = i.InstructorID
WHERE 
    lc.SubcategoryID = ?
GROUP BY 
    l.LectureID
ORDER BY 
    AverageRating DESC;
    `;

    conn.query(query, [SubcategoryID], (error, results) => {
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

// 모든 서브 카테고리 가져오기
router.get('/subcategories', (req, res) => {
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

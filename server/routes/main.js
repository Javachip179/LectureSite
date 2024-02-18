const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const mysql = require('../database/mysql');
const jwt = require('jsonwebtoken');

// 메인페이지에서 인기강의, 신규강의, 유저정보 가져옴
router.get('/', (req, res) => {
  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
      return;
    }

    const popularLectureQuery = `
    SELECT
    l.LectureID,
    l.LectureImageURL,
    l.Title,
    i.InstructorName,
    CASE WHEN l.IsFree = 1 THEN '무료' ELSE CONCAT(l.LecturePrice, '원') END AS PriceDisplay,
    AVG(c.Rating) AS AverageRating
FROM
    Lectures l
LEFT JOIN
    Instructor i ON l.InstructorID = i.InstructorID
LEFT JOIN 
    Comments c ON l.LectureID = c.LectureID 
GROUP BY
    l.LectureID, l.LectureImageURL, l.Title, i.InstructorName, l.LecturePrice
HAVING
    AVG(c.Rating) IS NOT NULL
ORDER BY
    AverageRating DESC;
  `;

    // SQL 쿼리 실행
    const freeLectureQuery = `
    SELECT
    l.LectureID,
    l.LectureImageURL,
    l.Title,
    i.InstructorName,
    CASE WHEN l.IsFree = 1 THEN '무료' ELSE CONCAT(l.LecturePrice, '원') END AS PriceDisplay,
    COALESCE(AVG(c.Rating), 0) AS AverageRating
FROM
    Lectures l
JOIN
    Instructor i ON l.InstructorID = i.InstructorID
LEFT JOIN 
    Comments c ON l.LectureID = c.LectureID
WHERE
    l.LecturePrice = 0
GROUP BY
    l.LectureID, l.LectureImageURL, l.Title, i.InstructorName, l.LecturePrice
ORDER BY
    AverageRating DESC; 
    `;

    const newLectureQuery = `
    SELECT
    l.LectureID,
    l.LectureImageURL,
    l.Title,
    i.InstructorName,
    CASE WHEN l.IsFree = 1 THEN '무료' ELSE CONCAT(l.LecturePrice, '원') END AS PriceDisplay,
    AVG(c.Rating) AS AverageRating
FROM
    Lectures l
LEFT JOIN
    Instructor i ON l.InstructorID = i.InstructorID
LEFT JOIN 
    Comments c ON l.LectureID = c.LectureID 
GROUP BY
    l.LectureID, l.LectureImageURL, l.Title, i.InstructorName, l.LecturePrice, l.UploadDate
ORDER BY
    l.UploadDate DESC, AverageRating DESC;
    `;

    // 병렬로 두 개의 쿼리 실행
    conn.query(popularLectureQuery, (error, popularLecture) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          status: 'error',
          message: 'Error fetching popular lectures',
          error: error.message,
        });
        return;
      }

      conn.query(freeLectureQuery, (error, freeLecture) => {
        if (error) {
          console.error(error);
          res.status(500).json({
            status: 'error',
            message: 'Error fetching free lectures',
            error: error.message,
          });
          return;
        }

        conn.query(newLectureQuery, (error, newLecture) => {
          if (error) {
            console.error(error);
            res.status(500).json({
              status: 'error',
              message: 'Error fetching new lectures',
              error: error.message,
            });
            return;
          }

          // 두 쿼리에 대한 응답을 모두 클라이언트에게 보냄
          res.status(200).json({
            status: 'success',
            data: {
              popularLecture: popularLecture,
              freeLecture: freeLecture,
              newLecture: newLecture,
            },
          });

          // MySQL 연결 종료
          conn.release();
        });
      });
    });
  });
});

module.exports = router;

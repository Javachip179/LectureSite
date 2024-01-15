const express = require('express');
const mysql = require('../database/mysql');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

//강의 상세정보 출력(수강 신청 전)
router.get('/:lectureId', (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

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
            l.*,
            i.*,
            AVG(c.Rating) AS AverageRating
        FROM
            Lectures l
        JOIN
            Instructor i ON l.InstructorID = i.InstructorID
        JOIN 
            Comments c ON c.LectureID = l.LectureID 
        WHERE 
            l.LectureID = '${lectureId}'
        GROUP BY
            l.LectureID,
            l.InstructorID ,
            l.CommentID ,
            i.InstructorID;
      `;

    conn.query(query, [lectureId], (error, results) => {
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

//해당 강의의 카테고리 출력
router.get('/category/:lectureId', (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // SQL 쿼리 실행
    const query = `
        SELECT DISTINCT 
            c.CategoryName
        FROM 
            Lectures l  
        JOIN
            LectureCategory lc ON l.LectureID = lc.LectureID 
        JOIN 
            Category c ON c.CategoryID = lc.CategoryID 
        WHERE 
            l.LectureID = '${lectureId}';
      `;

    conn.query(query, [lectureId], (error, results) => {
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

//목차 출력
router.get('/toc/:lectureId', (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

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
          lt.TOCID ,
          lt.Title 
        FROM 
          LectureTOC lt 
        WHERE 
          lt.LectureID = '${lectureId}';
      `;

    conn.query(query, [lectureId], (error, results) => {
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

//수강평 출력
router.get('/comment/:lectureId', (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

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
          c.*
        FROM 
          Comments c 
        WHERE 
          c.LectureID = '${lectureId}'
        ORDER BY WriteDate DESC ;
      `;

    conn.query(query, [lectureId], (error, results) => {
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

//강의 상세 정보(수강 신청 후)
router.get('/paid/:lectureId', (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

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
          l.*,
          i.*,
          AVG(c.Rating),  
          e.AttendanceRate
        FROM
          Lectures l	
        JOIN
          Instructor i ON l.InstructorID = i.InstructorID
        JOIN
          Enrollments e ON l.LectureID = e.LectureID
        JOIN 
          Comments c ON c.LectureID = l.LectureID 
        WHERE
          l.LectureID = '${lectureId}'
        GROUP BY 
          l.LectureID,
          c.CommentID,
          e.EnrollmentID,
          i.InstructorID ;
      `;

    conn.query(query, [lectureId], (error, results) => {
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

//수강평 등록
router.post('/add-review', async (req, res) => {
  try {
    const userId = req.body.UserID;
    const lectureId = req.body.LectureID;
    const content = req.body.Content;
    const currentDate = new Date();
    const rating = req.body.Rating;

    console.log('Received data:', req.body);
    console.log('userId:', userId);
    console.log('lectureId:', lectureId);
    console.log('content:', content);
    console.log('currentDate:', currentDate);
    console.log('rating:', rating);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
        return;
      }

      conn.query(
        'INSERT INTO Comments (UserID, LectureID, Content, WriteDate, Rating) VALUES (?, ?, ?, ?, ?);',
        [userId, lectureId, content, currentDate, rating],
        (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
          }

          // 쿼리 완료 후 연결 해제
          conn.release();

          // 응답 보내기
          res.status(200).send('Review added successfully');
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error3');
  }
});

//질문 출력
router.get('/question/:lectureId', (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

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
          q.*
        FROM 
          Question c 
        WHERE 
          c.LectureID = '${lectureId}'
        ORDER BY WriteDate DESC ;
      `;

    conn.query(query, [lectureId], (error, results) => {
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

//질문 등록
router.post('/add-question', async (req, res) => {
  try {
    const userId = req.body.UserID;
    const lectureId = req.body.LectureID;
    const questionContent = req.body.QuestionContent;
    const createDate = new Date();

    console.log('Received data:', req.body);
    console.log('userId:', userId);
    console.log('lectureId:', lectureId);
    console.log('questionContent:', questionContent);
    console.log('createDate:', createDate);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
        return;
      }

      conn.query(
        'INSERT INTO Question (UserID, LectureID, QuestionContent, CreateDate) VALUES (?, ?, ?, ?);',
        [userId, lectureId, questionContent, createDate],
        (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
          }

          // 쿼리 완료 후 연결 해제
          conn.release();

          // 응답 보내기
          res.status(200).send('Review added successfully');
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error3');
  }
});

// 동영상 시청
router.get('/:lectureId/watch', (req, res) => {
  console.log(req.params);
  const lectureId = req.params.lectureId;

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
          lm.*,
          lt.*
        FROM 
          LecturesMaterial lm 
        JOIN
          LectureTOC lt ON lt.TOCID = lm.TOCID 
        JOIN
          Lectures l ON l.LectureID = lt.LectureID 
        WHERE 
          l.LectureID = '${lectureId}';
      `;

    conn.query(query, [lectureId], (error, results) => {
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

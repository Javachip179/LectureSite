const express = require('express');
const mysql = require('../database/mysql');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const verifyTokenAndGetUserId = require('../jwtToken/verifyTokenAndGetUserId');

router.get('/:lectureId', (req, res) => {
  const lectureId = req.params.lectureId;

  try {
    // MySQL 연결
    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
        return;
      }

      // SQL 쿼리 실행
      const lectureQuery = `
      SELECT
      l.*,
      i.*,
      AVG(c.Rating) AS AverageRating,
      CASE 
        WHEN l.IsFree = 1 THEN '무료' 
        ELSE CONCAT(FORMAT(l.LecturePrice, 0), '원') 
      END AS PriceDisplay,
      TIME_FORMAT(l.LectureTime, '%H시간%i분') AS FormattedLectureTime
    FROM
      Lectures l
    JOIN
      Instructor i ON l.InstructorID = i.InstructorID
    LEFT JOIN
      Comments c ON c.LectureID = l.LectureID
    WHERE
      l.LectureID = ${lectureId}
    GROUP BY
      l.LectureID;    
      `;

      const TOCQuery = `
        SELECT
          lt.TOCID ,
          lt.TocTitle ,
          lt.ParentTOCID
        FROM
          LectureTOC lt
        WHERE
          lt.LectureID = ${lectureId};
      `;

      const categoryQuery = `
      SELECT
      c.CategoryName,
      GROUP_CONCAT(sc.SubcategoryName ORDER BY sc.SubcategoryName SEPARATOR ', ') AS Subcategories
    FROM
      Lectures l
    JOIN
      LectureCategory lc ON l.LectureID = lc.LectureID
    JOIN
      Category c ON c.CategoryID = lc.CategoryID
    LEFT JOIN
      Subcategory sc ON lc.SubcategoryID = sc.SubcategoryID
    WHERE
      l.LectureID = ${lectureId}
    GROUP BY
      c.CategoryName;    
      `;

      const commentQuery = `
        SELECT
          c.CommentID,
          c.UserID,
          c.LectureID,
          c.Content,
          c.WriteDate,
          c.UpdateDate,
          c.Rating,
          u.UserNickname ,
          u.ProfileImage 
        FROM
          Comments c
        JOIN
          Users u ON u.UserID = c.UserID  
        WHERE
          c.LectureID = ${lectureId}
        ORDER BY WriteDate DESC ;
      `;

      const questionQuery = `
      SELECT
  q.QuestionID,
  q.UserID,
  q.LectureID,
  q.QuestionContent AS QuestionContent,
  q.CreateDate AS QuestionCreateDate,
  q.UpdateDate AS QuestionUpdateDate,
  a.AnswerID,
  a.Content AS AnswerContent,
  a.CreateDate AS AnswerCreateDate,
  a.UpdateDate AS AnswerUpdateDate,
  u.UserNickname,
  u.ProfileImage
FROM
  Question q
JOIN
  Users u ON u.UserID = q.UserID
LEFT JOIN
  Answers a ON a.QuestionID = q.QuestionID
WHERE
  q.LectureID = ${lectureId}
ORDER BY
  q.CreateDate DESC, a.CreateDate ASC;
      `;

      // 각각의 쿼리 비동기적으로 실행
      conn.query(lectureQuery, (error, lectureResult) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        conn.query(TOCQuery, (error, tocResult) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          conn.query(categoryQuery, (error, categoryResult) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }

            conn.query(commentQuery, (error, commentResult) => {
              if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
              }

              conn.query(questionQuery, (error, questionResult) => {
                if (error) {
                  console.error(error);
                  res.status(500).json({ error: 'Internal Server Error' });
                  return;
                }

                res.json({
                  lecture: lectureResult,
                  toc: tocResult,
                  categories: categoryResult,
                  comments: commentResult,
                  question: questionResult,
                });

                // console.log("commentResult", commentResult[0]);
                // console.log("tocResult", tocResult[0]);
                // console.log("categoryResult", categoryResult);
                // console.log("lectureResult", lectureResult[0]);

                // MySQL 연결 종료
                conn.release();
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
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

//질문 등록
router.post('/add-question', async (req, res) => {
  try {
    const userId = req.body.UserID;
    const lectureId = req.body.LectureID;
    const questionContent = req.body.QuestionContent;
    const createDate = req.body.CreateDate;

    console.log('Received data:', req.body);
    console.log('userId:', userId);
    console.log('lectureId:', lectureId);
    console.log('QuestionContent:', questionContent);
    console.log('CreateDate:', createDate);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
        return;
      }

      conn.query(
        'INSERT INTO Question (UserID, LectureID, QuestionContent, CreateDate) VALUES (?, ?, ?, NOW());',
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
          res.status(200).send('Question added successfully');
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error3');
  }
});

// 질문 답변
router.post('/add-answers', async (req, res) => {
  try {
    const questionId = req.body.QuestionID;
    const userId = req.body.UserID;
    const content = req.body.Content;
    const createDate = req.body.CreateDate;

    console.log('Received data:', req.body);
    console.log('userId:', userId);
    console.log('questionId:', questionId);
    console.log('content:', content);
    console.log('CreateDate:', createDate);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
        return;
      }

      conn.query(
        'INSERT INTO Answers (QuestionID, UserID, Content, CreateDate) VALUES (?, ?, ?, NOW());',
        [questionId, userId, content, createDate],
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
          res.status(200).send('Question added successfully');
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error3');
  }
});

//동영상 시청 페이지
router.get('/:lectureId/watch', (req, res) => {
  const lectureId = req.params.lectureId;
  const userId = verifyTokenAndGetUserId(req, res);

  console.log(userId, lectureId);
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    const query = `
      SELECT
        lm.*,
        lt.*,
        e.AttendanceRate,
        u.UserID ,
        l.Title 
      FROM 
        LecturesMaterial lm 
      JOIN
        LectureTOC lt ON lt.TOCID = lm.TOCID 
      JOIN
        Lectures l ON l.LectureID = lt.LectureID 
      JOIN 
        Enrollments e  ON e.LectureID = lt.LectureID 
      JOIN 
        Users u ON u.UserID = e.UserID 
      WHERE 
        l.LectureID = '${lectureId}' AND u.UserID = '${userId}';
    `;

    conn.query(query, [lectureId], (error, results) => {
      // console.log("results", results);
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
        // console.log(results);
      }

      // 여기에서 응답을 보내고 난 후에 연결을 종료해야 합니다.
      conn.release();
    });
  });
});

router.post('/tocInfoSet', (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  const tocId = req.body.TOCID;
  const progress = req.body.Progress;
  const lectureId = req.body.LectureID;

  console.log(userId, tocId, progress, lectureId);

  // 사용자 ID와 TOC ID를 사용하여 데이터베이스에서 진행 정보를 가져온다.
  // 데이터베이스에서 진행 정보 조회
  const sqlSelect = `SELECT * FROM VideoProgress WHERE UserID = ? AND TOCID = ?;`;
  const valuesSelect = [userId, tocId];

  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send('내부 서버 오류');
      return;
    }

    // 진행 정보를 선택한다.
    conn.query(sqlSelect, valuesSelect, (err, selectResult) => {
      console.log('selectResult', selectResult);
      if (err) {
        console.error(err);
        return res.status(500).send('내부 서버 오류');
      }

      if (selectResult.length === 0) {
        // 선택된 결과가 없으면 새로운 레코드를 삽입한다.
        const sqlInsert = `INSERT INTO VideoProgress (UserID, TOCID, Progress, LastAccessed, LectureID)
      VALUE (?,?,?,NOW(),?);`;
        const valuesInsert = [userId, tocId, progress, lectureId];
        conn.query(sqlInsert, valuesInsert, (err, insertResult) => {
          if (err) {
            console.error(err);
            return res.status(500).send('내부 서버 오류');
          }
          if (insertResult.length === 0) {
            res.json({
              success: false,
              message: '실패',
            });
          } else {
            res.json({
              success: true,
              message: '성공',
            });
          }
        });
      } else if (selectResult[0].Progress < progress) {
        // 현재 진행률이 더 높으면 업데이트한다.
        const sqlUpdate = `UPDATE VideoProgress SET Progress = ?, LastAccessed = NOW() WHERE UserID = ? AND TOCID = ?;`;
        const valuesUpdate = [progress, userId, tocId];
        conn.query(sqlUpdate, valuesUpdate, (err, updateResult) => {
          if (err) {
            console.error(err);
            return res.status(500).send('내부 서버 오류');
          }
          if (updateResult.affectedRows === 0) {
            res.json({
              success: false,
              message: '업데이트 실패',
            });
          } else {
            res.json({
              success: true,
              message: '업데이트 성공',
            });
          }
        });
      } else {
        // 현재 진행률이 더 낮으면 무시한다.
        res.json({
          success: false,
          message: '이미 더 높은 진행률이 저장되어 있습니다.',
        });
      }
    });
  });
});

//해당 강의의 TOCID 추출
router.get('/:lectureID/toc', (req, res) => {
  const { lectureID } = req.params;
  console.log('lectureID??', lectureID);

  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    const query = `
      SELECT 
        lt.TOCID 
      FROM 
        Lectures l 
      JOIN
        LectureTOC lt ON lt.LectureID = l.LectureID 
      WHERE 
        l.LectureID = ${lectureID};
    `;

    conn.query(query, [lectureID], (error, results) => {
      // console.log("results", results);
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }

      // 여기에서 응답을 보내고 난 후에 연결을 종료해야 합니다.
      conn.release();
    });
  });
});

//강의의 수강 여부 확인

module.exports = router;
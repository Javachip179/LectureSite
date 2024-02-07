const express = require('express');
const mysql = require('../database/mysql');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const verifyTokenAndGetUserId = require('../jwtToken/verifyTokenAndGetUserId');

// 사용자 정보 가져오기(메인페이지)
router.get('/home', function (req, res) {
  const userId = verifyTokenAndGetUserId(req, res);

  if (!userId) {
    res.status(400).send('User ID not found in headers');
    return;
  }

  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }

    const userInfoQuery = `
        SELECT
          u.UserID,
          u.UserEmail,
          u.UserNickname,
          u.ProfileImage
        FROM 
          Users u
        WHERE 
          u.UserID = '${userId}';
      `;

    conn.query(userInfoQuery, (error, userInfo) => {
      // MySQL 연결 종료
      conn.release();

      if (error) {
        console.error(error);
        return res.status(500).json({
          status: 'error',
          message: 'Error fetching user info',
          error: error.message,
        });
      }
      const user = userInfo[0];
      res.json(user);
      console.log('user:  ' + JSON.stringify(user));
    });
  });
});

// 사용자 정보 가져오기(마이페이지)
router.get('/mypage', (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);

  if (!userId) {
    res.status(400).send('User ID not found in headers');
    return;
  }

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
        u.UserID ,
        u.UserEmail ,
        u.UserName, 
        u.ProfileImage, 
        u.Introduction, 
        u.UserNickname
    FROM 
        Users u 
    WHERE 
        u.UserID = '${userId}';
    `;

    conn.query(query, (error, results) => {
      // console.log(results);
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

//사용자 프로필 이미지 변경
router.post('/update-profileImage', async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    const profileImage = req.files.ProfileImage;
    console.log(profileImage, userId);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
        return;
      }

      conn.query(
        'UPDATE Users u SET u.ProfileImage = ? WHERE u.UserID = ?',
        [profileImage, userId],
        (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
          }
          conn.release();
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

//닉네임 수정
router.post('/update-nickname', async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    const userNickname = req.body.UserNickname;
    console.log('userNickname:', userNickname, 'userId', userId);

    // 1. 중복 체크를 위한 쿼리 실행
    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send('내부 서버 오류');
        return;
      }

      conn.query(
        'SELECT COUNT(*) AS count FROM Users WHERE UserNickname = ? AND UserID <> ?',
        [userNickname, userId],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send('내부 서버 오류');
            conn.release();
            return;
          }

          const nicknameCount = result[0].count;
          if (nicknameCount > 0) {
            // 닉네임이 이미 사용 중인 경우
            res.status(400).send('이미 사용 중인 닉네임');
            conn.release();
            return;
          }

          // 2. 닉네임 업데이트 쿼리 실행
          conn.query(
            'UPDATE Users SET UserNickname = ? WHERE UserID = ?',
            [userNickname, userId],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.log(updateErr);
                res.status(500).send('내부 서버 오류');
                conn.release();
                return;
              }

              console.log(updateResult);
              res.send(JSON.stringify(updateResult));
              conn.release();
            }
          );
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('내부 서버 오류');
  }
});

// 비밀번호 변경
router.post('/update-password', async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    const currentPassword = req.body.Password; // 현재 비밀번호
    const newPassword = req.body.NewPassword; // 새 비밀번호
    const newPasswordCheck = req.body.newPasswordCheck; // 새 비밀번호 확인

    // 새 비밀번호와 새 비밀번호 확인이 일치하는지 검증
    if (newPassword !== newPasswordCheck) {
      console.log('New passwords do not match');
      return res.status(400).send('New passwords do not match');
    }

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
      }

      // 사용자의 현재 비밀번호 확인
      conn.query(
        'SELECT Password FROM Users WHERE UserID = ?',
        [userId],
        (err, result) => {
          if (err) {
            console.log(err);
            conn.release();
            return res.status(500).send('Internal Server Error');
          }

          if (result.length === 0) {
            console.log('User not found');
            conn.release();
            return res.status(404).send('User not found');
          }

          const hashedCurrentPassword = result[0].Password;
          // bcrypt를 사용하여 현재 비밀번호 검증
          if (!bcrypt.compareSync(currentPassword, hashedCurrentPassword)) {
            console.log('Current password is incorrect');
            conn.release();
            return res.status(401).send('Current password is incorrect');
          }

          // 새 비밀번호를 해시하고 데이터베이스 업데이트
          const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
          conn.query(
            'UPDATE Users SET Password = ? WHERE UserID = ?',
            [hashedNewPassword, userId],
            (updateErr, updateResult) => {
              conn.release(); // 커넥션 해제
              if (updateErr) {
                console.log(updateErr);
                return res.status(500).send('Failed to update password');
              }
              console.log('Password updated successfully');
              return res.status(200).send('Password updated successfully');
            }
          );
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

//수강중인 강의 출력
router.get('/cours', (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);

  if (!userId) {
    res.status(400).send('User ID not found in headers');
    return;
  }

  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // SQL 쿼리 실행
    const query = `
        SELECT 
            u.UserID,
            l.LectureID,
            l.Title,
            l.LectureImageURL,
            e.AttendanceRate 
        FROM 
            Enrollments e  
        JOIN 
            Users u ON e.UserID = u.UserID 
        JOIN
            Lectures l ON e.LectureID = l.LectureID 
        WHERE 
            u.UserID = '${userId}' AND e.PaymentStatus = TRUE;
      `;

    conn.query(query, [userId], (error, results) => {
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

// 회원탈퇴
router.post('/delete-user', async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    console.log('asdasdad', userId);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
        conn.release();
        return;
      }

      conn.query(
        'DELETE FROM Users WHERE UserID = ?',
        [userId],
        (err, result) => {
          conn.release();

          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.status(200).send('User deleted successfully');
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/find-email', async (req, res) => {
  try {
    const { UserName, UserCellPhone } = req.body;
    console.log(UserName, UserCellPhone);

    if (!UserName || !UserCellPhone) {
      return res
        .status(400)
        .json({ error: '이름과 전화번호를 모두 입력하세요.' });
    }

    // MySQL 연결
    mysql.getConnection((error, conn) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // SQL 쿼리 실행
      const query = `
          SELECT 
              u.UserEmail 
          FROM 
              Users u 
          WHERE 
              u.UserName = '${UserName}' AND u.UserCellPhone = '${UserCellPhone}';
        `;

      conn.query(query, (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (results.length > 0) {
            const email = results[0].UserEmail;
            console.log(email);
          } else {
            res.json({ message: '일치하는 사용자가 없습니다.' });
          }
        }

        // MySQL 연결 종료
        conn.release();
      });
    });
  } catch (error) {
    console.error('API 오류:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 결제내역
router.get('/payment', (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);

  if (!userId) {
    res.status(400).send('User ID not found in headers');
    return;
  }

  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // SQL 쿼리 실행
    const query = `
    SELECT
    p.LectureID,
    l.LectureImageURL ,
    l.Title,
    l.LecturePrice,
    i.InstructorName,
    p.PaymentDate
  FROM
    Payments p
  JOIN
    Lectures l ON p.LectureID = l.LectureID
  JOIN
    Instructor i ON l.InstructorID = i.InstructorID
  WHERE
    p.UserID = ${UserID};
      `;

    conn.query(query, [userId], (error, results) => {
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

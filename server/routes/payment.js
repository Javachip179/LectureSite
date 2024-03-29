const express = require('express');
const mysql = require('../database/mysql');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const verifyTokenAndGetUserId = require('../jwtToken/verifyTokenAndGetUserId');
const axios = require('axios');
router.use(bodyParser.json());

//결제내역
router.get('/payment', (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  console.log('1111', userId);

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
    u.UserName,
    u.UserEmail,
    l.LectureID,
    l.Title,
    l.LectureImageURL,
    -- LecturePrice 컬럼에 대한 조건부 포맷팅을 적용합니다.
    CASE 
        WHEN l.LecturePrice = 0 THEN '무료'
        ELSE CONCAT(FORMAT(l.LecturePrice, 0), '원')
    END AS FormattedLecturePrice,
    p.PaymentDate,
    e.AttendanceRate,
    -- PaymentAmount 대신 FormattedLecturePrice 컬럼을 사용합니다.
    p.Payment
FROM 
    Payments p
JOIN 
    Users u ON p.UserID = u.UserID
JOIN 
    Lectures l ON p.LectureID = l.LectureID
JOIN 
    Enrollments e ON e.UserID = u.UserID AND e.LectureID = l.LectureID
WHERE 
    u.UserID = '${userId}' AND e.PaymentStatus = TRUE
ORDER BY 
    p.PaymentDate DESC;

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

//결제검증
router.post('/payment-verify', async (req, res) => {
  const { imp_uid, merchant_uid, payment_amount } = req.body;
  console.log(imp_uid, merchant_uid, payment_amount, 111111);
  try {
    const getTokenResponse = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: process.env.PORT_ONE_REST_API_KEY,
        imp_secret: process.env.PORT_ONE_SECRET,
      },
    });

    // console.log('getTokenResponse', getTokenResponse);

    const access_token = getTokenResponse.data.response.access_token;
    console.log('access_token', access_token);

    // 아래의 주소는 아임포트 REST API의 주소로 실제로는 해당 주소를 변경해야 합니다.
    const getPaymentDataResponse = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`,
      method: 'get',
      headers: { Authorization: access_token },
    });

    const paymentData = getPaymentDataResponse.data;
    console.log('paymentData', paymentData);
    // console.log('merchant_uid', merchant_uid);
    // console.log('paymentData.merchant_uid', paymentData.response.merchant_uid);

    // console.log('paymentData.status', paymentData.response.status);

    // merchant_uid, payment_amount 등을 사용하여 결제 검증 수행
    const card_name = paymentData.response.card_name;

    if (
      paymentData.response.merchant_uid == merchant_uid &&
      parseInt(paymentData.response.amount) === parseInt(payment_amount) &&
      paymentData.response.status == 'paid'
    ) {
      // 결제 검증 성공
      return res.json({
        success: true,
        status: paymentData.response.status,
        cardName: card_name,
      });
    } else {
      // 결제 검증 실패
      return res.json({ success: false, message: '결제 정보 불일치' });
    }
  } catch (error) {
    console.error('결제 검증 중 오류:', error);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
});

//결제내역 추가
router.post('/', (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  const lectureId = req.body.lectureId;
  const cardName = req.body.cardName;
  const userName = req.body.userName;
  const userCellPhone = req.body.userCellPhone;

  console.log('cardName11', cardName);

  console.log('userId11', userId);
  console.log('lectureId11', lectureId);

  if (!userId) {
    res.status(400).send('헤더에서 사용자 ID를 찾을 수 없습니다');
    return;
  }

  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send('내부 서버 오류');
      return;
    }

    // SQL 쿼리 실행
    const query = `
    INSERT INTO Payments(LectureID, UserID, PaymentDate, Payment)
    VALUES (?, ?, NOW(), ?)
      `;

    conn.query(query, [lectureId, userId, cardName], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('내부 서버 오류');
      } else {
        // 성공 또는 실패 여부를 클라이언트에 전달
        const success = results.affectedRows > 0; // 삽입된 행이 있는지 확인
        const message = success ? '결제가 성공했습니다' : '결제에 실패했습니다';
        res.json({ success, message });
      }

      // MySQL 연결 종료
      conn.release();
    });
  });
});

//결제내역 추가
router.post('/kakao', (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  const lectureId = req.body.lectureId;
  const cardName = '카카오페이';
  const userName = req.body.userName;
  const userCellPhone = req.body.userCellPhone;

  console.log('cardName11', cardName);

  console.log('userId11', userId);
  console.log('lectureId11', lectureId);

  if (!userId) {
    res.status(400).send('헤더에서 사용자 ID를 찾을 수 없습니다');
    return;
  }

  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send('내부 서버 오류');
      return;
    }

    // SQL 쿼리 실행
    const query = `
    INSERT INTO Payments(LectureID, UserID, PaymentDate, Payment)
    VALUES (?, ?, NOW(), ?)
      `;

    conn.query(query, [lectureId, userId, cardName], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('내부 서버 오류');
      } else {
        // 성공 또는 실패 여부를 클라이언트에 전달
        const success = results.affectedRows > 0; // 삽입된 행이 있는지 확인
        const message = success ? '결제가 성공했습니다' : '결제에 실패했습니다';
        res.json({ success, message });
      }

      // MySQL 연결 종료
      conn.release();
    });
  });
});

module.exports = router;

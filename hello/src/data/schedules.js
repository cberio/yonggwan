var schedule = [
    {
      id : 112233, //integer|예약고유 id
      reservation_dt : '2017-03-10', //max 10|예약일자|YYYY-MM-DD
      shop_id : 1, //integer|shop 고유 id
      staff_id : 1, //integer|시술자 고유 id(staff)
      start_time : '09:00', //max 5|예약 시작 시간|hh:mm
      end_time : '11:00',  //max 5|예약 종료 시간|hh:mm
      service_time : '02:00', //max 50|소요시간|hh:mm
      guest_id : 1, //integer|예약자 고유 id
      user_id : null, //integer|예약자 user id
      guest_name : '', //max 100|고객이름
      guest_class : '', //max 10|고객등급
      guest_mobile : '', // 고객휴대번호
      service_code : 'C', //max 10|상품코드
      shop_service_id : 111, //integer|서비스 고유 id
      status : '05', //max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
      bigo : 'OFF TIME', //max 500,nullable|비고
      guest_memo : '', //max 500,nullable|고객메모
      staff_memo : '', //max 500,nullable|직원메모
      is_delete : 0, //boolean|삭제여부
      created_user_id : 1, // 예약 생성자 user id
      updated_user_id : 1, // 예약 수정자 user id
      start : '2017-04-17T09:00+09:00', //datetime(ISO8601)|서비스시작일시|fullcalendar
      end : '2017-04-17T11:00+09:00', //datetime(ISO8601)|서비스종료일시|fullcalendar
      resourceId : 1, //integer|시술자 고유 id(staff)|fullcalendar
    },
    {
      id : 444222, //integer|예약고유 id
      reservation_dt : '2017-03-10', //max 10|예약일자|YYYY-MM-DD
      shop_id : 1, //integer|shop 고유 id
      staff_id : 1, //integer|시술자 고유 id(staff)
      start_time : '13:00', //max 5|예약 시작 시간|hh:mm
      end_time : '15:00',  //max 5|예약 종료 시간|hh:mm
      service_time : '02:00', //max 50|소요시간|hh:mm
      guest_id : 1, //integer|예약자 고유 id
      user_id : 123, //integer|예약자 user id
      guest_name : '홍고객', //max 100|고객이름
      guest_class : 'VIP', //max 10|고객등급
      guest_mobile : '01012345678', // 고객휴대번호
      service_code : 'B', //max 10|상품코드
      shop_service_id : 3, //integer|서비스 고유 id
      status : '01', //max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
      bigo : '잘해야 함', //max 500,nullable|비고
      guest_memo : '이쁘게 부탁 dream', //max 500,nullable|고객메모
      staff_memo : '이 고객 하기 실타', //max 500,nullable|직원메모
      is_delete : 0, //boolean|삭제여부
      created_user_id : 1, // 예약 생성자 user id
      updated_user_id : 1, // 예약 수정자 user id
      start : '2017-04-17T13:00+09:00', //datetime(ISO8601)|서비스시작일시|fullcalendar
      end : '2017-04-17T15:00+09:00', //datetime(ISO8601)|서비스종료일시|fullcalendar
      resourceId : 1, //integer|시술자 고유 id(staff)|fullcalendar
    }
];

export default schedule;

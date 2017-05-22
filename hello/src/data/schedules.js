const schedule = [
    {
        id: 112233, // integer|예약고유 id
        reservation_dt: '2017-05-22', // max 10|예약일자|YYYY-MM-DD
        shop_id: 1, // integer|shop 고유 id
        staff_id: 1, // integer|시술자 고유 id(staff)
        start_time: '09:00', // max 5|예약 시작 시간|hh:mm
        end_time: '11:00',  // max 5|예약 종료 시간|hh:mm
        service_time: '02:00', // max 50|소요시간|hh:mm
        guest_id: 0, // integer|예약자 고유 id
        user_id: null, // integer|예약자 user id
        guest_name: '', // max 100|고객이름
        guest_class: '', // max 10|고객등급
        guest_mobile: '', // 고객휴대번호
        service_code: 'OFFTIME', // max 10|상품코드
        shop_service_id: 0, // integer|서비스 고유 id
        status: '05', // max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
        bigo: 'Off-Time', // max 500,nullable|비고
        guest_memo: '또왔어요!! 잘해주세요', // max 500,nullable|고객메모
        staff_memo: '이사람 또왔네', // max 500,nullable|직원메모
        is_delete: 0, // boolean|삭제여부
        created_user_id: 1, // 예약 생성자 user id
        updated_user_id: 1, // 예약 수정자 user id
        start: '2017-05-22T09:00+09:00', // datetime(ISO8601)|서비스시작일시|fullcalendar
        end: '2017-05-22T11:00+09:00', // datetime(ISO8601)|서비스종료일시|fullcalendar
        resourceId: 1, //integer|시술자 고유 id(staff)|fullcalendar
    },
    {
        id: 444222, // integer|예약고유 id
        reservation_dt: '2017-05-22', // max 10|예약일자|YYYY-MM-DD
        shop_id: 1, // integer|shop 고유 id
        staff_id: 1, // integer|시술자 고유 id(staff)
        start_time: '13:00', // max 5|예약 시작 시간|hh:mm
        end_time: '15:00',  // max 5|예약 종료 시간|hh:mm
        service_time: '02:00', // max 50|소요시간|hh:mm
        guest_id: 1, // integer|예약자 고유 id
        user_id: 123, // integer|예약자 user id
        guest_name: '홍고객', // max 100|고객이름
        guest_class: 'VIP', // max 10|고객등급
        guest_mobile: '01012345678', // 고객휴대번호
        service_code: 'B', // max 10|상품코드
        shop_service_id: 2, // integer|서비스 고유 id
        status: '02', // max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
        bigo: '잘해야 함', // max 500,nullable|비고
        guest_memo: '반갑습니다 머리가 엉망이에요 ㅜㅜ', // max 500,nullable|고객메모
        staff_memo: '', // max 500,nullable|직원메모
        is_delete: 0, // boolean|삭제여부
        created_user_id: 1, // 예약 생성자 user id
        updated_user_id: 1, // 예약 수정자 user id
        start: '2017-05-22T13:00+09:00', // datetime(ISO8601)|서비스시작일시|fullcalendar
        end: '2017-05-22T15:00+09:00', // datetime(ISO8601)|서비스종료일시|fullcalendar
        resourceId: 1, // integer|시술자 고유 id(staff)|fullcalendar
        payments: []
    },
    {
        id: 999990, // integer|예약고유 id
        reservation_dt: '2017-05-22', // max 10|예약일자|YYYY-MM-DD
        shop_id: 1, // integer|shop 고유 id
        staff_id: 1, // integer|시술자 고유 id(staff)
        start_time: '17:00', // max 5|예약 시작 시간|hh:mm
        end_time: '19:00',  // max 5|예약 종료 시간|hh:mm
        service_time: '02:00', // max 50|소요시간|hh:mm
        guest_id: 6, // integer|예약자 고유 id
        user_id: 666, // integer|예약자 user id
        guest_name: '이건희', // max 100|고객이름
        guest_class: '', // max 10|고객등급
        guest_mobile: '01000013434', // 고객휴대번호
        service_code: 'C', // max 10|상품코드
        shop_service_id: 3, // integer|서비스 고유 id
        status: '01', // max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
        bigo: '', // max 500,nullable|비고
        guest_memo: '', // max 500,nullable|고객메모
        staff_memo: '', // max 500,nullable|직원메모
        is_delete: 0, // boolean|삭제여부
        created_user_id: 1, // 예약 생성자 user id
        updated_user_id: 1, // 예약 수정자 user id
        start: '2017-05-22T17:00+09:00', // datetime(ISO8601)|서비스시작일시|fullcalendar
        end: '2017-05-22T19:00+09:00', // datetime(ISO8601)|서비스종료일시|fullcalendar
        resourceId: 1, // integer|시술자 고유 id(staff)|fullcalendar
        payments: [
            {
                id: 5, // (int) 결제 정보 고유 ID
                shop_schedule_id: 999990, // (int) 예약 정보 고유 ID
                shop_service_id: 3, // (int) 시술 정보 고유 ID
                service_code: 'C', // (string, 10) 시술 정보 Code
                service_name: '헤어커트', // (string, 200) 시술 이름
                payment_amount: '10000.00', // (float) 결제금액
                payment_type: '선결제테스트', // (string , 10)
                bigo: '', // (string, 500) 비고
                is_delete: '', // (boolean) 삭제여부 0/1
            }
        ]
    },
    {
        id: 272727, // integer|예약고유 id
        reservation_dt: '2017-05-22', // max 10|예약일자|YYYY-MM-DD
        shop_id: 1, // integer|shop 고유 id
        staff_id: 1, // integer|시술자 고유 id(staff)
        start_time: '15:10', // max 5|예약 시작 시간|hh:mm
        end_time: '15:30',  // max 5|예약 종료 시간|hh:mm
        service_time: '00:20', // max 50|소요시간|hh:mm
        guest_id: 27, // integer|예약자 고유 id
        user_id: 2727, // integer|예약자 user id
        guest_name: '유창학', // max 100|고객이름
        guest_class: '', // max 10|고객등급
        guest_mobile: '01027272727', // 고객휴대번호
        service_code: 'G', // max 10|상품코드
        shop_service_id: 7, // integer|서비스 고유 id
        status: '03', // max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
        bigo: '', // max 500,nullable|비고
        guest_memo: '저 입대해요 깔끔하게 밀어주세요', // max 500,nullable|고객메모
        staff_memo: '삭발손님!', // max 500,nullable|직원메모
        is_delete: 0, // boolean|삭제여부
        created_user_id: 1, // 예약 생성자 user id
        updated_user_id: 1, // 예약 수정자 user id
        start: '2017-05-22T15:10+09:00', // datetime(ISO8601)|서비스시작일시|fullcalendar
        end: '2017-05-22T15:30+09:00', // datetime(ISO8601)|서비스종료일시|fullcalendar
        resourceId: 1, // integer|시술자 고유 id(staff)|fullcalendar
        payments: [
            {
                id: 270027, // (int) 결제 정보 고유 ID
                shop_schedule_id: 272727, // (int) 예약 정보 고유 ID
                shop_service_id: 7, // (int) 시술 정보 고유 ID
                service_code: 'G', // (string, 10) 시술 정보 Code
                service_name: '삭발', // (string, 200) 시술 이름
                payment_amount: '0.00', // (float) 결제금액
                payment_type: '횟수차감', // (string , 10)
                bigo: '', // (string, 500) 비고
                is_delete: '', // (boolean) 삭제여부 0/1
            }
        ]
    }
];

export default schedule;

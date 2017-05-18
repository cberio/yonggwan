const histories = [
    {
        id: 444222, // integer|예약고유 id
        reservation_dt: '2016-05-16', // max 10|예약일자|YYYY-MM-DD
        shop_id: 1, // integer|shop 고유 id
        staff_id: 1, // integer|시술자 고유 id(staff)
        start_time: '13:00', // max 5|예약 시작 시간|hh:mm
        end_time: '15:00',  // max 5|예약 종료 시간|hh:mm
        service_time: '02:00', // max 50|소요시간|hh:mm
        guest_id: 1, // integer|예약자 고유 id
        user_id: 123, // integer|예약자 user id
        guest_name: '홍고객', // max 100|고객이름
        guest_class: 'NEW', // max 10|고객등급
        guest_mobile: '01012345678', // 고객휴대번호
        service_code: 'A', // max 10|상품코드
        shop_service_id: 1, // integer|서비스 고유 id
        status: '03', // max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
        bigo: '', // max 500,nullable|비고
        guest_memo: '이쁘게 부탁 lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample', // max 500,nullable|고객메모
        staff_memo: '헤어디자인을 신중하게 생각하시는 분~ lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample lorem itsum text sample', // max 500,nullable|직원메모
        is_delete: 0, // boolean|삭제여부
        created_user_id: 1, // 예약 생성자 user id
        updated_user_id: 1, // 예약 수정자 user id
        start: '2016-05-16T13:00+09:00', // datetime(ISO8601)|서비스시작일시|fullcalendar
        end: '2016-05-16T15:00+09:00', // datetime(ISO8601)|서비스종료일시|fullcalendar
        resourceId: 1, // integer|시술자 고유 id(staff)|fullcalendar
        payments: [
            {
                id: 1, // (int) 결제 정보 고유 ID
                shop_schedule_id: 444222, // (int) 예약 정보 고유 ID
                shop_service_id: 1, // (int) 시술 정보 고유 ID
                service_code: 'A', // (string, 10) 시술 정보 Code
                service_name: '염색', // (string, 200) 시술 이름
                payment_amount: '25000.00', // (float) 결제금액
                payment_type: '', // (string , 10)
                bigo: '', // (string, 500) 비고
                is_delete: '', // (boolean) 삭제여부 0/1
            }
        ]
    },
    {
        id: 242411, // integer|예약고유 id
        reservation_dt: '2016-09-17', // max 10|예약일자|YYYY-MM-DD
        shop_id: 1, // integer|shop 고유 id
        staff_id: 1, // integer|시술자 고유 id(staff)
        start_time: '15:00', // max 5|예약 시작 시간|hh:mm
        end_time: '17:00',  // max 5|예약 종료 시간|hh:mm
        service_time: '02:00', // max 50|소요시간|hh:mm
        guest_id: 1, // integer|예약자 고유 id
        user_id: 123, // integer|예약자 user id
        guest_name: '홍고객', // max 100|고객이름
        guest_class: '', // max 10|고객등급
        guest_mobile: '01012345678', // 고객휴대번호
        service_code: 'C', // max 10|상품코드
        shop_service_id: 3, // integer|서비스 고유 id
        status: '02', // max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
        bigo: '', // max 500,nullable|비고
        guest_memo: '이쁘게~', // max 500,nullable|고객메모
        staff_memo: '머리결이 좋은사람. 트리트먼트 항상 해주기', // max 500,nullable|직원메모
        is_delete: 0, // boolean|삭제여부
        created_user_id: 1, // 예약 생성자 user id
        updated_user_id: 1, // 예약 수정자 user id
        start: '2016-09-17T15:00+09:00', // datetime(ISO8601)|서비스시작일시|fullcalendar
        end: '2016-09-17T17:00+09:00', // datetime(ISO8601)|서비스종료일시|fullcalendar
        resourceId: 1, // integer|시술자 고유 id(staff)|fullcalendar
        payments: [
            {
                id: 61425, // (int) 결제 정보 고유 ID
                shop_schedule_id: 242411, // (int) 예약 정보 고유 ID
                shop_service_id: 3, // (int) 시술 정보 고유 ID
                service_code: 'C', // (string, 10) 시술 정보 Code
                service_name: '헤어커트', // (string, 200) 시술 이름
                payment_amount: '10000.00', // (float) 결제금액
                payment_type: '', // (string , 10)
                bigo: '', // (string, 500) 비고
                is_delete: '', // (boolean) 삭제여부 0/1
            }
        ]
    },
    {
        id: 123577, // integer|예약고유 id
        reservation_dt: '2016-10-21', // max 10|예약일자|YYYY-MM-DD
        shop_id: 1, // integer|shop 고유 id
        staff_id: 1, // integer|시술자 고유 id(staff)
        start_time: '15:00', // max 5|예약 시작 시간|hh:mm
        end_time: '17:00',  // max 5|예약 종료 시간|hh:mm
        service_time: '02:00', // max 50|소요시간|hh:mm
        guest_id: 1, // integer|예약자 고유 id
        user_id: 123, // integer|예약자 user id
        guest_name: '홍고객', // max 100|고객이름
        guest_class: '', // max 10|고객등급
        guest_mobile: '01012345678', // 고객휴대번호
        service_code: 'B', // max 10|상품코드
        shop_service_id: 2, // integer|서비스 고유 id
        status: '00', // max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
        bigo: '', // max 500,nullable|비고
        guest_memo: '', // max 500,nullable|고객메모
        staff_memo: '정말 자주 오시는구나~ 이제 단골되겠군~', // max 500,nullable|직원메모
        is_delete: 0, // boolean|삭제여부
        created_user_id: 1, // 예약 생성자 user id
        updated_user_id: 1, // 예약 수정자 user id
        start: '2016-10-21T09:00+09:00', // datetime(ISO8601)|서비스시작일시|fullcalendar
        end: '2016-10-21T11:00+09:00', // datetime(ISO8601)|서비스종료일시|fullcalendar
        resourceId: 1, // integer|시술자 고유 id(staff)|fullcalendar
        payments: []
    },
    {
        id: 225573, // integer|예약고유 id
        reservation_dt: '2016-11-25', // max 10|예약일자|YYYY-MM-DD
        shop_id: 1, // integer|shop 고유 id
        staff_id: 1, // integer|시술자 고유 id(staff)
        start_time: '15:00', // max 5|예약 시작 시간|hh:mm
        end_time: '17:00',  // max 5|예약 종료 시간|hh:mm
        service_time: '02:00', // max 50|소요시간|hh:mm
        guest_id: 1, // integer|예약자 고유 id
        user_id: 123, // integer|예약자 user id
        guest_name: '홍고객', // max 100|고객이름
        guest_class: '', // max 10|고객등급
        guest_mobile: '01012345678', // 고객휴대번호
        service_code: 'C', // max 10|상품코드
        shop_service_id: 3, // integer|서비스 고유 id
        status: '00', // max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
        bigo: '', // max 500,nullable|비고
        guest_memo: '금방가요~', // max 500,nullable|고객메모
        staff_memo: '', // max 500,nullable|직원메모
        is_delete: 0, // boolean|삭제여부
        created_user_id: 1, // 예약 생성자 user id
        updated_user_id: 1, // 예약 수정자 user id
        start: '2016-11-25T15:00+09:00', // datetime(ISO8601)|서비스시작일시|fullcalendar
        end: '2016-11-25T17:00+09:00', // datetime(ISO8601)|서비스종료일시|fullcalendar
        resourceId: 1, // integer|시술자 고유 id(staff)|fullcalendar
        payments: []
    },
    {
        id: 992990, // integer|예약고유 id
        reservation_dt: '2017-05-16', // max 10|예약일자|YYYY-MM-DD
        shop_id: 1, // integer|shop 고유 id
        staff_id: 1, // integer|시술자 고유 id(staff)
        start_time: '17:00', // max 5|예약 시작 시간|hh:mm
        end_time: '19:00',  // max 5|예약 종료 시간|hh:mm
        service_time: '02:00', // max 50|소요시간|hh:mm
        guest_id: 1, // integer|예약자 고유 id
        user_id: 666, // integer|예약자 user id
        guest_name: '이건희', // max 100|고객이름
        guest_class: 'NEW', // max 10|고객등급
        guest_mobile: '01000013434', // 고객휴대번호
        service_code: 'D', // max 10|상품코드
        shop_service_id: 4, // integer|서비스 고유 id
        status: '03', // max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
        bigo: '', // max 500,nullable|비고
        guest_memo: 'zzzzz', // max 500,nullable|고객메모
        staff_memo: '외상 절대 안되요 이손님!!', // max 500,nullable|직원메모
        is_delete: 0, // boolean|삭제여부
        created_user_id: 1, // 예약 생성자 user id
        updated_user_id: 1, // 예약 수정자 user id
        start: '2017-05-16T17:00+09:00', // datetime(ISO8601)|서비스시작일시|fullcalendar
        end: '2017-05-16T19:00+09:00', // datetime(ISO8601)|서비스종료일시|fullcalendar
        resourceId: 1, // integer|시술자 고유 id(staff)|fullcalendar
        payments: []
    }
];

export default histories;

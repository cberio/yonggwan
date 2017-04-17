class DataType {
    static StringField() {
        return 'string';
    }
    static IntegerField() {
        return 'int';
    }
    static DateTimeField() {
        return 'dateTime';
    }
}

export const DataFieldsSet = {
    shop: {
        id: DataType.IntegerField(),
        user_id: DataType.IntegerField(),
        type: DataType.StringField(),
        representative: DataType.StringField(),
        tel: DataType.StringField(),
        mobile: DataType.StringField(),
        email: DataType.StringField(),
        code: DataType.StringField(),
        name: DataType.StringField(),
        addr: DataType.StringField(),
        addr_detail: DataType.StringField(),
        addr_zip: DataType.StringField(),
        descriptions: DataType.StringField(),
        picture: DataType.StringField(),
        rest_period: DataType.IntegerField(),
        is_leave: DataType.IntegerField(),
        leave_dt: DataType.StringField(),
        leave_memo: DataType.StringField(),
        is_use: DataType.IntegerField(),
        admin_memo: DataType.StringField(),
        created_user_id: DataType.IntegerField(),
        updated_user_id: DataType.IntegerField(),
        reservation_closed_dt: DataType.StringField(),
        open_time: DataType.StringField(),
        close_time: DataType.StringField(),
        created_at: DataType.DateTimeField(),
        updated_at: DataType.DateTimeField(),
    },
    staff: {
        id: DataType.IntegerField(),
        shop_id: DataType.IntegerField(),
        user_id: DataType.IntegerField(),
        position: DataType.StringField(),
        nickname: DataType.StringField(),
        label: DataType.StringField(),
        auth: DataType.StringField(),
        work_start_dt: DataType.StringField(),
        work_end_dt: DataType.StringField(),
        is_retire: DataType.IntegerField(),
        bigo: DataType.StringField(),
        staff_mobile: DataType.StringField(),
        staff_name: DataType.StringField(),
        staff_sex: DataType.IntegerField(),
        is_activated: DataType.IntegerField(),
        priority: DataType.IntegerField(),
        created_user_id: DataType.IntegerField(),
        updated_user_id: DataType.IntegerField(),
        picture: DataType.StringField(),
    },
    service: {
        id : DataType.IntegerField(),
        shop_id : DataType.IntegerField(),
        code : DataType.StringField(),
        name : DataType.StringField(),
        label : DataType.StringField(),
        amount : DataType.IntegerField(),
        time : DataType.StringField(),
        descriptions : DataType.StringField(),
        service_order : DataType.IntegerField(),
        sex : DataType.IntegerField(),
        reserve_confirm_yn : DataType.IntegerField(),
        color : DataType.StringField(),
        repeat_number : DataType.IntegerField(),
        is_deposit : DataType.IntegerField(),
        is_use : DataType.IntegerField(),
        created_user_id : DataType.IntegerField(),
        updated_user_id : DataType.IntegerField(),
    },
    schedule: {
        id : DataType.IntegerField(),
        reservation_dt : DataType.StringField(),
        shop_id : DataType.IntegerField(),
        staff_id : DataType.IntegerField(),
        start_time : DataType.StringField(),
        end_time : DataType.StringField(),
        service_time : DataType.StringField(),
        guest_id : DataType.IntegerField(),
        user_id : DataType.IntegerField(),
        guest_name : DataType.StringField(),
        guest_class : DataType.StringField(),
        guest_mobile : DataType.StringField(),
        service_code : DataType.StringField(),
        shop_service_id : DataType.IntegerField(),
        status : DataType.StringField(),
        bigo : DataType.StringField(),
        guest_memo : DataType.StringField(),
        staff_memo : DataType.StringField(),
        is_delete : DataType.IntegerField(),
        created_user_id : DataType.IntegerField(),
        updated_user_id : DataType.IntegerField(),
        start : DataType.DateTimeField(),
        end : DataType.DateTimeField(),
        resourceId : DataType.StringField(),
    },
    guest: {
        id: DataType.IntegerField(),
        shop_id: DataType.IntegerField(),
        user_id: DataType.IntegerField(),
        guest_class: DataType.StringField(),
        guest_name: DataType.StringField(),
        label: DataType.StringField(),
        guest_mobile: DataType.StringField(),
        guest_sex: DataType.IntegerField(),
        residual_count: DataType.IntegerField(),
        residual_money: DataType.StringField(),
        memo: DataType.StringField(),
        picture: DataType.StringField(),
        is_activated: DataType.IntegerField(),
        created_user_id: DataType.IntegerField(),
        updated_user_id: DataType.IntegerField(),
    }
}

export const DataSet = {
    shop: {
        id: 1, // 샵 고유 id
        user_id: 455, // 샵 소유자 user id
        type: 'A1234B5678', //max 10|서비스 분류
        representative: '홍길동',  //max 50|대표자명
        tel: '0312437789', // 대표전화번호
        mobile: '01012345678', // 대표휴대번호
        email: 'example@email.com', // 대표이메일
        code: 'bd2b5f82-4488-3935-83d2-37ec83185cc7', // max 50|shop Code
        name: 'hello shop', //max 100|샵 명칭
        addr: '서울시 중구 을지로', //max 200|SHOP 주소
        addr_detail: '퇴계로 530', // max 200|SHOP 상세주소
        addr_zip: '123-102', //max 10|SHOP 우편번호
        descriptions: '전문가를 위한 서비스', //max 500|SHOP 설명|text
        picture: 'http://lorempixel.com/320/320/?39991', //max 200|썸네일|url
        rest_period: '10', //max 50|휴게시간|10,20,30...
        is_leave: 0, //boolean|탈퇴여부|0,1
        leave_dt: null, //max 10,nullable|탈퇴일자|YYYY-MM-DD
        leave_memo: null, //max 500,nullalbe|탈퇴사유
        is_use: 1, //boolean|사용여부|0,1
        admin_memo: '관리자 작성 메모', //max 500|관리자 메모
        created_user_id: 455,
        updated_user_id: 455,
        reservation_closed_dt: null, //max 10|예약마감일자|YYYY-MM-DD
        open_time: '09:00', //max 5|오픈시간|hh:mm
        close_time: '23:00',//max 5|마감시간|hh:mm
        created_at: '2017-01-23 19:12:53.000', //datetime|생성시간| YYYY-MM-DD hh:mm:ss
        updated_at: '2017-01-23 19:12:53.000', //datetime|수정시간| YYYY-MM-DD hh:mm:ss
    },
    staff: {
        id: 144, // staff 고유 id
        shop_id: 1,  // shop 고유 id
        user_id: 15, // integer,nullable|staff user_id|
        position: '수석디자이너', //max 100|직책
        nickname: '김페페', //max 100|닉네임
        label: '김페페', //max 100|닉네임 (검색 필터링시 value)
        auth: null, //max 10|권한
        work_start_dt: '2017-01-01', //max 10|근무시작일|YYYY-MM-DD
        work_end_dt: null, //max 10,nullable|근무종료일|YYYY-MM-DD
        is_retire: 0, //boolean|퇴사여부|0,1
        bigo: '열심히 잘하는 디자이너', //max 500|비고
        staff_mobile: '01012345678', // 직원 휴대번호
        staff_name: '김소이', //max 200|직원이름
        staff_sex: 1, //integer|직원성별|0,1,2
        is_activated: 1, //boolean|활성화여부|0,1
        priority: 1, //integer,nullable|우선순위
        created_user_id: 455, //integer|생성자 user id
        updated_user_id: 455, //integer|수정자 user id
        picture: 'http://lorempixel.com/320/320/?39991', //max 200|썸네일|url
    },
    service: {
        id : 1, // 서비스 고유 id
        shop_id : 1, // 샵 고유 id
        code : 'A', //max 10|서비스코드
        name : '헤어컷', //max 200|서비스명
        label : '헤어컷', //max 200|서비스명 (검색 필터링시 value)
        amount : 5000.00, // decimal|상품 금액
        time : '30:00', // max 50|소요시간|hh:mm
        descriptions : '상품설명', //max 500|상품설명
        service_order : 1, //integer|순서
        sex : 0, //integer|서비스대상성별|0,1,2(구분없음,남성,여성)
        reserve_confirm_yn : 0, //boolean|예약승인필요여부
        color : 'yellow', //max 20|서비스색상
        repeat_number : 1, //integer|서비스 횟수
        is_deposit : 0, //boolean|예치금 차감여부
        is_use : 1, //boolean|사용여부
        created_user_id : 455,
        updated_user_id : 455,
    },
    schedule: {
        id : 1, //integer|예약고유 id
        reservation_dt : '2017-03-10', //max 10|예약일자|YYYY-MM-DD
        shop_id : 1, //integer|shop 고유 id
        staff_id : 1, //integer|시술자 고유 id(staff)
        start_time : '09:00', //max 5|예약 시작 시간|hh:mm
        end_time : '11:00',  //max 5|예약 종료 시간|hh:mm
        service_time : '02:00', //max 50|소요시간|hh:mm
        guest_id : 1, //integer|예약자 고유 id
        user_id : 123, //integer|예약자 user id
        guest_name : '홍고객', //max 100|고객이름
        guest_class : 'VIP', //max 10|고객등급
        guest_mobile : '01012345678', // 고객휴대번호
        service_code : 'A', //max 10|상품코드
        shop_service_id : 1, //integer|서비스 고유 id
        status : '01', //max 2|예약상태|00:시술완료,01:예약생성,02:예약요청,03:예약완료,04:변경,05:오프타임,99:취소
        bigo : '잘해야 함', //max 500,nullable|비고
        guest_memo : '이쁘게 부탁 dream', //max 500,nullable|고객메모
        staff_memo : '이 고객 하기 실타', //max 500,nullable|직원메모
        is_delete : 0, //boolean|삭제여부
        created_user_id : 123, // 예약 생성자 user id
        updated_user_id : 123, // 예약 수정자 user id
        start : '2017-03-10T09:00+09:00', //datetime(ISO8601)|서비스시작일시|fullcalendar
        end : '2017-03-10T11:00+09:00', //datetime(ISO8601)|서비스종료일시|fullcalendar
        resourceId : 1, //integer|시술자 고유 id(staff)|fullcalendar
    },
    guest: {
        id: 1, //integer|guest 고유 id
        shop_id: 1, //integer|shop 고유 id,
        user_id: null, //integer,nullable|고객 user id
        guest_class: 'VIP', //max 10|고객 등급
        guest_name: '홍고객', //max 100|고객이름
        label : '홍고객', //max 100|고객이름(검색필터링시 value)
        guest_mobile: '01012345678', //고객 휴대번호
        guest_sex: 1, //integer|고객 성별|0:미공개,1:남성,2:여성
        residual_count: null, //integer,nullable|잔여횟수|(아직 미사용)
        residual_money: 0.00, //decimal,nullable|잔여금
        memo: null, //max 1000|고객메모
        picture: 'http://lorempixel.com/320/320/?39991', //max 200|썸네일|url
        is_activated: 1, //boolean,nullable|사용여부
        created_user_id: 455, //생성자 user id
        updated_user_id: 455, //수정자 user id
    }
}

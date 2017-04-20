var shop = {
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
};

export default shop;

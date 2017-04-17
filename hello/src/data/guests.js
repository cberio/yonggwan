var guest = [
  {
    id: 201928, //integer|guest 고유 id
    shop_id: 1, //integer|shop 고유 id,
    user_id: null, //integer,nullable|고객 user id
    guest_class: 'VIP', //max 10|고객 등급
    guest_name: '홍고객', //max 100|고객이름
    label: '홍고객', //max 100|고객이름
    guest_mobile: '01012345678', //고객 휴대번호
    guest_sex: 1, //integer|고객 성별|0:미공개,1:남성,2:여성
    residual_count: null, //integer,nullable|잔여횟수|(아직 미사용)
    residual_money: 0.00, //decimal,nullable|잔여금
    memo: null, //max 1000|고객메모
    picture: 'http://cfile1.uf.tistory.com/image/2278E041566DF58F2D1777', //max 500|썸네일|url
    is_activated: 1, //boolean,nullable|사용여부
    created_user_id: 455, //생성자 user id
    updated_user_id: 455, //수정자 user id

    resourceId: 1,
    kakao: 'agasdcd@co.kr',
    line: 'admin@co.kr'
  },
  {
    id: 453123,
    shop_id: 1,
    user_id: null,
    guest_class: 'NORMAL',
    guest_name: '홍길순',
    label: '홍길순',
    guest_mobile: '01099991234',
    guest_sex: 1,
    residual_count: null,
    residual_money: 0.00,
    memo: null,
    picture: 'http://cfile1.uf.tistory.com/image/2278E041566DF58F2D1777',
    is_activated: 1,
    created_user_id: 455,
    updated_user_id: 455,

    kakao: 'agcd@co.kr',
    line: 'agcd@co.kr'
  },
  {
    id: 324341,
    shop_id: 1,
    user_id: null,
    guest_class: 'VIP',
    guest_name: '이미자',
    label: '이미자',
    guest_mobile: '0102318381',
    guest_sex: 1,
    residual_count: null,
    residual_money: 352000.00,
    memo: '연예인 이미자 선생님',
    picture: null,
    is_activated: 1,
    created_user_id: 455,
    updated_user_id: 455,

    kakao: 'agcd@co.kr',
    line: 'agcd@co.kr'
  },
  {
    id: 546755,
    shop_id: 1,
    user_id: null,
    guest_class: 'NORMAL',
    guest_name: '박미순',
    label: '박미순',
    guest_mobile: '01092992472',
    guest_sex: 1,
    residual_count: null,
    residual_money: 0.00,
    memo: '미순씨~',
    picture: 'http://cfile1.uf.tistory.com/image/2278E041566DF58F2D1777',
    is_activated: 1,
    created_user_id: 455,
    updated_user_id: 455,

    kakao: 'agcd@co.kr',
    line: 'agcd@co.kr'
  },
  {
    id: 3231414,
    shop_id: 1,
    user_id: null,
    guest_class: 'NEW',
    guest_name: '최용관',
    label: '최용관',
    guest_mobile: '01099569234',
    guest_sex: 1,
    residual_count: null,
    residual_money: 0.00,
    memo: null,
    picture: null,
    is_activated: 1,
    created_user_id: 455,
    updated_user_id: 455,

    kakao: 'agcd@co.kr',
    line: 'agcd@co.kr'
  },
  {
    id: 123235,
    shop_id: 1,
    user_id: null,
    guest_class: 'BAD',
    guest_name: '조순희',
    label: '조순희',
    guest_mobile: '01099991010',
    guest_sex: 1,
    residual_count: null,
    residual_money: 222000.00,
    memo: null,
    picture: 'http://cfile1.uf.tistory.com/image/2278E041566DF58F2D1777',
    is_activated: 1,
    created_user_id: 455,
    updated_user_id: 455,

    kakao: 'agcd@co.kr',
    line: 'agcd@co.kr'
  },
  {
    id: 676442,
    shop_id: 1,
    user_id: null,
    guest_class: 'NORMAL',
    guest_name: '사무혁',
    label: '사무혁',
    guest_mobile: '01010109992',
    guest_sex: 1,
    residual_count: null,
    residual_money: 72000.00,
    memo: null,
    picture: 'http://cfile1.uf.tistory.com/image/2278E041566DF58F2D1777',
    is_activated: 1,
    created_user_id: 455,
    updated_user_id: 455,

    kakao: 'agcd@co.kr',
    line: 'agcd@co.kr'
  },
  {
    id: 123456,
    shop_id: 1,
    user_id: null,
    guest_class: 'NORMAL',
    guest_name: '황보관',
    label: '황보관',
    guest_mobile: '01000282947',
    guest_sex: 1,
    residual_count: null,
    residual_money: 0.00,
    memo: '옆집 황가네식당 사장님',
    picture: null,
    is_activated: 1,
    created_user_id: 455,
    updated_user_id: 455,

    kakao: 'agcd@co.kr',
    line: 'agcd@co.kr'
  }
];

export default guest;

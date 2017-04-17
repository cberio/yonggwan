var service = [
  {
    id : 1, // 서비스 고유 id
    shop_id : 1, // 샵 고유 id
    code : 'A', //max 10|서비스코드
    name : '염색', //max 200|서비스명
    label : '염색', //max 200|서비스명
    amount : 25000.00, // decimal|상품 금액
    time : '00:30', // max 50|소요시간|hh:mm
    descriptions : '기본염색', //max 500|상품설명
    service_order : 2, //integer|순서
    sex : 0, //integer|서비스대상성별|0,1,2(구분없음,남성,여성)
    reserve_confirm_yn : 0, //boolean|예약승인필요여부
    color : 'yellow', //max 20|서비스색상
    repeat_number : 1, //integer|서비스 횟수
    is_deposit : 0, //boolean|예치금 차감여부
    is_use : 1, //boolean|사용여부
    created_user_id : 455,
    updated_user_id : 455
  },
  {
    id : 2,
    shop_id : 1,
    code : 'B',
    name : '매직',
    label : '매직',
    amount : 70000.00,
    time : '02:00',
    descriptions : '기본매직',
    service_order : 3,
    sex : 0,
    reserve_confirm_yn : 0,
    color : 'red',
    repeat_number : 1,
    is_deposit : 0,
    is_use : 1,
    created_user_id : 455,
    updated_user_id : 455
  },
  {
    id : 3,
    shop_id : 1,
    code : 'C',
    name : '헤어커트',
    label : '헤어커트',
    amount : 10000.00,
    time : '02:00',
    descriptions : '기본커트',
    service_order : 1,
    sex : 0,
    reserve_confirm_yn : 0,
    color : 'blue',
    repeat_number : 1,
    is_deposit : 0,
    is_use : 1,
    created_user_id : 455,
    updated_user_id : 455
  },
  {
    id : 4,
    shop_id : 1,
    code : 'D',
    name : '남성 드라이',
    label : '남성 드라이',
    amount : 10000.00,
    time : '00:20',
    descriptions : '남성 전용 드라이',
    service_order : 4,
    sex : 0,
    reserve_confirm_yn : 0,
    color : 'red',
    repeat_number : 1,
    is_deposit : 0,
    is_use : 1,
    created_user_id : 455,
    updated_user_id : 455
  },
  {
    id : 5,
    shop_id : 1,
    code : 'E',
    name : '여성 헤어컷',
    label : '여성 헤어컷',
    amount : 20000.00,
    time : '01:00',
    descriptions : '여성 기본커트상품',
    service_order : 5,
    sex : 2,
    reserve_confirm_yn : 0,
    color : 'purple',
    repeat_number : 1,
    is_deposit : 0,
    is_use : 1,
    created_user_id : 455,
    updated_user_id : 455
  },
  {
    id : 6,
    shop_id : 1,
    code : 'F',
    name : '남성 볼륨펌',
    label : '남성 볼륨펌',
    amount : 60000.00,
    time : '02:00',
    descriptions : '남성 볼륨펌',
    service_order : 6,
    sex : 1,
    reserve_confirm_yn : 0,
    color : 'green',
    repeat_number : 1,
    is_deposit : 0,
    is_use : 1,
    created_user_id : 455,
    updated_user_id : 455
  },
  {
    id : 7,
    shop_id : 1,
    code : 'G',
    name : '삭발',
    label : '삭발',
    amount : 10000.00,
    time : '00:20',
    descriptions : '바리깡 0mm 삭발 (민머리)',
    service_order : 7,
    sex : 0,
    reserve_confirm_yn : 0,
    color : 'yellow',
    repeat_number : 1,
    is_deposit : 0,
    is_use : 1,
    created_user_id : 455,
    updated_user_id : 455
  }
];

export default service;

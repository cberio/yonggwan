const staff = [
    {
        id: 1, // staff 고유 id
        shop_id: 1,  // shop 고유 id
        user_id: 1500, // integer,nullable|staff user_id|
        position: '원장', // max 100|직책
        nickname: '원장', // max 100|닉네임
        auth: null, // max 10|권한
        work_start_dt: '2017-01-01', // max 10|근무시작일|YYYY-MM-DD
        work_end_dt: null, // max 10,nullable|근무종료일|YYYY-MM-DD
        is_retire: 0, // boolean|퇴사여부|0,1
        bigo: '샵 원장님', // max 500|비고
        staff_mobile: '01012345678', // 직원 휴대번호
        staff_name: '박가희', // max 200|직원이름
        staff_sex: 1, // integer|직원성별|0,1,2
        is_activated: 1, // boolean|활성화여부|0,1
        priority: 1, // integer,nullable|우선순위
        created_user_id: 455, // integer|생성자 user id
        updated_user_id: 455, // integer|수정자 user id
        picture: 'http://cfile1.uf.tistory.com/image/2278E041566DF58F2D1777'
    },
    {
        id: 2,
        shop_id: 1,
        user_id: 1501,
        position: '부원장',
        nickname: '부원장',
        auth: null,
        work_start_dt: '2017-01-01',
        work_end_dt: null,
        is_retire: 0,
        bigo: '부원장 디자이너',
        staff_mobile: '01012345678',
        staff_name: '최수미',
        staff_sex: 2,
        is_activated: 1,
        priority: 2,
        created_user_id: 455,
        updated_user_id: 455,
        picture: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRnv2rzpn5UuLQn5cj9j61UhSBL_o-faurozBl3OfII8H8IrFwm'
    },
    {
        id: 3,
        shop_id: 1,
        user_id: 1502,
        position: '신입디자이너',
        nickname: '디자이너B',
        auth: null,
        work_start_dt: '2017-01-01',
        work_end_dt: null,
        is_retire: 0,
        bigo: '신입 디자이너',
        staff_mobile: '01012345678',
        staff_name: 'Bryan',
        staff_sex: 2,
        is_activated: 1,
        priority: 3,
        created_user_id: 455,
        updated_user_id: 455,
        picture: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRnv2rzpn5UuLQn5cj9j61UhSBL_o-faurozBl3OfII8H8IrFwm'
    },
    {
        id: 4,
        shop_id: 1,
        user_id: 1503,
        position: '견습디자이너',
        nickname: '디자이너C',
        auth: null,
        work_start_dt: '2017-01-01',
        work_end_dt: null,
        is_retire: 0,
        bigo: '견습 디자이너',
        staff_mobile: '01012345678',
        staff_name: 'Chris',
        staff_sex: 2,
        is_activated: 1,
        priority: 4,
        created_user_id: 455,
        updated_user_id: 455,
        picture: 'http://cfile215.uf.daum.net/image/15485F46504AA081325C97'
    },
    {
        id: 5,
        shop_id: 1,
        user_id: 1504,
        position: '막내디자이너',
        nickname: '디자이너D',
        auth: null,
        work_start_dt: '2017-01-01',
        work_end_dt: null,
        is_retire: 0,
        bigo: '막내 디자이너',
        staff_mobile: '01012345678',
        staff_name: 'Dominic',
        staff_sex: 1,
        is_activated: 1,
        priority: 5,
        created_user_id: 455,
        updated_user_id: 455,
        picture: null
    }
];

export default staff;

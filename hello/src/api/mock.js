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
        auth: DataType.StringField(),
        work_start_dt: DataType.StringField(),
        work_end_dt: DataType.StringField(),
        is_retire: DataType.IntegerField(),
        bigo: DataType.StringField(),
        staff_mobile: DataType.StringField(),
        staff_name: DataType.StringField(),
        staff_sex: DataType.IntegerField(),
        is_activated: DataType.IntegerField(),
        created_user_id: DataType.IntegerField(),
        updated_user_id: DataType.IntegerField(),
    },
    service: {

    },
    schdule: {

    },
}
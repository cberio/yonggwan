import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';
import moment from 'moment';

export default class Schedule {
    constructor({shopId = '', token = ApiUtils.testToken} = {shopId, token}) {
        this.subUrl = process.env.REACT_APP_CURRENT_USER ? `shops/${shopId}/schedules` : 'shops/schedule.json';
        this.apiUrl = ApiUtils.BASE_URL() + this.subUrl;
        this.shopId = shopId;
        this.token = token;
        this.params = new URLSearchParams();
        this.method = '';
    }

    /**
     * type hinting method
     */
    fiedls() {
        return DataFieldsSet.schdule
    }

    /**
     * populate URLSearchParam from current state
     * 
     * @param {Object} calendarConfig { viewType, start, end } 
     * @return {void}
     */
    paramHandler(params = null) {
        let calendarConfig = params.calendarConfig;

        switch(calendarConfig.viewType) {
            default:
            case 'agendaDay':
                this.params.set('start', (calendarConfig.start).format('YYYY-MM-DD'));
            case 'agendaWeekly':
                this.params.set('end', (calendarConfig.end).format('YYYY-MM-DD'));
                break;
        }
        //this.params.set('include', 'service');
    }

    /**
     * api 호출 시 service관계를 추가 로드 합니다.
     * 
     */
    withService() {
        // 1. URLSearchParam에 'include' key로 첫 번째 value 확인
        let relations = this.params.get('include');

        // 2. value에 service가 있으면 return;
        if(relations && relations.includes('service'))
            return this;
        // 3. value에 service가 없거나 'include' key 가 없음
        else {
            // value에 'service' 가 없음 > 'service' 추가
            if(relations)
                this.params.set('include', relations+',service');
            else
                this.params.set('include', 'service');
        }

        return this;
    }

    /**
     * get a schedule data with given id
     * 
     * @param {int} scheduleId
     * @param {Object} current state
     * 
     * @return {Promise} 
     */
    only(scheduleId, params) {
        return fetch(`${this.apiUrl}/${this.shopId}/schedules/${scheduleId}?${this.params}`, {
            method: this.method = 'PUT',
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON)
    }

    /**
     * get schedules data with given state
     * 
     * @param {Object} current state
     */
    get(params) {
        this.paramHandler(params);

        return fetch(`${this.apiUrl}?${this.params}`, {
            method: 'GET',
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON);
    }

    /**
     * update schedule with given data
     * 
     * @param {int} shopId 
     * @param {int} scheduleId
     * @param {object} data 
     */
    update(scheduleId, data) {
        return fetch(`${this.apiUrl}/${scheduleId}`, {
            method: this.method = 'PATCH',
            headers: ApiUtils.HTTP_HEADER(this.token),
            body: data,
        }).then(ApiUtils.parseJSON)
    }

    /**
     * create new shop with given data
     * 
     * @param {object} data 
     */
    create(data) {
        return fetch(`${this.apiUrl}`, {
            method: this.method = 'POST',
            headers: ApiUtils.HTTP_HEADER(this.token, ApiUtils.ContentType.json),
            body: JSON.stringify(data),
        }).then(ApiUtils.parseJSON)
    }
}

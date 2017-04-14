import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';
import moment from 'moment';

export default class Schedule {
    constructor({shopId = '', token = ApiUtils.testToken} = {shopId, token}) {
        this.apiUrl = ApiUtils.BASE_URL()+`shops/${shopId}/schedules`;
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
                this.params.set('start', calendarConfig.start);
            case 'agendaWeekly':
                this.params.set('end', calendarConfig.end);
                break;
        }

        this.params.set('include', 'service')
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
    create(shopId, data) {
        return fetch(`${this.apiUrl}`, {
            method: this.method = 'POST',
            headers: ApiUtils.HTTP_HEADER(this.token),
            body: data,
        }).then(ApiUtils.parseJSON)
    }
}

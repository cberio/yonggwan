import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';
import moment from 'moment';

export default class ScheduleApi {
    constructor(_shopId, _token = ApiUtils.testToken) {
        this.apiUrl = ApiUtils.BASE_URL()+'shops';
        this.shopId = _shopId;
        this.token = _token;
        this.params = new URLSearchParams();
    }

    fiedls() {
        return DataFieldsSet.schdule
    }

    /**
     * populate URLSearchParam from current state
     * 
     * @param {Object} params 
     * @return {void}
     */
    paramHandler(params) {

        this.params.set('start', params.start ? params.start : moment().format('YYYY-MM-DD'));
        this.params.set('end', params.end ? params.end : moment().format('YYYY-MM-DD'));
    }

    /**
     * get a schedule data with given id
     * 
     * @param {int} scheduleId
     * @param {URLSearchParams} params
     * 
     * @return {Promise} 
     */
    getSchedule(scheduleId, params) {
        return fetch(`${this.apiUrl}/${this.shopId}/schedules/${scheduleId}?${params}`, {
            method: 'PUT',
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON)
    }


    /**
     * get schedules data with given params
     * @param {URLSearchParams} params 
     */
    getSchedules(params) {
        this.paramHandler(params);

        return fetch(`${this.apiUrl}/${this.shopId}/schedules?${this.params}`, {
            method: 'GET',
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON)
    }

    /**
     * update schedule with given data
     * 
     * @param {int} shopId 
     * @param {int} scheduleId
     * @param {object} data 
     */
    updateSchedule(scheduleId, data) {
        return fetch(`${this.apiUrl}/${this.shopId}/schedules/${scheduleId}`, {
            method: 'PATCH',
            headers: ApiUtils.HTTP_HEADER(this.token),
            body: data,
        }).then(ApiUtils.parseJSON)
    }

    /**
     * create new shop with given data
     * 
     * @param {object} data 
     */
    createSchedule(shopId, data) {
        return fetch(`${this.apiUrl}/${shopId}/schedules`, {
            method: 'POST',
            headers: ApiUtils.HTTP_HEADER(this.token),
            body: data,
        }).then(ApiUtils.parseJSON)
    }
}

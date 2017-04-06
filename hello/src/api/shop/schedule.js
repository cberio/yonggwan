import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';

export default class ScheduleApi {
    constructor(_shopId, _token = ApiUtils.testToken) {
        this.apiUrl = ApiUtils.BASE_URL()+'shops';
        this.shopId = _shopId;
        this.token = _token;
        this.params = null;
    }

    fiedls() {
        return DataFieldsSet.schdule
    }

    /**
     * void
     * 
     * @param {URLSearchParams} params 
     */
    static paramHandler(params) {
        if(params.has('start')) 
            param.set('reservation_dt', params.get('start'))

        this.params = params;
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
        return fetch(`${this.apiUrl}/${this.shopId}/schedules?${params}`, {
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

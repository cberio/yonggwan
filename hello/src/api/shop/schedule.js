import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';
import moment from 'moment';

export default class ScheduleApi {
    constructor(_shopId, _token = ApiUtils.testToken) {
        this.apiUrl = ApiUtils.BASE_URL()+'shops';
        this.shopId = _shopId;
        this.token = _token;
        this.params = new URLSearchParams();
        this.method = '';
    }

    fiedls() {
        return DataFieldsSet.schdule
    }

    /**
     * populate URLSearchParam from current state
     * 
     * @param {Object} calendarConfig { viewType, start, end } 
     * @return {void}
     */
    paramHandler(_params) {
        let calendarConfig = _params.calendarConfig;

        switch(calendarConfig.viewType) {
            default:
            case 'agendaDay':
                this.params.set('start', calendarConfig.start);
            case 'agendaWeekly':
                this.params.set('end', calendarConfig.end);
                break;
        }
    }

    /**
     * get a schedule data with given id
     * 
     * @param {int} scheduleId
     * @param {Object} current state
     * 
     * @return {Promise} 
     */
    getSchedule(scheduleId, params) {
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
    getSchedules(params) {
        this.paramHandler(params);

        return fetch(`${this.apiUrl}/${this.shopId}/schedules?${this.params}`, {
            method: this.method = 'GET',
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
    createSchedule(shopId, data) {
        return fetch(`${this.apiUrl}/${shopId}/schedules`, {
            method: this.method = 'POST',
            headers: ApiUtils.HTTP_HEADER(this.token),
            body: data,
        }).then(ApiUtils.parseJSON)
    }
}

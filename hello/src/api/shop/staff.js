import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';

export default class StaffApi {
    constructor(_shopId, _token = ApiUtils.testToken) {
        this.apiUrl = ApiUtils.BASE_URL()+'shops';
        this.shopId = _shopId;
        this.token = _token;
        this.params = new URLSearchParams();
    }

    /**
     * type hinting method
     */
    fiedls() {
        return DataFieldsSet.staff
    }

    /**
     * populate URLSearchParam from current state
     * 
     * @param {Object} params 
     * @return {void}
     */
    paramHandler(params) {

        //this.params.set();
    }

    /**
     * get a staff data with given shopId and staffId
     * 
     * @param {int} staffId
     * @param {URLSearchParams} params 
     */
    getStaff(staffId, params) {
        this.paramHandler(params);

        return fetch(`${this.apiUrl}/${this.shopId}/staffs/${staffId}?${this.params}`, {
            method: 'PUT',
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON)
    }

    /**
     * get staffs data with given params
     * 
     * @param {URLSearchParams} params 
     */
    getStaffs(params) {
        this.paramHandler(params);

        return fetch(`${this.apiUrl}/${this.shopId}/staffs?${this.params}`, {
            method: 'GET',
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON);
    }

    /**
     * update shop with given id/data
     * 
     * @param {int} staffId
     * @param {object} data 
     */
    updateStaff(staffId, data) {
        return fetch(`${this.apiUrl}/${this.shopId}/staffs/${staffId}`, {
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
    createStaff(data) {
        return fetch(`${this.apiUrl}/${this.shopId}/staffs`, {
            method: 'POST',
            headers: ApiUtils.HTTP_HEADER(ApiUtils.testToken),
            body: data,
        }).then(ApiUtils.parseJSON)
    }

    /**
     * not yet implemented
     * 
     * @param {int} staffId 
     */
    deleteStaff(staffId) {
        // todo
    }
}
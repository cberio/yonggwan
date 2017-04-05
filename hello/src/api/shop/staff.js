import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';

export default class StaffApi {
    constructor(_shopId) {
        this.shopId = _shopId;
        this.apiUrl = ApiUtils.BASE_URL()+'shops';
    }

    fiedls() {
        return DataFieldsSet.shop
    }

    /**
     * get a specific staff data with given shopId and staffId
     * 
     * @param {int} shopId 
     * @param {int} staffId
     * @param {URLSearchParams} params 
     */
    getStaff(shopId = this.shopId, staffId, params) {
        return fetch(`${this.apiUrl}/${shopId}/staffs/${staffId}`, {
            method: 'PUT',
            headers: ApiUtils.HTTP_HEADER(ApiUtils.testToken),
        }).then(ApiUtils.parseJSON)
    }

    /**
     * get staffs data with given shopId
     * 
     * @param {int} shopId 
     * @param {URLSearchParams} params 
     */
    getStaffs(shopId = this.shopId, params) {
        console.info(this.apiUrl);
        return fetch(`${this.apiUrl}/${shopId}/staffs`, {
            method: 'GET',
            headers: ApiUtils.HTTP_HEADER(ApiUtils.testToken),
        }).then(ApiUtils.parseJSON);
    }

    /**
     * update shop with given data
     * 
     * @param {int} shopId 
     * @param {int} staffId
     * @param {object} data 
     */
    updateStaff(shopId, staffId, data) {
        return fetch(`${this.apiUrl}/${shopId}/staffs/${staffId}`, {
            method: 'PATCH',
            headers: ApiUtils.HTTP_HEADER(ApiUtils.testToken),
            body: data,
        }).then(ApiUtils.parseJSON)
    }

    /**
     * create new shop with given data
     * 
     * @param {object} data 
     */
    createStaff(data) {
        return fetch(`${this.apiUrl}`, {
            method: 'POST',
            headers: ApiUtils.HTTP_HEADER(ApiUtils.testToken),
            body: data,
        }).then(ApiUtils.parseJSON)
    }
}
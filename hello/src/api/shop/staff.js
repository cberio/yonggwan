import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';

export default class Staff {
    constructor({shopId = '', token = ApiUtils.testToken} = {shopId, token}) {
        this.subUrl = process.env.REACT_APP_CURRENT_USER ? `shops/${shopId}/staffs` : 'shops/staff.json';
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
        return DataFieldsSet.staff
    }

    /**
     * populate URLSearchParam from current state
     * 
     * @param {Object} params 
     * @return {void}
     */
    paramHandler(params = null) {

        //this.params.set();
    }

    /**
     * get a staff data with given shopId and staffId
     * 
     * @param {int} staffId
     * @param {URLSearchParams} params 
     */
    only(staffId, params) {
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
    get(params) {
        this.paramHandler(params);

        return fetch(`${this.apiUrl}?${this.params}`, {
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
    update(staffId, data) {
        return fetch(`${this.apiUrl}/${staffId}`, {
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
    create(data) {
        return fetch(`${this.apiUrl}`, {
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
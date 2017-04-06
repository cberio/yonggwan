import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';

export default class ShopApi {
    constructor(_shopId, _token = ApiUtils.testToken) {
        this.apiUrl = ApiUtils.BASE_URL()+'shops';
        this.shopId = _shopId;
        this.token = _token;
    }

    fiedls() {
        return DataFieldsSet.shop
    }

    /**
     * get a shop data with given params
     * 
     * @param {URLSearchParams} params
     */
    getShop(params) {
        return fetch(`${this.apiUrl}/${this.shopId}?${params}`, {
            method: 'PUT',
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON)
    }

    /**
     * update shop with given data
     * 
     * @param {object} data 
     */
    updateShop(data) {
        return fetch(`${this.apiUrl}/${this.shopId}`, {
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
    createShop(data) {
        return fetch(`${this.apiUrl}`, {
            method: 'POST',
            headers: ApiUtils.HTTP_HEADER(this.token),
            body: data,
        }).then(ApiUtils.parseJSON)
    }
}

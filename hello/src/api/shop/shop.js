import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';

export default class ShopApi {
    constructor(_shopId) {
        this.shopId = _shopId;
        this.apiUrl = ApiUtils.BASE_URL()+'shops';
        this.validRelation = [
            'holidays', 
            'subscriptions',
            'services', 
            'staffs', 'guests',
            'schedules',
        ];
    }

    fiedls() {
        return DataFieldsSet.shop
    }

    /**
     * get shop data with given id
     * 
     * @param {int} shopId 
     */
    getShop(shopId) {
        return fetch(`${this.apiUrl}/${shopId}`, {
            method: 'PUT',
            headers: ApiUtils.HTTP_HEADER(ApiUtils.testToken),
        }).then(ApiUtils.parseJSON)
    }

    /**
     * update shop with given data
     * 
     * @param {int} shopId 
     * @param {object} data 
     */
    updateShop(shopId, data) {
        return fetch(`${this.apiUrl}/${shopId}`, {
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
    createShop(data) {
        return fetch(`${this.apiUrl}`, {
            method: 'POST',
            headers: ApiUtils.HTTP_HEADER(ApiUtils.testToken),
            body: data,
        }).then(ApiUtils.parseJSON)
    }
}

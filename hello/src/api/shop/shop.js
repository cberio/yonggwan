import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';
import Staff from './staff';
import Schedule from './schedule';
import Service from './service';
import Guest from './guest';

export default class Shop {
    constructor({ shopId = '', token = ApiUtils.testToken } = { shopId, token }) {
        this.subUrl = process.env.REACT_APP_CURRENT_USER ? 'shops/' : 'shops/shop.json';
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
        return DataFieldsSet.shop;
    }

    /**
     * get a shop data with given params
     *
     * @param {URLSearchParams} params
     */
    only(params) {
        this.apiUrl += this.shopId;
        this.method = 'PUT';

        return fetch(`${this.apiUrl}?${params}`, {
            method: this.method,
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON);
    }

    get() {
        return fetch(`${this.apiUrl}?${this.params}`, {
            method: 'PUT',
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON);
    }

    /**
     * update shop with given data
     *
     * @param {object} data
     */
    update(data) {
        return fetch(`${this.apiUrl}/${this.shopId}`, {
            method: 'PATCH',
            headers: ApiUtils.HTTP_HEADER(this.token),
            body: data,
        }).then(ApiUtils.parseJSON);
    }

    /**
     * create new shop with given data
     *
     * @param {object} data
     */
    create(data) {
        return fetch(`${this.apiUrl}`, {
            method: 'POST',
            headers: ApiUtils.HTTP_HEADER(this.token),
            body: data,
        }).then(ApiUtils.parseJSON);
    }

    staffs() {
        return new Staff(this);
    }

    schedules() {
        return new Schedule(this);
    }

    services() {
        return new Service(this);
    }

    guests() {
        return new Guest(this);
    }
}

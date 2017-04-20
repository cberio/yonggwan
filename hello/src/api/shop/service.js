import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';

export default class Service {
    constructor({shopId = '', token = ApiUtils.testToken} = {shopId, token}) {
        this.apiUrl = ApiUtils.BASE_URL()+`shops/${shopId}/services`;
        this.shopId = shopId;
        this.token = token;
        this.params = new URLSearchParams();
        this.method = '';
    }

    /**
     * type hinting method
     */
    fiedls() {
        return DataFieldsSet.service
    }

    paramHandler(params = null) {

    }

    only(serviceId, params) {

    }

    get(params) {
        this.paramHandler(params);

        return fetch(`${this.apiUrl}?${this.params}`, {
            method: 'GET',
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON);
    }
}

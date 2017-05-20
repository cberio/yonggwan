import * as ApiUtils from '../common';

export default class Guest {
    constructor({ shopId = '', token = ApiUtils.testToken }) {
        this.subUrl = process.env.REACT_APP_CURRENT_USER ? `shops/${shopId}/guests` : 'shops/guest.json';
        this.apiUrl = ApiUtils.BASE_URL() + this.subUrl;
        this.shopId = shopId;
        this.token = token;
        this.params = new URLSearchParams();
        this.method = '';
    }

    paramHandler(params = null) {

    }

    only(guestId, params) {

    }

    get(params) {
        this.paramHandler(params);
        this.method = 'GET';

        return fetch(`${this.apiUrl}?${this.params}`, {
            method: this.method,
            headers: ApiUtils.HTTP_HEADER(this.token),
        }).then(ApiUtils.parseJSON);
    }

    update(guestId, data) {
        this.method = 'PATCH';

        return fetch(`${this.apiUrl}/${guestId}`, {
            method: this.method,
            headers: ApiUtils.HTTP_HEADER(this.token),
            body: JSON.stringify(data)
        }).then(ApiUtils.parseJSON);
    }

    create(data) {
        this.method = 'POST';

        return fetch(`${this.apiUrl}`, {
            method: this.method,
            headers: ApiUtils.HTTP_HEADER(this.token),
            body: JSON.stringify(data)
        }).then(ApiUtils.parseJSON);
    }

    deleteGuest(guestId) {

    }
}

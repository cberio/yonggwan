import { DataFieldsSet } from '../mock';
import * as ApiUtils from '../common';

export default class Service {
    constructor(prop = {shopId, token = ApiUtils.testToken}) {

        this.apiUrl = super.apiUrl;
        this.shopId = super.shopId;
        this.token = super.token;
        this.params = super.params;
    }    
}

export default class ApiException {
    
    constructor( {error: {code = '', fields = { }, message = ''}, status = 0, success = false } 
               = {error: {code, fields, message}, status, success}) {
        this.code = code;
        this.fields = fields;
        this.message = message;
        this.status = status;
        this.success = success;
    }

    showError() {
        console.group(this.code);
        console.table(this);
        console.groupEnd();

        return this;
    } 
}
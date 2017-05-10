
export default class MockAPI {
    constructor(data = []) {
        this.data = data;
        this.payLoad = {
            data: this.data,
            pagination: {
                total: this.data.length,
                count: this.data.length,
                perPage: 200,
            }
        }
    }

    setPayLoad(input = []) {
        this.payLoad = {
            data: input,
            pagination: {
                total: input.length,
                count: input.length,
                perPage: 200,
            }
        }
    }

    get() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(Object.assign({}, this.data));
            }, 500);
        });
    }

    save(input = []) {
        const data = this.setPayLoad(input);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(Object.assign({}, data));
            }, 500);
        });
    }
}

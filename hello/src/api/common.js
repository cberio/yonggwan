export const HTTP_HEADER = token => ({
    'Authorization': token,
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
});

export const BASE_URL = (http = true , env = process.env.NODE_ENV) => {
    let protocol = http ? 'http://' : 'https://';
    let url = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'helloshop-api-jws.azurewebsites.net';
    let suffix = '/api/v1/';
    
    return `${protocol}${url}${suffix}`;
}

export const parseJSON = response => {
    return response.json();
}

export const testToken = process.env.REACT_APP_SECRET_TOKEN;


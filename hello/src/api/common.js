export const ContentType = {
    formData: 'application/x-www-form-urlencoded',
    json: 'application/json',
}

export const HTTP_HEADER = (token, contentType = ContentType.formData) => ({
    'Authorization': token,
    'Accept': 'application/json',
    'Content-Type': contentType,
});

export const BASE_URL = (http = true) => {
    const protocol = http ? 'http://' : 'https://';
    const url = process.env.REACT_APP_API_URL;
    const suffix = '/api/v1/';

    if (process.env.REACT_APP_CURRENT_USER)
        return `${protocol}${url}${suffix}`;

    return `${process.env.PUBLIC_URL}/data/`;
};

export const parseJSON = (response) => {
    return response.json();
};

export const testToken = process.env.REACT_APP_SECRET_TOKEN;


export const HTTP_HEADER = token => ({
    'Authorization': token,
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
});

export const BASE_URL = (http = true , env = process.env.NODE_ENV) => {
    let protocol = http ? 'http://' : 'https://';
    let url = env === 'dev' ? 'helloshop.app' : 'helloshop.app';
    let suffix = '/api/v1/';
    
    return `${protocol}${url}${suffix}`;
}

export const parseJSON = response => {
    return response.json();
}

export const testToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBhYjVkOTIxMDIyMjMyYjRjNWQ5NzZkYmNlZWE1MTYyOGNlYzE4NjQzM2JhZGM4ODIxOTc4ZWUwY2ZhMDA1MmZjMzc2MzhkMTNjYjljNzcwIn0.eyJhdWQiOiIxIiwianRpIjoiMGFiNWQ5MjEwMjIyMzJiNGM1ZDk3NmRiY2VlYTUxNjI4Y2VjMTg2NDMzYmFkYzg4MjE5NzhlZTBjZmEwMDUyZmMzNzYzOGQxM2NiOWM3NzAiLCJpYXQiOjE0ODQwMzY1MjEsIm5iZiI6MTQ4NDAzNjUyMSwiZXhwIjoxNzk5NTY5MzIxLCJzdWIiOiI0NTUiLCJzY29wZXMiOltdfQ.r6riSaEns6xgXkYtydsqSJ4F1Joo4EhXfgQ9Vwd3uHrWPtcXcF9e9Kg0R9FoCmDGCkzgGoGEDHh67UDXrXQpFJVWJu7X3p3VdFMW-5YYXtTr0M0Z1eq89ocnwWhe--ro0DL4UHIGz5Fl8Dsu7XKEiTt0azgXPPAMk5nrKIc6lybuwbNk_nKoBcmGRQ7uBoU9w0x22_AjIK6Av814Bl5aK581bJiCPqtOTl_1SFuWabT5CxWM_NCz-nJfMJHAhxo0YheeT27ro7TwolGBNtBZIZYx3KAVf4nf54Er_NOGveClAi9_sjnPDq8H8RADmMrhRXTMUKlyljiuVux0SbN-CeGuNdlBeKngqbSoK5-sMt6iZFUaV6TFWzFuFVIgZzQatNlZkHZpMgVmRg0tBTUdefmH3S9aMkgCCnWianFRymJKI19mcXbPko6GecS7maZNrfKG1fa2RRN0HL_yY0sV4OlX7n7MS40tJygrTRUWBeLNkA5DKBsu7r9cBW_qnhoDTGFyP9vGInTbpikoiqJFE5LInMR4m_tmO3dEBA8-rN6dhohLzBn265fQKU0ntCSibSs11z3UloTQPsVrm1cmjBJmKRa_OwIxBej2toqPsjmLglkr4Cl3-YbB7wBkGPJT3DR2wAqrMKrQ4YUpyoY-3PCXOSm_8E9tdjY0Xc11Yc4';


import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        // "Access-Control-Allow-Origin": true,
        // 'Access-Control-Allow-Headers': '*',
        // 'Access-Control-Allow-Credentials': 'true',
        // 'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        'Content-Type': 'application/json',
    },
});

axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default axiosClient;


import axiosClient from "./axiosClient";


const dashboardApi = {
    getAll(headers) {
        const url = "/dashboard";
        return axiosClient.get(url, { headers: { ...headers } });
    },
    getGum(headers) {
        const url = "/dashboard/1";
        return axiosClient.get(url, { headers: { ...headers } });
    },
    getMentos(headers) {
        const url = "/dashboard/0";
        return axiosClient.get(url, { headers: { ...headers } });
    }
};

export default dashboardApi;
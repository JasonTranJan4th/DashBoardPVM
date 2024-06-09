import axiosClient from "./axiosClient";


const dashboardApi = {
    getAll() {
        const url = "/dashboard";
        return axiosClient.get(url);
    },
    getGum() {
        const url = "/dashboard/1";
        return axiosClient.get(url);
    },
    getMentos() {
        const url = "/dashboard/0";
        return axiosClient.get(url);
    }
};

export default dashboardApi;
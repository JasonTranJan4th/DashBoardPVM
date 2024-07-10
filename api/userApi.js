import axiosClient from "./axiosClient";

const userApi = {
    getUser(params) {
        const url = "/auth";
        return axiosClient.get(url, { params: { ...params } });
    },
};

export default userApi;
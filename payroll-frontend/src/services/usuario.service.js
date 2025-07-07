import httpClient from "../http-common";

const save = (data) => {
    return httpClient.post("usuario/", data);
};

const update = (data) => {
    return httpClient.put("usuario/", data);
};

const remove = (id) => {
    return httpClient.delete(`usuario/${id}`);
};

const login = (data) => {
    return httpClient.post("usuario/login", data);
};


export default {
    save,
    update,
    remove,
    login,
};

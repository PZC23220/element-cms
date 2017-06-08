import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://jethome.newsjet.io/',
    // baseURL: 'http://jethome.com/',
    timeout: 5000
});
instance.interceptors.response.use(function(response){
    if(response.status === 200){
        return response.data;
    }
}, function(error){
    console.error('http请求失败', error);
    // return Promise.reject(error);
});

export default instance;

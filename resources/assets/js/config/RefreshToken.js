import React, { Component } from 'react';
import config from './index';
class RefreshToken extends Component {
    constructor(props) {
        super(props); 
        axios.get(config.baseurl+"refresh").then(response => {
            // console.log(axios.defaults.headers.common.Authorization);
            // console.log(response.data.token);
            axios.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
            localStorage.setItem('token', response.data.token);
            
            //originalRequest.headers.common.Authorization = 'Bearer ' + data.token;
           
        }).catch(function (error) {
            // redirect to sign out
            //alert("catch");
        })       
    }
   
}
export default RefreshToken;
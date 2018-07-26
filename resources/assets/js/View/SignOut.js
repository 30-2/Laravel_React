import React, { Component } from 'react';
import { Link } from 'react-router';
import config from '../config';
import {browserHistory} from 'react-router';
var $this;
   
class SignOut extends Component {


    componentWillMount() {
        localStorage.removeItem('token');
        localStorage.removeItem('loginUserId');
        localStorage.removeItem('loginUserName');
        localStorage.removeItem('loginUserEmail');
        
        this.props.router.replace('/signin');
       
    }
    signOut(obj){
        alert("Your token was expired");
        localStorage.removeItem('token');
        localStorage.removeItem('loginUserId');
        localStorage.removeItem('loginUserName');
        localStorage.removeItem('loginUserEmail');
       
        obj.props.router.replace('/signin');
    }
    render(){
        return(null)
    }

}export default SignOut;
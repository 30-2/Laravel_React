import React, { Component } from 'react';
import { Link } from 'react-router';
import config from '../config';
import {browserHistory} from 'react-router';
var $this;
   
class SignIn extends Component {
    constructor(props) {
        super(props);
        $this = this;
        this.state = {  email:''
                    ,password:'' 
                    ,formErrors: {}
                    ,invalidError:''        
        }
      }
      componentWillMount() {
        this.setState({
           
        })
      }
      componentDidMount(){
       
      }
      
      handleOnChange(e){
        $this.setState({
          [e.target.name]: e.target.value
        })
      }

      createSubmit(event) {
        event.preventDefault();
        const user = {
            email: $this.state.email
           ,password: $this.state.password
        }
        let uri = config.baseurl+'signin';
        axios.post(uri, user).then((response) => {
            
            if(response.data.result==false){
            $this.setState({ formErrors: response.data.errors,invalidError: '' });
            return false;
            }   
            if(response.data.error=='invalid_credentials'){
 
                $this.setState({ formErrors:{}, invalidError: response.data.errorMsg });
                return false;
            }else{
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('loginUserId', response.data.userID);
                localStorage.setItem('loginUserName', response.data.userName);
                localStorage.setItem('loginUserEmail', response.data.userEmail);
    
                axios.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token');
                browserHistory.push('/booking');
               
            }    
        });
      }
   render() {
        return (
            <div className="col-lg-12">
                <div className="box">
                    <div className="col-lg-10">
                        <h5>Login</h5>
                    </div>
                    
                    <div id="collapse4" className="body">
                     
                        <form onSubmit={this.createSubmit} className="form-horizontal" id="block-validate">
                            <div className = "col-lg-12 has-error">
                                <span className="help-block"> {this.state.invalidError}</span>
                            </div>
                            <div className={(this.state.formErrors.hasOwnProperty('email'))? "form-group has-error": "form-group"}>
                                <label className="control-label col-lg-4">Email:</label>
                                
                                <div className="col-lg-4">
                                    <input type="text" className="form-control" id="email" name="email" onChange={$this.handleOnChange} />
                                    <span className="help-block"> {this.state.formErrors.email} </span>
                                </div>
                            </div>
                            <div className={(this.state.formErrors.hasOwnProperty('password'))? "form-group has-error": "form-group"}>
                                <label className="control-label col-lg-4">Password:</label>
                                <div className="col-lg-4">
                                    <input type="password" className="form-control" id="password" name="password" onChange={$this.handleOnChange} />
                                    <span className="help-block"> {this.state.formErrors.password} </span>
                                </div>
                            
                            </div>
                            
                            <div className="form-actions">
                                <button className="btn btn-primary center-block">Sign in</button>
                            </div>
                        </form>
                        
                    </div>
                
                </div>             
                
            </div>
        );
    }
}

export default SignIn;
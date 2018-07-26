import React, {Component} from 'react';
import {Link} from 'react-router';
import config from '../config';
import Modal from 'react-modal';
import {browserHistory} from 'react-router';
import Pagination from "../components/pagination";
import SignOut from "./SignOut";
var $this;
var signOut;
const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: '50%',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "rgba(158, 134, 134, 0.75)",
  },
  overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.75)",
      zIndex: '5',
    },
};

Modal.setAppElement('#root');
class User extends Component {
  constructor(props) {
    super(props);
    $this = this;
    this.state = {
        perPages: '',
        searchName: '',
        name: '',
        username: '',
        email: '',
        password: '',
        pagination: '',
        mode: '',
        modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.entryName = this.entryName.bind(this);
    this.entryUserName = this.entryUserName.bind(this);
    this.entryEmail = this.entryEmail.bind(this);
    this.entryPassword = this.entryPassword.bind(this);
    this.editFormData = this.editFormData.bind(this);
    signOut = new SignOut();
  }
  componentWillMount() {
    this.setState({
      users: {},
      pagination: {},
      formErrors: { 'name': '', 'username': '', 'password': '' },
    })
  }
  componentDidMount() {
    $this.fetchData();
  }
  openModal(ID) {
    if(ID != null) {
      this.setState({modalIsOpen : true, form : { name: $this.state.name }});
    }
    else {
      this.setState({modalIsOpen: true});
    }
  }
  afterOpenModal() {
    this.subtitle.style.color = "rgb(38, 101, 132)";
  }
  closeModal() {
    this.setState({
      modalIsOpen: false,
      mode: '',
      id: '',
      name: '',
      username: '',
      email: '',
      password: '',
      formErrors: { 'name': '', 'username': '', 'password': '' }
    });
  }
  entryName(e) {
    this.setState({name: e.target.value});
  }
  entryUserName(e) {
    this.setState({username: e.target.value});
  }
  entryEmail(e) {
    this.setState({email: e.target.value});
  }
  entryPassword(e) {
    this.setState({password: e.target.value});
  }
  createSubmit(e) {
    e.preventDefault();
    const users = {
      id: $this.state.id,
      name: $this.state.name,
      username: $this.state.username,
      email: $this.state.email,
      password: $this.state.password,
      mode: $this.state.mode
    }
    let uri = config.baseurl+'users';
    axios.post(uri, users).then((response) => {
      if(response.data.result == false) {
        $this.setState({ formErrors: response.data.errors });
        return false;
      }
      else {
        $this.closeModal();
        $this.fetchData();
      }
    })
    .catch(function (error) {
      if(error.response.status == 401){
          signOut.signOut($this);
      }
      
  });
  }
  editFormData(id) {
    let uri = config.baseurl+'users/'+id+'/edit';
    axios.get(uri).then((response) => {
      $this.openModal();
      $this.setState({
        id: response.data.id,
        name: response.data.name,
        username: response.data.username,
        email: response.data.email,
        password: '',
        mode: 'edit'
      });
    }).catch(function (error) {
      if(error.response.status == 401){
          signOut.signOut($this);
      }
      
    });
  }
  filterList(event) {
    $this.setState({searchName: event.target.value.toLowerCase()});
  }
  onChangePagi(event) {
    $this.setState({perPages  : event.target.value},function() {
        $this.fetchData();
    });
  }
  fetchData(page = 1) {
    axios.get(config.baseurl+"users?page="+page+"&name="+$this.state.searchName+"&perPages="+$this.state.perPages).then(response => {
        $this.setState({users: response.data.users.data});
        $this.setState({pagination: response.data.pagination});
    })
    .catch(function (error) {
      if(error.response.status == 401){
          signOut.signOut($this);
      }
      
    })
  }
  tabRow(openModal) {
    if($this.state.users instanceof Array) {
      return $this.state.users.map(function(object, i) {
          return <SingleRow obj={object} key={i} openModal={openModal}/>;
      });
    }
  }
  renderLabel() {
    if(this.state.mode == 'edit') {
      return(
        <label ref={subtitle => this.subtitle = subtitle} htmlFor="cp3" id="labelStyle">Update User</label>
      );
    }
    else {
      return(
        <label ref={subtitle => this.subtitle = subtitle} htmlFor="cp3" id="labelStyle">Create User</label>
      );
    }
  }
  renderButton() {
    if(this.state.mode == 'edit') {
      return(
        <button className="btn btn-primary">Update User</button>
      );
    }
    else {
      return(
        <button className="btn btn-primary">Add User</button>
      );
    }
  }
    render() {
      return (
        <div className="col-lg-12">
                <div className="box">
                    <div className="col-lg-10">
                        <h1 className="text-primary">User</h1>
                    </div>
                    <div className="col-lg-1">
                        <button className="btn btn-primary" onClick={() => this.openModal()}>Add New User</button>        
                    </div>    

                    <div id="collapse4" className="body">
                        <div id="searchStyle" className="row">
                            <div className="col-lg-10">
                                
                                <div id ="dataTable_length" className="dataTables_length">
                                    <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList}/>
                                    <button onClick={() => this.fetchData()} className="btn btn-primary">Search</button>
                                </div>
                            </div>
                        </div>  
                        <div id="dataStyle" className="row">
                            <div className="col-sm-12">
                                <table id="dataTable" className="table table-bordered table-condensed table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>User Name</th>
                                            <th>Email</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tabRow(this.openModal)}
                                    </tbody>                
                                </table>
                            </div>
                        </div>
                        <div id="dataTable_paginate" className="dataTables_paginate paging_simple_numbers" >
                            <Pagination
                                paginate = {this.state.pagination}
                                onPageChange={this.fetchData}
                                onChangePagi={this.onChangePagi}
                            />
                        </div>
                    </div>
                
                </div>             
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                  <div id="collapseOne" className="body">
                    <div className="col-lg-11">
                        {this.renderLabel()}
                    </div>       
                    <div className="col-lg-1">
                        <button onClick={this.closeModal} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <form onSubmit={this.createSubmit} className="form-horizontal" id="block-validate">
                        <div className={(this.state.formErrors.name=="The name field is required.")? "form-group has-error": "form-group"}>
                            <label htmlFor="cp3" className="control-label col-lg-4">Name:</label>
                            
                            <div className="col-lg-4">
                                <input type="text" className="form-control" id="user_name" autoFocus="true" name="user_name" onChange={$this.entryName} value={this.state.name} />
                                <span className="help-block"> {this.state.formErrors.name} </span>
                            </div>
                        </div>

                        <div className={(this.state.formErrors.username=="The username field is required.")? "form-group has-error": "form-group"}>
                            <label htmlFor="cp3" className="control-label col-lg-4">User Name:</label>
                            
                            <div className="col-lg-4">
                            
                                <input type="text" className="form-control" id="user_username" name="user_username" onChange={$this.entryUserName} value={this.state.username} />
                                <span className="help-block"> {this.state.formErrors.username} </span>
                            </div>
                        </div>

                        <div className={(this.state.formErrors.email=="The email field is required." || this.state.formErrors.email=="The email has already been taken.")? "form-group has-error": "form-group"}>
                            <label htmlFor="cp3" className="control-label col-lg-4">Email:</label>
                            
                            <div className="col-lg-4">
                            
                                <input type="email" className="form-control" id="user_email" name="user_email" onChange={$this.entryEmail} value={this.state.email} />
                                <span className="help-block"> {this.state.formErrors.email} </span>
                            </div>
                        </div>

                        <div className={(this.state.formErrors.password=="The password field is required.")? "form-group has-error": "form-group"}>
                            <label htmlFor="cp3" className="control-label col-lg-4">Password:</label>
                            
                            <div className="col-lg-4">
                            
                                <input type="password" className="form-control" id="user_password" name="user_password" onChange={$this.entryPassword} />
                                <span className="help-block"> {this.state.formErrors.password} </span>
                            </div>
                        </div>
                        
                        <div className="form-actions no-margin-bottom">
                          {this.renderButton()}
                        </div>
                    </form>
                </div>
              </Modal>
            </div>
      );
    }
}
class SingleRow extends Component {
  constructor(props) {
    super(props);
    this.deleteSubmit = this.deleteSubmit.bind(this);
  }
  deleteSubmit(e) {
    e.preventDefault();
    var msg=confirm("Are you sure to delete?");
    if(msg==true){
      let uri = config.baseurl+"users/"+this.props.obj.id;
      axios.delete(uri);
      $this.fetchData();
    }
  }
  render() {
    return (
      <tr>
        <td>
          {this.props.obj.id}
        </td>
        <td>
          {this.props.obj.name}
        </td>
        <td>
          {this.props.obj.username}
        </td>
        <td>
          {this.props.obj.email}
        </td>
        <td>
          <button className="btn btn-primary" onClick={() => $this.editFormData(this.props.obj.id)}>Edit</button>
        </td>
        <td>
          <form onSubmit={this.deleteSubmit}>
            <input type="submit" value="Delete" className="btn btn-danger"/>
          </form>
        </td>
      </tr>
    );
  }
}

export default User;
import React, {Component} from 'react';
import { Router, Route, Link } from 'react-router';
import {browserHistory} from 'react-router';
import config from '../config';
// import {
//   NavLink,
//   HashRouter
// } from "react-router-dom";

// import CreateItem from './CreateItem';
// import Example from './Example';


class Master extends Component {
  navMenu(){
    let navMenu = []
    if("token" in localStorage){
      navMenu.push(<li key="dashboard"><Link to="dashboard"><i className="fa fa fa-dashboard menu-icon"></i><span className="nav-menu">&nbsp;Dashboard</span></Link></li>);
      navMenu.push(<li key="booking"><Link to="booking"><i className="fa fa-address-book menu-icon"></i><span className="nav-menu">&nbsp;Booking</span></Link></li>);
      navMenu.push(<li key="roomtype"><Link to="roomtype"><i className="glyphicon glyphicon-list-alt menu-icon"></i><span className="nav-menu">&nbsp;Room Type</span></Link></li>);
      navMenu.push(<li key="room"><Link to="Room"><i className="glyphicon glyphicon-bed menu-icon"></i><span className="nav-menu">&nbsp;Room</span></Link></li>);
      navMenu.push(<li key="user"><Link to="user"><i className="fa fa-users menu-icon"></i><span className="nav-menu">&nbsp;User</span></Link></li>);
      //navMenu.push(<li key="signout"><Link to="signout">Sign Out</Link></li>);
    }
    // }else{
    //   navMenu.push(<li key="7"><Link to="signin">Sign In</Link></li>);
      
    // }
    return navMenu;
  }
  userProfile(){
    let userProfile = []
    if("token" in localStorage){
      
      userProfile.push(  <li className="userProfile" key="loginUserName"><i className="glyphicon glyphicon-user menu-icon"></i> <span className="nav-menu">&nbsp;{localStorage.getItem('loginUserName')}</span></li>);
      userProfile.push(  <li className="userProfile" key="loginUserEmail"><i className="glyphicon glyphicon-envelope menu-icon"></i> <span className="nav-menu">&nbsp;{localStorage.getItem('loginUserEmail')}</span></li>);
                                    
    }
  return userProfile;
  }
  menuBar(){
    let menuBar = []
    if("token" in localStorage){
      menuBar.push(
                <div className="nav" key="nav"> 
                  <div className="btn-group main-bar" key="full-screen-div">
                      <a data-placement="bottom" title="Fullscreen" data-toggle="tooltip"
                        className="btn btn-default btn-sm" id="toggleFullScreen" onClick={this.toggleFullscreen}>
                        <i className="glyphicon glyphicon-fullscreen"></i>
                      </a>
                  </div>
                  <div className="btn-group main-bar" key="menu-div">
                      <a data-placement="bottom" title="Menu Show/Hide" data-toggle="tooltip"
                        className="btn btn-primary btn-sm toggle-left" id="toggleMenu" onClick={this.toggleMenu}>
                        <i className="fa fa-bars"></i>
                      </a>
                  </div>
                  <div className="btn-group main-bar" key="signout-div">
                      <Link to="signout" className="btn btn-metis-1 btn-sm" title="Sign Out" data-toggle="tooltip"> <i className="fa fa-power-off"></i></Link>
                  </div>
                </div>);
    }
    return menuBar;
  }
  componentDidMount() {
    if("token" in localStorage){
      if(window.location.href == config.url || window.location.href == config.url+'signin'){
        browserHistory.push('/dashboard'); 
      }
        
    } else { 
        browserHistory.push('/signin'); 
    }
}
toggleFullscreen(event) {
  var element = document.body;

  if (event instanceof HTMLElement) {
    element = event;
  }

  var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

  element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
  document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };

  isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
}
toggleMenu(event){
  if( $('#left').is(':visible') && $('.nav-menu').is(':visible') ) {
    $('#left').animate({ 'width': '40px' }, 'fast', function(){
        $('.nav-menu').hide();
    });
}else if($('#left').is(':visible') && !$('.nav-menu').is(':visible') ){
  $('#left').animate({ 'width': '0px' }, 'fast', function(){
    $('#left').hide();   
});
}
else {
    $('#left').show();
    $('.nav-menu').show();
    $('#left').animate({ 'width': '260px' }, 'fast'); 
           
}
}
  render(){
    
    return (
    <div>
      <div className="bg-dark dk" id="wrap">
        <div id = "top">
          <header className="head">
            <div className="main-bar col-lg-10">                   
              <h3>
                <i className="fa fa-calendar menu-icon"></i> Hotel Reservation
              </h3>
            </div>
            {this.menuBar()}
          </header>
        </div>
         
        <div id ="left">
          <div className="media user-media bg-dark dker">
            <div className="user-media-toggleHover">
              <span className="fa fa-user"></span>
            </div>
            <div className="user-wrapper bg-dark">
              <div className="media-body" key="media-body">
                <ul className="list-unstyled user-info" key="list-unstyled">
                  {this.userProfile()}
                </ul>
              </div>
            </div>
          </div>
          <ul id="menu">
            {this.navMenu()}
          </ul>
        </div>

        <div id="content">
          <div className="outer">
            <div className="inner bg-light lter">
              <div className="row" key="row">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* footer div */}
        <div id="footerdiv">
          <p>2018 &copy; Hotel Reservation</p>
        </div>
      {/* footer div */}
    </div>
      
    )
  }
}
export default Master;
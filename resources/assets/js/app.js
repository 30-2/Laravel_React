require('./bootstrap');

// require('./metic/less.js');
// require('../lib/jquery/jquery.js');
// //require('./metic/moment.js');
// require('./metic/jquery-ui.min.js');
// require('./metic/fullcalendar.min.js');


// require('./metic/bootstrap.min.js');
// require('./metic/jquery.tablesorter.min.js');
// require('./metic/jquery.sparkline.min.js');
// require('./metic/jquery.flot.min.js');
// require('./metic/jquery.flot.selection.min.js');
// require('./metic/jquery.flot.resize.min.js');
// require('./metic/bootstrap.js');
// require('../lib/metismenu/metisMenu.js');
// require('../lib/onoffcanvas/onoffcanvas.js');
// require('../lib/screenfull/screenfull.js');
// require('./metic/core.js');

// require('./metic/app.js');
//require('./metic/style-switcher.js');

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

// import '../lib/bootstrap/css/bootstrap.css';
// import '../lib/font-awesome/css/font-awesome.css';
// import '../css/main.css';
// import '../lib/bootstrap/css/bootstrap.css';
// import '../lib/metismenu/metisMenu.css';
// import '../lib/onoffcanvas/onoffcanvas.css';
// import '../lib/animate.css/animate.css';

// import '../jquery/jquery-ui.min.css';
// import '../jquery/jquery-ui.theme.min.css';
// import '../jquery/validationEngine.jquery.min.css';
// import '../css/style-switcher.css';
// import '../less/theme.less';

/*********** moved to app.scss *****************/
// import '../lib/bootstrap/css/bootstrap.css';
// import '../lib/bootstrap/css/bootstrap.min.css';
// import '../lib/font-awesome/css/font-awesome.css';
// import '../lib/font-awesome/css/font-awesome.min.css';
// import '../css/main.css';
// import '../lib/metismenu/metisMenu.css';
// import '../lib/onoffcanvas/onoffcanvas.css';
// import '../lib/animate.css/animate.css';
/****************************/

// import '../css/bootstrap.min.css';
// import '../css/font-awesome.min.css';
//import '../css/style-switcher.css';
//import '../less/theme.less';
//import "fullcalendar";

import Master from './View/Master';
import CreateItem from './View/CreateItem';
import Booking from './View/Booking';
import Dashboard from './View/Dashboard';
import RoomType from './View/RoomType';
import Room from './View/Room';
import User from './View/User';
import SignIn from './View/SignIn';
import SignOut from './View/SignOut';

if("token" in localStorage){
  axios.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token');
}

  render(
   <Router history={browserHistory}>
      <Route path="/" component={Master} >
      <Route path="/signin" component={SignIn}/>
      <Route path="/dashboard" component={Dashboard}/> 
     	<Route path="/booking" component={Booking}/>
      	<Route path="/roomtype" component={RoomType}/>
        <Route path="/Room" component={Room}/>
        {/* <Route path="/example" component={Example}/> */}
        <Route path="/user" component={User}/> 
        <Route path="/signout" component={SignOut}/>  
      </Route>
    </Router>,
   // <Example />,
   document.getElementById('root')
 );

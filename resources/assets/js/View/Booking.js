import React, { Component } from 'react';
//import { Link } from 'react-router';
import Modal from 'react-modal';
import config from '../config';
//import {browserHistory} from 'react-router';
import Pagination from "../components/pagination";
//import Authenticate from '../config/Authenticate';
import SignOut from "./SignOut";
import RefreshToken from '../config/RefreshToken';

var $this;
var signOut;
var refreshToken;
const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : '50%',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      backgroundColor: "rgba(158, 134, 134, 0.75)",
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        zIndex                : '5',
      },
  };
  let months = ["Jan","Feb","Mar","Apr"
                        ,"May","Jun","Jul","Aug"
                        ,"Sep","Oct","Nov","Dec"]
   
  // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
  Modal.setAppElement('#root');
class Booking extends Component {
    constructor(props) {
        super(props);
        $this = this;
        this.state = {  perPages:''
                        , searchYear: ''
                        , searchMonth: ''
                        , bookings: ''
                        , dates: ''
                        , rooms: ''
                        , pagination: ''
                        , name: ''
                        , roomId: ''
                        , id: ''
                        , reservedDate: ''
                        , roomStatus: ''
                        , price: ''
                        , editButton: ''
                        , noOfBookings:''
                        ,modalIsOpen: false};
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        signOut = new SignOut();
      }
      componentWillMount() {
        this.setState({
            bookings: {}
            ,dates: {}
            ,rooms: {}
            ,roomStatus:0
            ,searchYear: new Date().getFullYear()
            ,searchMonth: new Date().getMonth() +1
            ,pagination: {}
            ,formErrors: {}
        })
      }
      componentDidMount(){
        $this.fetchData();
        refreshToken = new RefreshToken();
      }

      //to open modal
      openModal() {
        this.setState({modalIsOpen: true});
      }
      afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
      }
      //to close Modal
      closeModal() {
       
        this.setState({modalIsOpen: false
                        ,formErrors: {}
                        , name: ''
                        , roomId: ''
                        , id: ''
                        , reservedDate: ''
                        , price: ''
                        , roomStatus:0
                        , editButton: ''
                        , noOfBookings: ''});
        }
      getfullDay(t){
        var date=new Date(this.state.searchYear+'/'+this.state.searchMonth+'/'+t);
        var weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";
        var day = weekday[date.getDay()];
        return day;
     }
      tableTh(){
        let tableTr = []
        if($this.state.dates instanceof Array){
            $this.state.dates.map(function(date, key){
                tableTr.push(<th key={key}>{date}<br/>
                <span>{$this.getfullDay(date)}</span>
                </th>)
           })
        }
        return tableTr
      }
      
      openRegisterModal(roomId,date,checkCreate=""){
        var reservedDate= $this.state.searchYear+'_'+$this.state.searchMonth+'_'+date;
        //register booking
        if(checkCreate == ""){
            this.setState({modalIsOpen: true,roomId:roomId,reservedDate:reservedDate});
        }else{
            //new booking when booking status is check out
            this.setState({editButton: '',id:'',name:'',roomStatus:'0',price:'',roomId:roomId,reservedDate:date});
        }
      }
      openUpdateModal(id,noOfBookings=""){
        
        let uri = config.baseurl+'bookings/'+id;
        //let roomId,price,roomStatus,name,reserverdDate  = '';
        axios.get(uri).then(response => {
            this.setState({modalIsOpen: true
                ,roomId:response.data.room_id
                ,reservedDate:response.data.reserved_date
                ,price:response.data.price
                ,roomStatus:response.data.room_status
                ,name:response.data.name
                ,id:id
                ,noOfBookings:noOfBookings});
         
        })
        .catch(function (error) {
            
            if(error.response.status == 401){
                signOut.signOut($this);
            }
        });
        
      }
      isDateExpire(date=''){
         if(date == ''){
             date = $this.state.reservedDate.substring(8,10);
         }
          if($this.state.searchYear < new Date().getFullYear()){
                return true;
          }
          if($this.state.searchYear == new Date().getFullYear()){
              if($this.state.searchMonth < new Date().getMonth() + 1){
                return true;
              }
              if($this.state.searchMonth == new Date().getMonth() + 1){
                  if(date <new Date().getDate()){
                      return true;
                  }
              }
          }
          return false;
        
      }
      //to display table row
      tabRow(openModal){
        
        let table = []
        var bookings = $this.state.bookings; 
        var roomStatusData ={0:"Check In",1:"Stay",2:"Check Out"};
        var dateCheck = '';
        if($this.state.rooms instanceof Array){
             $this.state.rooms.map(function(room, roomKey){
                
                 let childTr = []
                
                 childTr.push(<td key={'name'+roomKey}> {room.name}</td>);
                 childTr.push(<td key={'roomtype'+roomKey}> {room.roomtype_name}</td>);
                if($this.state.dates instanceof Array){
                 $this.state.dates.map(function(date, key){
                     var idDate = date+"_"+room.id;
                     var isDateExpire = $this.isDateExpire(date);
                     if(bookings.hasOwnProperty(idDate)){
                         
                         
                        if(bookings[idDate].hasOwnProperty('secondBooking')){
                            var bookingOne = bookings[idDate]['firstBooking'];
                            var bookingTwo = bookings[idDate]['secondBooking'];
                            childTr.push(<td className="danger checkin_out_td pointer" id={date} key={'btn'+key}>
                                     
                                      <div className="btn-group-vertical">
                                        <button type="button" className="btn btn-info checkin_out_btn" onClick={() => $this.openUpdateModal(bookingOne.id, "2")}>{roomStatusData[bookingOne.room_status]}</button>
                                        <button type="button" className="btn btn-info checkin_out_btn" onClick={() => $this.openUpdateModal(bookingTwo.id,"2")}> {roomStatusData[bookingTwo.room_status]}</button>
                                      </div>

                                     </td>);
                        }else{
                            var bookingOne = bookings[idDate]['firstBooking'];
                            childTr.push(<td className="danger pointer" id={date} onClick={() => $this.openUpdateModal(bookingOne.id)} key={'btn'+key}>
                                     {roomStatusData[bookingOne.room_status]}
                                     
                                     </td>);
                        }
                        
                     }else{
                         if(isDateExpire){
                            childTr.push(<td id={room.id} key={'id'+key}>
                            </td>);
                         }else{
                            childTr.push(<td className="pointer" id={room.id} onClick={() => $this.openRegisterModal(room.id,date)} key={'id'+key}>
                            </td>);
                         }
                        
                     }
                   
                })
                }
                table.push(<tr key={'tr'+roomKey}>{childTr}</tr>)
            })
        }
        return table
      }
      
      handleOnChange(e){
        $this.setState({
          [e.target.name]: e.target.value
        })
      }

      createSubmit(event) {
        event.preventDefault();
        
        const roomtypes = {
          name: $this.state.name
          ,room_status: $this.state.roomStatus
          ,price: $this.state.price
          ,room_id: $this.state.roomId
          ,reserved_date:$this.state.reservedDate
          ,id:$this.state.id
          ,user_id : localStorage.getItem('loginUserId')
        }

        let uri = config.baseurl+'bookings';
        axios.post(uri, roomtypes).then((response) => {
           
            if(response.data.result==false){
                $this.setState({ formErrors: response.data.errors });
                return false;
            }else{
                
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
      filter(event){
        //console.log(event.target);
        $this.setState({[event.target.name]  : event.target.value},function(){
            $this.fetchData();});
      }
      onChangePagi(event){
        $this.setState({perPages  : event.target.value},function(){
        $this.fetchData();});
      }
      fetchData(page =1){
        axios.get(config.baseurl+"bookings?page="+page+"&year="+$this.state.searchYear+"&month="+$this.state.searchMonth+"&perPages="+$this.state.perPages)
        .then(response => {
           
            $this.setState({ dates: response.data.dates });
            $this.setState({ rooms: response.data.rooms.data });
            $this.setState({ bookings: response.data.bookings });
            $this.setState({ pagination: response.data.pagination });
        
        })
        .catch(function (error) {
            if(error.response.status == 401){
                signOut.signOut($this);
            }
            
        })
      }
      yearOption() {
        let startYear = parseInt(this.state.searchYear) - 5;
        let endYear = parseInt(this.state.searchYear) + 5;
        let yearOption = []
        for (let i = startYear; i <= endYear; i++) {
            yearOption.push(<option key={i} value={i}>{i}</option>)
        }
        return (
            yearOption
        );
      }
      monthOption() {
        
        let monthOption = []
        months.map(function(month, key){
            monthOption.push(<option key={key} value={key+1}>{month}</option>)
        });
        return (
            monthOption
        );
      }
      editButtonClick(event){
            event.preventDefault();
            $this.setState({editButton: 1});
      }
      backClick(event){
            event.preventDefault();
            $this.setState({editButton: ''});
      }
      cancelButtonClick(event){
        event.preventDefault();
        if(confirm("Do you want to cancel this booking?")){
            let uri = config.baseurl+'bookings/'+$this.state.id;
            axios.delete(uri).then((response) => {
                $this.closeModal(); 
                $this.fetchData();
            })
            .catch(function (error) {
                if(error.response.status == 401){
                    signOut.signOut($this);
                }
                
            });
        }
      }
   render() {
       var formerrors = this.state.formErrors;
       
        return (
            <div className="col-lg-12">
                <div className="box">
                    <div className="col-lg-10">
                        <h3 className="text-primary">Reservation</h3>
                    </div>
                    <div className="col-lg-1">
                        {/* <button className="btn btn-primary" onClick={() => this.openEditModal()}>Add New  Room Type</button>         */}
                    </div>    

                    <div id="collapse4" className="body">
                        <div className="row">
                            <div className="col-lg-4 search-bar">
                                <div id ="dataTable_length" className="dataTables_length">
                                    {/* <input type="text" className="form-control form-control-lg" id="date-picker" value={this.state.searchYear} placeholder="Year" onChange={this.filterYear}/> */}
                                    <select className="form-control selected_month" name="searchYear" value={this.state.searchYear} onChange={this.filter}>
                                        {this.yearOption()}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4 search-bar">
                                <div id ="dataTable_length" className="dataTables_length">
                                    <select className="form-control selected_month" name="searchMonth" value={this.state.searchMonth} onChange={this.filter}>
                                        {this.monthOption()}
                                    </select>

                                </div>
                            </div>
                            {/* <div className="col-lg-1">
                                <div id ="dataTable_filter" className="dataTables_filter">
                                    <button onClick={() => this.fetchData()} className="btn btn-primary">Search</button>
                                </div>
                            </div> */}
                        </div>  
                        <div className="row">
                            <div className="col-sm-12">
                                <div className=" table-responsive">
                                    <table id="dataTable" className="table table-bordered table-condensed table-hover table-striped">
                                        <thead>
                                            <tr>
                                            <th colSpan="2">{$this.state.searchYear != ''?$this.state.searchYear: new Date().getFullYear()}-<br/><span>{$this.state.searchMonth != ''? months[$this.state.searchMonth-1] : months[new Date().getMonth()]} </span></th>
                                                {this.tableTh()}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.tabRow(this.openModal)}
                                        </tbody>                
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <Pagination
                            paginate = {this.state.pagination}
                            onPageChange={this.fetchData}
                            onChangePagi={this.onChangePagi}
                        />  
                       
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
                    
                    <div className="col-lg-10">
                        <label ref={subtitle => this.subtitle = subtitle} ><h3 className="text-primary">Reservation</h3></label>
                    </div>       
                    <div className="col-lg-2">
                        <button onClick={this.closeModal} className="close" aria-label="Close"><span aria-hidden="true"><h2>&times;</h2></span></button>
                    </div>
                    
                        
                        <ModalForm
                            params={this.state}
                            handleOnChange = {this.handleOnChange}
                            createSubmit ={this.createSubmit}
                            editButtonClick ={this.editButtonClick}
                            cancelButtonClick = {this.cancelButtonClick}
                            openRegisterModal ={this.openRegisterModal}
                            isDateExpire = {$this.isDateExpire}
                            backClick = {this.backClick}
                           />
                        
                </div>
                </Modal>
            </div>
        );
    }
}
class ModalForm extends Component{
    constructor(props) {
        super(props);
    }
    
    render(){

        var buttonDisplay = [];
        var nameInput = [];
        var roomStatusInput = [];
        var roomStatus = ["Check In","Stay", "Check Out"];
        var priceInput =[];
        
        
       if(this.props.params.id != '' && this.props.params.editButton == ''){
            var isDateExpire = this.props.isDateExpire();
                if(!isDateExpire){
                    if(this.props.params.roomStatus != 2){
                        buttonDisplay.push(<div key="div-edit" className="form-actions col-lg-6">
                            <button key="btn-name" onClick={this.props.editButtonClick} className="btn btn-primary center-block" >Edit Booking</button>
                            </div>);
                    }
                    
                    buttonDisplay.push(<div key="div-cancel" className="form-actions col-lg-6">
                    <button key="btn-cancel" onClick={this.props.cancelButtonClick} className="btn btn-primary center-block" >Cancel Booking</button>
                    </div>);
                }
                
            if(this.props.params.roomStatus == 2 && this.props.params.noOfBookings==''){
                var isDateExpire = this.props.isDateExpire();
                if(!isDateExpire){
                buttonDisplay.push(<div key="div-new" className="form-actions col-lg-6">
                            <button key="btn-new" onClick={() => $this.openRegisterModal(this.props.params.roomId,this.props.params.reservedDate,"createNew")} className="btn btn-primary center-block" >New Booking</button>
                            </div>);
                }
            }
            nameInput.push(<label key="label-name" className="control-label col-lg-4" key="name">{this.props.params.name}</label>);
            roomStatusInput.push(<label key="label-roomstatus" className="control-label col-lg-4" key="roomStatus">{roomStatus[this.props.params.roomStatus]}</label>);
            priceInput.push(<label key="label-price" className="control-label col-lg-4" key="price">{this.props.params.price}</label>);
         }else{
            
            nameInput.push(<input type="text" className="form-control" key="name" id="name" name="name" value={this.props.params.name} onChange={this.props.handleOnChange}/>);
            nameInput.push(<span key="span-name" className="help-block"> {this.props.params.formErrors.name} </span>);
            
            
            for(let roomKey=0 ; roomKey<roomStatus.length; roomKey++){
                roomStatusInput.push(<div key={roomKey} className="radio">
                                      <label key="roomKey"> 
                                      <input type="radio" name="roomStatus" key={roomKey} value={roomKey} onChange={this.props.handleOnChange} checked={this.props.params.roomStatus == roomKey}/>
                                        {roomStatus[roomKey]}
                                      </label>
                                      </div>); 
            }
                   
            roomStatusInput.push(<span key="span-roomstatus" className="help-block"> {this.props.params.formErrors.room_status} </span>);     
            
            priceInput.push(<input type="text" pattern="^\d+(.\d{1,2})?" key="price" className="form-control" id="price" name="price" value={this.props.params.price} onChange={this.props.handleOnChange} />);
            priceInput.push(<span key="span-price" className="help-block"> {this.props.params.formErrors.price} </span>);

            if(this.props.params.id != ''){
                buttonDisplay.push(<div key="div-save" className="form-actions col-lg-6">
                                    <button key="btn-save" className="btn btn-primary center-block">Save</button>
                                    </div>);
                buttonDisplay.push(<div key="div-back" className="form-actions col-lg-6">
                <button key="btn-back" onClick={this.props.backClick} className="btn btn-primary center-block" >Back</button>
                </div>);
            }else{
                buttonDisplay =(<div key="div-book" className="form-actions">
                            <button key="btn-book" className="btn btn-primary center-block">Booking</button>
                            </div>);

            }
            

         }

         

        return (
            <form onSubmit={this.props.createSubmit} className="form-horizontal" id="block-validate">
            <div className={(this.props.params.formErrors.hasOwnProperty('name'))? "form-group has-error": "form-group"}>
                <label className="control-label col-lg-4">Customer Name:</label>
                
                <div className="col-lg-4">
                    {nameInput}
                </div>
            </div>
            <div className={(this.props.params.formErrors.hasOwnProperty('room_status'))? "form-group has-error": "form-group"}>
                <label className="control-label col-lg-4">RoomStatus:</label>
                <div className="col-lg-4">
                    {roomStatusInput}
                </div>
            
            </div>
        <div className={(this.props.params.formErrors.hasOwnProperty('price'))? "form-group has-error": "form-group"}>
            <label className="control-label col-lg-4">Price:</label>
            
            <div className="col-lg-4">
                {priceInput}
            </div>
        </div>
        {buttonDisplay}
            </form>     
        )
    }
}
export default Booking;

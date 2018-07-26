import React, { Component } from 'react';
// import LineChart from 'react-linechart';
 import config from '../config';
 import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList } from 'recharts';
import SignOut from "./SignOut";

var signOut;
var $this;
class Dashboard extends Component {
        constructor() {
          super()
          $this = this;
          this.state = {data:[],
                        lastTwoMonth: {'totalamount': 0, 'noofbooking': 0},
                        previousMonth:{'totalamount': 0, 'noofbooking': 0},
                        currentMonth: {'totalamount': 0, 'noofbooking': 0}}
          this.fetchData = this.fetchData.bind(this);
          signOut = new SignOut();
        }

        componentDidMount() {
            this.fetchData();
        //   const boom = () => this.setState({data: [...this.state.data, ["Aug", 10]], download: true, id: "chart-99"})
        //   setTimeout(boom, 1000)
        }
        fetchData(){
            axios.get(config.baseurl+"dashboard")
            .then(response => {
                
                this.setState({ data: response.data.roomBookings});
                this.setState({ lastTwoMonth: response.data.lastTwoMonth[0]});
                this.setState({ previousMonth: response.data.previousMonth[0]});
                this.setState({ currentMonth: response.data.currentMonth[0]});
               
            })
            .catch(function (error) {
                if(error.response.status == 401){
                    signOut.signOut($this);
                }
                
            })
          }
       
   render() {
    
        return (

            <div className="container">
                <div className="box">
                    <div className="col-lg-10">
                        <h3 className="text-primary">Dashboard</h3>
                    </div>
                    <div className="col-lg-11">
                        <div className="text-center">
                            <ul className="stats_box">
                            <li className="last_two_month" key="last_two_price_li">
                                <div className="sparkline fa fa-dollar" key="last_two_price_div"></div>
                                <div className="stat_text" key="last_two_price_div_two">
                                <strong>{this.state.lastTwoMonth.totalamount}</strong>Total Price<br/>
                                <small> Last 2 months</small>
                                </div>
                            </li>
                            <li className="pre_month" key="pre_month_price_li">
                                <div className="sparkline fa fa-dollar" key="pre_month_price_div"></div>
                                <div className="stat_text" key="pre_month_price_div_two">
                                <strong>{this.state.previousMonth.totalamount}</strong>Total Price<br/>
                                <small> Previous month</small>
                                </div>
                            </li>
                            <li className="current_month" key="cur_month_price_li">
                                <div className="sparkline fa fa-dollar" key="cur_month_price_div"></div>
                                <div className="stat_text" key="cur_month_price_div_two">
                                <strong>{this.state.currentMonth.totalamount}</strong>Total Price<br/>
                                <small> Current month</small>
                                </div>
                            </li>
                            </ul>
                        </div>
                        <div className="text-center">
                            <ul className="stats_box" key="book_ul">
                            <li className="last_two_month" key="last_two_book_li">
                                <div className="sparkline fa fa-address-book" key="last_two_book_div"></div>
                                <div className="stat_text" key="last_two_book_div_two">
                                <strong>{this.state.lastTwoMonth.noofbooking}</strong>No of Booking<br/>
                                <small> Last 2 months</small>
                                
                                </div>
                            </li>
                            <li className="pre_month" key="pre_month_book_li">
                                <div className="sparkline fa fa-address-book" key="pre_month_book_div"></div>
                                <div className="stat_text" key="pre_month_book_div_two">
                                <strong>{this.state.previousMonth.noofbooking}</strong>No of Booking<br/>
                                <small> Previous month</small>
                                </div>
                            </li>
                            <li className="current_month" key="cur_month_book_li">
                                <div className="sparkline fa fa-address-book" key="cur_month_book_div"></div>
                                <div className="stat_text" key="cur_month_book_div_two">
                                <strong>{this.state.currentMonth.noofbooking}</strong>No of Booking<br/>
                                <small> Current month</small>
                                </div>
                            </li>
                            </ul>
                        </div>
                    </div>  
                    <div className="row">
                        <div className="col-lg-11">
                            <div className="box">
                            <LineChart width={1000} height={300} data={this.state.data}>
                                <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
                                
                                <XAxis dataKey="rooms">
                                <Label value="Rooms of Hotel" offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis label={{ value: 'Numbers of booking', angle: -90 }}/>
                                <Tooltip />
                            </LineChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Dashboard;
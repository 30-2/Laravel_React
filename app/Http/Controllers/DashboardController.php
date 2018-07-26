<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\HbBooking;
use App\HbRoom;
use Validator;
use Carbon\Carbon;
use Log;
use DB;
use DateTime;
class DashboardController extends Controller
{
    
    public function dashboard(){
        $month= Date('m');
        $year= Date('Y');

        $last_2month = date("m",strtotime("-2 Months"));
        $last_2year = date("Y",strtotime("-2 Months"));
        $last_1month = date("m",strtotime("-1 Months"));
        $last_1year = date("Y",strtotime("-2 Months"));
        $room_booking = DB::table('hb_rooms')
                    ->select('hb_rooms.name AS rooms',DB::raw('COUNT(hb_bookings.id) AS bookings'))
                    ->leftjoin('hb_bookings', function($join) use ($year,$month)
                    {
                        $join->on('hb_bookings.room_id', '=', 'hb_rooms.id')
                        ->whereYear('hb_bookings.reserved_date', '=',$year)
                        ->whereMonth('hb_bookings.reserved_date', '=',$month);
                    })
                    ->groupBy('hb_rooms.name')
                    ->get();

        $currentMonth = DB::table('hb_bookings')
                    ->select(DB::raw('COUNT(hb_bookings.id) AS noofbooking'), DB::raw('COALESCE(SUM(hb_bookings.price),0.00) AS totalamount'))
                    ->whereYear('hb_bookings.reserved_date', '=',$year)
                    ->whereMonth('hb_bookings.reserved_date', '=',$month)
                    ->get();
        $previousMonth= DB::table('hb_bookings')
                    ->select(DB::raw('COUNT(hb_bookings.id) AS noofbooking'), DB::raw('COALESCE(SUM(hb_bookings.price),0.00) AS totalamount'))
                    ->whereYear('hb_bookings.reserved_date', '=',$last_1year)
                    ->whereMonth('hb_bookings.reserved_date', '=',$last_1month)
                    ->get();
        $lastTwoMonth= DB::table('hb_bookings')
                    ->select(DB::raw('COUNT(hb_bookings.id) AS noofbooking'), DB::raw('COALESCE(SUM(hb_bookings.price),0.00) AS totalamount'))
                    ->whereYear('hb_bookings.reserved_date', '=',$last_2year)
                    ->whereMonth('hb_bookings.reserved_date', '=',$last_2month)
                    ->get();
        
        $response = [
            'roomBookings' => $room_booking,
            'lastTwoMonth' => $lastTwoMonth,
            'previousMonth' => $previousMonth,
            'currentMonth' => $currentMonth
        ];
    
        return response()->json($response);
    }
}

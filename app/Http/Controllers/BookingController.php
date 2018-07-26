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
class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->month !='') {
            $request_date = $request->year.'-'. $request->month.'-01';
        }else{
            $month= Date('m');
            $request_date = $request->year.'-'. $month.'-01';
        } 
        //select room with pagination
        $perPages = ($request->perPages!="")? $request->perPages : 5;   
        $rooms = DB::table('hb_rooms')
                ->select('hb_rooms.*','hb_roomtypes.name as roomtype_name')
                ->leftjoin('hb_roomtypes', function($join)
                {
                    $join->on('hb_roomtypes.id', '=', 'hb_rooms.roomtype_id');
                })
                ->latest()->paginate($perPages);

        $end = new Carbon($request_date);
        $enddate = $end->endOfMonth();
        $dd = substr($enddate,8,2);
        
        for($i = 1; $i <=  $dd; $i++)
        {
           $dates[]= str_pad($i, 2, '0', STR_PAD_LEFT);
        }
        $bookings = DB::table('hb_bookings')
                     ->select('hb_bookings.*')
                     ->leftjoin('hb_rooms', function($join)
                        {
                            $join->on('hb_rooms.id', '=', 'hb_bookings.room_id');
                        })
                     ->leftjoin('hb_roomtypes', function($join)
                        {
                            $join->on('hb_roomtypes.id', '=', 'hb_rooms.roomtype_id');
                        })
                     ->leftjoin('hb_users', function($join)
                        {
                            $join->on('hb_users.id', '=', 'hb_bookings.user_id');
                        })
                    ->where('hb_bookings.valid','=', true)
                    ->whereYear('hb_bookings.reserved_date', '=',$request->year)
                    ->whereMonth('hb_bookings.reserved_date', '=',$request->month)
                    ->whereIn('hb_bookings.room_id',$rooms->pluck('id'))
                    ->orderBy('reserved_date','room_id')
                    ->get();
        
        
        $selectRoom=array();
        $roomID = "";
        $reservedDate = "";
               
        foreach($bookings as $room){
                    if($roomID == $room->room_id && $reservedDate ==$room->reserved_date){
                        $selectRoom[ (new DateTime($room->reserved_date))->format('d')."_".$room->room_id]["secondBooking"]= $room;
                    }else{
                       
                        $roomID = $room->room_id;
                        $reservedDate = $room->reserved_date;
                        $selectRoom[ (new DateTime($room->reserved_date))->format('d')."_".$room->room_id]["firstBooking"]= $room;
                    }
                }
        $response = [
            'pagination' => [
                'total' => $rooms->total(),
                'perPage' => $rooms->perPage(),
                'currentPage' => $rooms->currentPage(),
                'lastPage' => $rooms->lastPage(),
                'from' => $rooms->firstItem(),
                'to' => $rooms->lastItem()
            ],
            'dates'  => $dates,
            'bookings' => $selectRoom,
            'rooms' => $rooms
            
        ];
     
        return response()->json($response);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
       $rules = array(
        'name' =>'required',
        'room_status' =>'required',
        'price' =>'required',
        );
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) 
        {
            return response()->json(array('errors' => $validator->messages(), 'result' => false, 'message' => 'validation error'));
        }
        //$currentDateTime = Carbon::now();
        if(!isset($request->id)){
            $booking = new HbBooking([
            'name' => $request->get('name'),
            'room_id' => $request->get('room_id'),
            'user_id' => $request->get('user_id'),
            'reserved_date' =>$request->get('reserved_date'),
            'price' => $request->get('price'),
            'room_status' => $request->get('room_status'),
            ]);
            
        }else{
            $booking = HbBooking::find($request->id);
            $booking->name = $request->get('name');
            $booking->price = $request->get('price');
            $booking->room_status = $request->get('room_status');
        }
        $booking = $booking->save();
        return response()->json($booking);
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $booking = HbBooking::find($id);
        return response()->json($booking);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $booking = HbBooking::find($id);
        $booking->valid =false;
        $booking = $booking->save();
        return response()->json($booking);
    }
}

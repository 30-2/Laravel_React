<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\HbRooms;
use App\HbRoomtype;
use App\HbBooking;
use Validator;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $roomtypes = HbRoomtype::all();
        // $room = DB::table('hb_rooms');
        $room = DB::table('hb_rooms')
                ->select('hb_rooms.*','hb_roomtypes.name as roomtype_name','hb_bookings.room_id as booking_id')
                ->leftJoin('hb_roomtypes', 'hb_rooms.roomtype_id', '=', 'hb_roomtypes.id')
                ->leftJoin('hb_bookings', 'hb_rooms.id', '=', 'hb_bookings.room_id')
                ->distinct('hb_rooms.id');
        
        if($request->name!=""){
           $room->where('hb_rooms.roomno', 'like', '%'.$request->name.'%')
                ->orWhere('hb_rooms.name','like','%'.$request->name.'%')
                ->orWhere('hb_roomtypes.name','like','%'.$request->name.'%');
        }
        $perPages = ($request->perPages!="")? $request->perPages : 5;   
        $room = $room->latest()->paginate($perPages,['hb_rooms.id']);
        $response = [
                        'pagination' => [
                            'total' => $room->total(),
                            'perPage' => $room->perPage(),
                            'currentPage' => $room->currentPage(),
                            'lastPage' => $room->lastPage(),
                            'from' => $room->firstItem(),
                            'to' => $room->lastItem()
                        ],
                        'room' => $room,
                        'roomtypes' => $roomtypes
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
            'roomno' => 'required',
            'roomtype' => 'required'
        );
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) 
        {
            return response()->json(array('errors' => $validator->messages(), 'result' => false, 'message' => 'validation error'));
        }
        
        if($request['id']){
            $room = HbRooms::find($request['id']);
        }else{
            $room = new HbRooms();
        }
        
        $room->name = $request->get('name');
        $room->roomno = $request->get('roomno');
        $room->roomtype_id = $request->get('roomtype');

            $room = $room->save();
            return response()->json($room);
            
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // var_dump($id);exit;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $room = HbRooms::find($id);
        return response()->json($room);
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
        // $room = HbRooms::find($id);
        // $room->name = $request->get('name');
        // $room->roomno = $request->get('roomno');
        // $room->roomtype_id = $request->get('roomtype_id');
        // $room->save();

        // return response()->json($room);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $room = HbRooms::find($id);
        $room->delete();
        return response()->json('Successfully Deleted');
    }
}

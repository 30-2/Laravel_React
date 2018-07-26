<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\HbRoomtype;
use App\HbRooms;
use Validator;
use Log;
use DB;
class RoomTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $roomtypes = DB::table('hb_roomtypes');

        
        $perPages = ($request->perPages!="")? $request->perPages : 5;   
       
        $roomtypes = DB::table('hb_roomtypes')
            ->select('hb_rooms.roomtype_id', 'hb_roomtypes.*')
            ->leftjoin('hb_rooms', 'hb_rooms.roomtype_id', '=', 'hb_roomtypes.id')
            ->distinct('hb_roomtypes.id');

        if($request->name!=""){
           $roomtypes->where('hb_roomtypes.name', 'like', '%'.$request->name.'%');
        }
         $roomtypes = $roomtypes->latest()->paginate($perPages,['hb_roomtypes.id']);
        $response = [
                        'pagination' => [
                            'total' => $roomtypes->total(),
                            'perPage' => $roomtypes->perPage(),
                            'currentPage' => $roomtypes->currentPage(),
                            'lastPage' => $roomtypes->lastPage(),
                            'from' => $roomtypes->firstItem(),
                            'to' => $roomtypes->lastItem()
                        ],
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
    //    dd($request['id']);exit;
        $rules = array(
            'name' =>'required',
        );
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) 
        {
            return response()->json(array('errors' => $validator->messages(), 'result' => false, 'message' => 'validation error'));
        }

        if($request['id']){
            $roomType = HbRoomtype::find($request['id']);
            $roomType->name = $request->get('name');
        }else{
            $roomType = new HbRoomtype([
           'name' => $request->get('name'),
         ]);
        }         
         $roomtype = $roomType->save();
         return response()->json($roomtype);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // dd($id);exit;
        $roomtypes = HbRoomtype::find($id);
        return response()->json($roomtypes);
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
        // dd($id);exit;
        $roomtypes = HbRoomtype::find($id)->delete();
        return response()->json($roomtypes);
    }
}


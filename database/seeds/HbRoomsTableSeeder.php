<?php

use Illuminate\Database\Seeder;
use App\HbRoom;

class HbRoomsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $hb_roomtypes = DB::table('hb_roomtypes')->get();
        foreach( $hb_roomtypes as  $hb_roomtype){
            HbRoom::create(array(
                'name' => str_random(10),
                'roomno' => '1',
                'roomtype_id' => $hb_roomtype->id
            ));
        }
        
    }
}

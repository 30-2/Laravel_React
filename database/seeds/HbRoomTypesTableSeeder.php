<?php

use Illuminate\Database\Seeder;

class HbRoomTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('hb_roomtypes')->insert([
            'name' => str_random(10),
        ]);
        //factory(App\HbRoomtype::class, 5)->create();
    }
}

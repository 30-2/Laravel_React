<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(HbRoomTypesTableSeeder::class);
        $this->call(HbRoomsTableSeeder::class);
        $this->call(HbUsersTableSeeder::class);
    }
}

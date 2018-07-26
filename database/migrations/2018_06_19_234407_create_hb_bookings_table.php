<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHbBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hb_bookings', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->unsignedInteger('room_id');
            $table->foreign('room_id')->references('id')->on('hb_rooms');
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('hb_users');
            $table->dateTime('reserved_date');
            $table->decimal('price',8,2);
            $table->tinyInteger('room_status')->comment("0 :check_in ,1:stay, 2:check_out");
            $table->boolean('valid') ->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hb_bookings');        
    }
}

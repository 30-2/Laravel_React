<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HbBooking extends Model
{
    // protected $casts = [
	// 	'id' => 'int',
	// 	'name' => 'string',
	// 	'room_id' => 'int',
	// 	'user_id' => 'int',
	// 	'reserved_date' => 'datetime',
    //     'price' => 'int',
    //     'room_status'=> 'int',
	// ];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','room_id','user_id','reserved_date','price','room_status'
    ];
}

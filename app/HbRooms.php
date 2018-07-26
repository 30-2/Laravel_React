<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HbRooms extends Model
{
    protected $fillable = [
        'name','roomno','roomtype_id'
    ];

    // public function HbRoomtype() {
    // 	return $this->belongsTo(HbRoomtype::class);
    // }
}

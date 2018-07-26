<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });


//Route::post('register', 'UserController@register');
 Route::post('signin', 'Auth\LoginController@signin');

 Route::group(['middleware' => 'jwt.auth'], function() {

    Route::resource('roomtypes', 'RoomTypeController');

    Route::resource('users', 'UserController');

    Route::resource('room', 'RoomController');

    Route::resource('bookings', 'BookingController');

    Route::get('user/checktoken', 'UserController@details');
    Route::get('refresh', 'Auth\LoginController@refresh');
    Route::get('dashboard', 'DashboardController@dashboard');
});




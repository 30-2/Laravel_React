<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/booking', function () {
    return view('welcome');
});
Route::get('/roomtype', function () {
    return view('welcome');
});
Route::get('/', function () {
    return view('welcome');
});
Route::get('/login', function () {
    return view('login');
});
Route::get('/user', function() {
    return view('welcome');
});
Route::get('/Room', function () {
    return view('welcome');
});
Route::get('/signin', function(){
    return view('welcome');
});
Route::get('/dashboard', function(){
    return view('welcome');
});
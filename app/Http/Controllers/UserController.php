<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\HbUser;
use DB;
use Log;
use Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = DB::table('hb_users');

        if($request->name != ""){
            $users->where('name', 'like', '%'.$request->name.'%');
        }
        $perPages = ($request->perPages != "")? $request->perPages : 5;
        $users = $users->latest()->paginate($perPages);
        $response = [
                'pagination' => [
                    'total' => $users->total(),
                    'perPage' => $users->perPage(),
                    'currentPage' => $users->currentPage(),
                    'lastPage' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem()
                ],
                'users' => $users
            ];
        return response()->json($response);
    }

    public function create()
    {
        
    }

    public function store(Request $request)
    {
        if($request->get('mode') == 'edit') {
            $user = HbUser::find($request->get('id'));
            if($user->email == $request->get('email')) {
                $rules = array(
                    'name' => 'required',
                    'username' => 'required',
                    'email' => 'required|email',
                );
            }
            else {
                $rules = array(
                    'name' => 'required',
                    'username' => 'required',
                    'email' => 'required|email|unique:hb_users',
                );
            }
    
        }
        else {
            $rules = array(
                'name' => 'required',
                'username' => 'required',
                'password' => 'required',
                'email' => 'required|email|unique:hb_users'
            );
        }
        $validator = Validator::make($request->all(), $rules);

        if($validator->fails()) {
            return response()->json(array('errors' => $validator->messages(), 'result' => false, 'message' => 'validation error'));
        }

        if($request->get('id') == '') {
            $user = new HbUser([
                'name' => $request->get('name'),
                'username' => $request->get('username'),
                'password' => bcrypt($request->get('password')),
                'email'=> $request->get('email')
            ]);
        }
        else {
            $user = HbUser::find($request->get('id'));
            $user->name = $request->get('name');
            $user->username = $request->get('username');
            if($request->get('password') != '') {
                $user->password = bcrypt($request->get('password'));
            }
            $user->email = $request->get('email');
        }

        $user->save();
        return response()->json($user);
        
    }

    public function show($id)
    {

    }

    public function edit($id)
    {
        $user = HbUser::find($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {

    }

    public function destroy($id)
    {
        DB::table('hb_users')->delete($id);
        
        return response()->json('Successfully Deleted');
    }

    /**
     * Returns Authenticated User Details
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function details()
    {
        return response()->json(['user' => auth()->user()], 200);
    }
}

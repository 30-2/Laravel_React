<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use App\HbUser;
use DB;
use Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use JWTAuth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    /**
     * Handles Login Request
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function signin(Request $request)
    {
        $credentials = [
            'email' => $request->email,
            'password' => $request->password
        ];
        $rules = array(
            'email' =>'required|email|exists:hb_users',
            'password' =>'required',
            );
            $validator = Validator::make($request->all(), $rules);
    
            if ($validator->fails()) 
            {
                return response()->json(array('errors' => $validator->messages(), 'result' => false, 'message' => 'validation error'));
            }    
            try {
                if (! $token = JWTAuth::attempt(['email' => $request->email, 'password' => $request->password])) {
                    return response()->json(['error' => 'invalid_credentials','errorMsg' => 'EmailAddress and password do not match.'], 200);
                }
            } catch (JWTException $e) {
                return response()->json(['error' => 'could_not_create_token'], 500);
            }
            $userId = $request->user()->id;
            $userName = $request->user()->name;
            
            return response()->json(['token' => $token,'userID' => $userId,'userName' =>$userName,'userEmail'=>$request->user()->email]);
    }
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        $token = JWTAuth::getToken();
        try {
            $token = JWTAuth::refresh($token);
        } catch (JWTException $e) {
            Log::Debug($e);
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        return response()->json(compact('token'));
    }
}

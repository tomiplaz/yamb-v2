<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;

use App\User;

use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request) {
        return User::create($request->input());
    }

    public function login(LoginRequest $request)
    {
        // User's credentials
        $credentials = $request->only('email', 'password');

        try {
            // Verify user's credentials and create token if credentials are valid
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        $user = User::where('email', $request->get('email'))->first();

        return response()->json(compact('token', 'user'));
    }
}

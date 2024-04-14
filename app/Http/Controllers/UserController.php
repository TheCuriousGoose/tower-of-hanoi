<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function create(Request $request){
        if(!$request->has('name')){
            return response()->json(['message' => 'Something went wrong'], 500);
        }

        $user = User::create([
            'name' => $request->name
        ]);

        return response()->json($user);
    }
}

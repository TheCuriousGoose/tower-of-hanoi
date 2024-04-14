<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function create(Request $request){
        if(!$request->has('user_id')){
            return response()->json(['message' => 'Invalid parameters']);
        }

        if(!$request->has('moved_blocks')){
            return response()->json(['message' => 'Invalid parameters']);
        }

        if(!$request->has('time_taken')){
            return response()->json(['message' => 'Invalid parameters']);
        }

        $score = Score::create([
            'user_id' => $request->user_id,
            'moved_blocks' => $request->moved_blocks,
            'time_taken' => $request->time_taken
        ]);

        return response()->json($score);
    }
}

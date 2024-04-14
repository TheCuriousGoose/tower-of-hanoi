@extends('layouts.app')

@section('content')
    <meta name="create-player" content="{{ route('api.users.create') }}">
    <meta name="create-score" content="{{ route('api.scores.create') }}">
    <div id="start-game-overlay" class="overlay">
        <div class="card">
            <div class="card-header">
                <h2>Tower of Hanoi</h2>
            </div>
            <div class="card-body">
                <label for="name">Please enter your name</label>
                <input id="name" type="text" class="form-control mb-2">
                <button type="button" id="start-game" class="btn">
                    Start game
                </button>
            </div>
        </div>
    </div>
    <div id="end-game-overlay" class="overlay">
        <div class="card">
            <div class="card-header">
                <h2>Tower of Hanoi</h2>
            </div>
            <div class="card-body">
                <p>Congratulations! You've finished the puzzle in <span id="end_moves"></span> moves. You took <span id="amount_of_time"></span></p>
                <button type="button" class="btn mb-2" id="restart">
                    restart
                </button>
            </div>
        </div>
    </div>
    <div id="timer">
        <p>Time played</p>
        <span id="time-played">-</span>
        <p>Moved done</p>
        <span id="moves">-</span>
    </div>
    <div id="player-name">

    </div>
    <div id="hold-moving-block">

    </div>
    <div id="game-container">
        <section id="tower-1">
            <div class="pieces-container" data-tower-id="0">

            </div>
            <div class="base">

            </div>
        </section>
        <section id="tower-2">
            <div class="pieces-container" data-tower-id="1">

            </div>
            <div class="base">

            </div>
        </section>
        <section id="tower-3">
            <div class="pieces-container" data-tower-id="2">

            </div>
            <div class="base">

            </div>
        </section>
    </div>
@endsection

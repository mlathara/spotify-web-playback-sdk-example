import React, { useState, useEffect } from 'react';

const lut = {
    "L": {name: "Sua Cara", uri: "spotify:track:5D2m0GT5EDngcqD7YdkF7w", seek: 40000},
    "9": {name: "Right Foot Creep", uri: "spotify:track:2wzKkQm5nYxrK2pJpZVjJW", seek: 73000},
    "10": {name: "Back In Black", uri: "spotify:track:08mG3Y1vljYA6bvDt4Wqkj", seek: 5000},
    "8": {name: "Can't Stop The Feeling", uri: "spotify:track:6JV2JOEocMgcZxYSZelKcc", seek: 24000},
    "11": {name: "Dance The Night Away", uri: "spotify:track:2YXGbxICUdOUJe9OPlicy1", seek: 40000},
    "2": {name: "Don't Worry Be Happy", uri: "spotify:track:4hObp5bmIJ3PP3cKA9K9GY", seek: 29000},
    "V": {name: "Heaven Is A Place On Earth", uri: "spotify:track:58mFu3oIpBa0HLNeJIxsw3", seek: 69000},
    "6": {name: "Take Over", uri: "spotify:track:5fzg2Cix9vHL4YpI0XcrR9", seek: 65000},
    "S": {name: "Intergalactic", uri: "spotify:track:5fpizYGbi5IQoEraj6FP0R", seek: 29000},
    "3": {name: "Balam Pichkari", uri: "spotify:track:18e3XXYCv4Tx8uUl1mP3CN", seek: 72000}
}

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback(props) {

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);

    async function setSong(song) {
      const response = await fetch(
        'https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.token
            },
            body: JSON.stringify({
                'uris': [song.uri],
                'position_ms': song.seek
            })
        });
      //const json = await response.json();
      return response;
    }

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();

        };
    }, []);

    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className="btn-spotify" onClick={() => { 
                                setSong(lut["L"])
                                }} >
                                {"L - LUCAS BEAUCHAMP"}
                            </button>
                            <button className="btn-spotify" onClick={() => { 
                                setSong(lut["9"])
                                }} >
                                {"9 - JOEY BOH-KITCH"}
                            </button>
                            <button className="btn-spotify" onClick={() => { 
                                setSong(lut["10"])
                                }} >
                                {"10 - ETTA LAY-MUHN GARD-EE-NO"}
                            </button>
                            <button className="btn-spotify" onClick={() => {
                                setSong(lut["3"])
                                }} >
                                {"3 - EL LAH-TH-RAH"}
                            </button>
                            <button className="btn-spotify" onClick={() => {
                                setSong(lut["8"])
                                }} >
                                {"8 - DAY-AH THOMPSON"}
                            </button>
                            <button className="btn-spotify" onClick={() => {
                                setSong(lut["11"])
                                }} >
                                {"11 - UH-LEE-RA BELLING"}
                            </button>
                            <button className="btn-spotify" onClick={() => {
                                setSong(lut["2"])
                                }} >
                                {"2 - EYE-LA CHANDLER"}
                            </button>
                            <button className="btn-spotify" onClick={() => {
                                setSong(lut["V"])
                                }} >
                                {"V - VIVIAN LJUNGQUIST"}
                            </button>
                            <button className="btn-spotify" onClick={() => {
                                setSong(lut["6"])
                                }} >
                                {"6 - WALTER JAH-LEE"}
                            </button>
                            <button className="btn-spotify" onClick={() => {
                                setSong(lut["S"])
                                }} >
                                {"S - SYLVAN FRIEDLAND"}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback

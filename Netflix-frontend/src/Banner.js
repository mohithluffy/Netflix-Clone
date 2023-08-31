import React, { useEffect, useState } from 'react';
import './Banner.css';
import axios from './axios';
import requests from './Requests';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';

function Banner() {
    const navigate = useNavigate();
    const [movie, setMovie] = useState([]);
    const [showVideo, setShowVideo] = useState(false);
    const [videoId, setVideoId] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(requests.fetchNetflixOriginals);
            setMovie(
                request.data.results[
                    Math.floor(Math.random() * request.data.results.length - 1)
                ]
            );
            return request;
        }
        fetchData();
    }, []);

    const handlePlayClick = async () => {
        if (showVideo) {
            // If video is playing, pause and hide
            setShowVideo(false);
        } else {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
                        `${movie.title || movie.name || movie.original_name} official trailer`
                    )}&key={API_KEY}&type=video`
                );
                if (response.data.items.length > 0) {
                    const firstVideo = response.data.items[0];
                    setVideoId(firstVideo.id.videoId);
                    setShowVideo(true);
                } else {
                    console.log('No video found for the given query');
                }
            } catch (error) {
                console.log('Error fetching video:', error);
            }
        }
    };

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <header
            className="banner"
            style={{
                backgroundSize: 'cover',
                backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
                backgroundPosition: 'center center',
            }}
        >
            <div className="banner__contents">
                <h1 className="banner__title">
                    {movie?.title || movie?.name || movie?.original_name}
                </h1>
                <div className="banner__buttons">
                    <button className="banner__button" onClick={handlePlayClick}>
                        {showVideo ? 'Pause' : 'Play'}
                    </button>
                    <button className="banner__button" onClick={()=> navigate("/liked")}>
                        My List
                    </button>
                </div>
                <h1 className="banner__description">
                    {movie?.overview}
                </h1>
            </div>
            <div className="banner--fadeBottom" />

            {showVideo && (
                <div className="banner__video">
                    <YouTube videoId={videoId} opts={opts} />
                </div>
            )}
        </header>
    );
}

export default Banner;

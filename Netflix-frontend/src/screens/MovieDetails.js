import React, { useEffect, useState } from 'react';
import './MovieDetails.css'; // Import your custom CSS for styling
import axios from '../axios';
import { useParams } from 'react-router-dom';
import Nav from '../Nav';
import YouTube from 'react-youtube';

const base_url = 'https://image.tmdb.org/t/p/original';

export default function MovieDetails() {
    const {movieId} = useParams();
    const [movieDetails, setMovieDetails] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const [videoId, setVideoId] = useState(null);

    useEffect(() => {
        async function fetchMovieDetails() {
            const request = await axios.get(`/movie/${movieId}?api_key={API_KEY}&language=en-US`);
            setMovieDetails(request.data);
        }
        fetchMovieDetails();
    }, [movieId]);

    if (!movieDetails) {
        return null;
    }
    console.log(movieDetails);

    const handlePlayClick = async () => {
        if (showVideo) {
            // If video is playing, pause and hide
            setShowVideo(false);
        } else {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
                        `${movieDetails.title || movieDetails.name || movieDetails.original_name} official trailer`
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
            className="movieDetails"
            style={{
                backgroundSize: 'cover',
                backgroundImage: `url("https://image.tmdb.org/t/p/original/${movieDetails?.poster_path}")`,
                backgroundPosition: 'center center',
            }}
        >
            <Nav/>
            <div className="movieDetails__contents">
                <h1 className="movieDetails__title">
                    {movieDetails?.title || movieDetails?.name || movieDetails?.original_name}
                </h1>
                <div className="movieDetails__tagline">
                    {movieDetails?.tagline}
                </div>
                <div className="movieDetails__buttons">
                    <button className="movieDetails__button" onClick={handlePlayClick}>
                        {showVideo ? 'Pause' : 'Play'}
                    </button>
                    
                </div>
                
            </div>
            <div className="movieDetails--fadeBottom" />
            <div className="movieDetails__description">
                    <h2>Movie Description:</h2> 
                    <h3>{movieDetails?.overview}</h3>
                    <h4>IMDB Rating: {movieDetails?.vote_average}</h4>
            </div>

            {showVideo && (
                <div className="movieDetails__video">
                    <YouTube videoId={videoId} opts={opts} />
                </div>
            )}
        </header>
    );
}

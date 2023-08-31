import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { selectUser } from '../features/counter/userSlice';
import { useSelector } from 'react-redux';
import Nav from '../Nav';
import './Likedscreen.css'
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaCheck, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const base_url = "https://image.tmdb.org/t/p/original";
// Define your component
function Likedscreen() {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const emailid = user.email;
    const [likedMovies, setLikedMovies] = useState([]);

    useEffect(() => {
        fetchLikedMovies();
    }, []);

    const fetchLikedMovies = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/liked/${emailid}`);
            if (response.data.msg === 'success') {
                setLikedMovies(response.data.movies);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleMovieClick = (movieId)=>{
        navigate(`/movie/${movieId}`);
    };
    const deleteFromLiked = async (movieId) => {
        try {
            const response = await axios.put("http://localhost:5000/api/user/remove", {
                email: emailid, // Replace with the actual email
                movieId: movieId
            });

            if (response.data.msg === 'Movie successfully removed.') {
                setLikedMovies(response.data.movies);
            }else{
                console.log(response.data.msg);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="likedscreen">
            <Nav/>
            <h2 className='heading'>Liked Movies</h2>
            <div className="row__posters">
                {likedMovies.map((movie, index) => (
                        <div className="movie-card" key={movie.id}>
                            <img
                                className="row__poster"
                                src={`${base_url}${movie.backdrop_path}`}
                                alt={movie.name}
                            />
                            <div className="movie-card-overlay">
                                <h3 className="movie-card-title">{movie.title || movie.name}</h3>
                                <div className="movie-card-icons">
                                    <FaPlay className="icon play-icon" onClick={() => handleMovieClick(movie.id)} />
                                    <FaThumbsUp className="icon" />
                                    <FaThumbsDown className="icon" />
                                    <FaCheck className="icon" onClick={() => deleteFromLiked(index)} />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            
        </div>
    );
}

export default Likedscreen;

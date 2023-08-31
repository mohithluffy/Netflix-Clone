import React, { useEffect, useState } from 'react';
import './Row.css';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import { selectUser } from './features/counter/userSlice';
import { useSelector } from 'react-redux';
import { FaPlay, FaPlus, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const base_url = "https://image.tmdb.org/t/p/original";

export default function Row({ title, fetchUrl, isLargeRow = false }) {

    const [movies, setMovies] = useState([]);
    const user = useSelector(selectUser);
    const emailid = user.email;
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();

    }, [fetchUrl]);

    const handleMovieClick = (movieId)=>{
        navigate(`/movie/${movieId}`);
    };
    const handleAddToLiked = async (movieData)=>{
        console.log(emailid, movieData);
        try{
            await axios.post("http://localhost:5000/api/user/add", {
                email: emailid,
                data: movieData
            });
        }catch(error){
            console.log(error);
        }
    };

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
                {movies.map((movie) => (
                    ((isLargeRow && movie.poster_path) ||
                        (!isLargeRow && movie.backdrop_path)) && (
                        <div className="movie-card" key={movie.id}>
                            <img
                                className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
                                src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                                alt={movie.name}
                            />
                            <div className="movie-card-overlay">
                                <h3 className="movie-card-title">{movie.title || movie.name}</h3>
                                <div className="movie-card-icons">
                                    <FaPlay className="icon play-icon" onClick={() => handleMovieClick(movie.id)} />
                                    <FaThumbsUp className="icon" />
                                    <FaThumbsDown className="icon" />
                                    <FaPlus className="icon" onClick={() => handleAddToLiked(movie)} />
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}
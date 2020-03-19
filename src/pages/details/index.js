import React, { Component } from 'react';
import { FaRegMoneyBillAlt, FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import Moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import Galery from '../../components/Galery';
import api from '../../services/api';

import './styles.css';

export default class details extends Component {
  
  state = {
    movie: [],
    genres: [],
    recommendations: [],
    listGenres: [],
    backdrops: [],
    credits: []
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.loadMovie(id);
    this.listGenres();
  }

  //carrega a lista de generos
  listGenres = async () => {
    const response = await api.get(`/genre/movie/list?api_key=3a67ead232de4194120586c937d412a8`);
    this.setState({ listGenres: response.data.genres });
  }

  //carrega os generos dos filmes que estao em tela
  loadGenre = (params) => {
    const x = [];
    params.map(movieGenres => {
      this.state.listGenres.find(genre => {
        if (genre.id === movieGenres) {
          //console.log(genre.name);
          x.push(' ' + genre.name);
        }
        return 0;
      });
      return 0;
    });
    return x;
  };

  loadMovie = async (id) => {
    const response = await api.get(`movie/${id}?api_key=3a67ead232de4194120586c937d412a8`);
    this.setState({
      movie: response.data,
      genres: response.data.genres
    });
    this.loadCredits(id);
    this.loadImages(id);
    this.loadRecommendations(id);
  };

  loadCredits = async (id) => {
    const response = await api.get(`movie/${id}/credits?api_key=3a67ead232de4194120586c937d412a8`);
    this.setState({ credits: response.data.cast});
  };

  loadImages = async (id) => {
    const response = await api.get(`movie/${id}/images?api_key=3a67ead232de4194120586c937d412a8`);
    this.setState({ backdrops: response.data.backdrops});
  };

  loadRecommendations = async (id) => {
    const response = await api.get(`movie/${id}/recommendations?api_key=3a67ead232de4194120586c937d412a8&page=1`);
    const { results } = response.data;
    this.setState({ recommendations: results });
  };

  render() {
    const { movie, genres, recommendations, backdrops, credits } = this.state;

    //criando um array de link com as imagens para a galeria
    const images = [];
    const background = [];
    backdrops.map(backdrop => {
      const image = 'https://image.tmdb.org/t/p/original'+backdrop.file_path;
      images.push({original: image, thumbnail: image});
      background.push('https://image.tmdb.org/t/p/original'+backdrop.file_path);
      return 0;
    });

    //configuração do background
    var styless = {
      backgroundImage: 'url('+ background[Math.floor(Math.random() * background.length)] +')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center'
    };

    return (
      <div id="details">
        <div id="details-content" style={styless}>
          <div id="aboutMovie">
            <p id="rate">{movie.vote_average}</p>
            <div id="movieInfo">
              <h1>{movie.title}</h1>
              <p>{movie.overview}</p>

              <div id="genresInfo">
                Genres:
                {genres.map(genre => (
                <p key={genre.id}>{genre.name}</p>
              ))}
              </div>
              <div id="moreInfo">
                <p><FaRegClock className="iconMore" /> {movie.runtime}min</p>
                <p><FaRegCalendarAlt className="iconMore" /> {Moment(movie.release_date).format('DD/MM/Y')}</p>
                <p><FaRegMoneyBillAlt className="iconMore" /><CurrencyFormat value={movie.budget} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <span>{value}</span>} /></p>
              </div>

            </div>
            <img alt={movie.title} src={(movie.poster_path ? "https://image.tmdb.org/t/p/w300" + movie.poster_path : 'https://via.placeholder.com/300x450')} />
          </div>
          
          <div id="credits">
            <div id="creditsContent">
              <h2>Actors</h2>
              {credits.map(person => (
                <div key={person.credit_id} className="actor">
                  <img alt={person.name} src={(person.profile_path ? "https://image.tmdb.org/t/p/w300" + person.profile_path : 'https://via.placeholder.com/300x450')} />
                  <div className="actorInfo">
                    <p>{person.name}</p>
                    <p>{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="galery">
            <div id="galeryContent">
              <h2>Galery</h2>
              <Galery backdrops={images}/>
            </div>
          </div>

          <div id="recomendation">
            <h2>Recommendations</h2>
            {recommendations.map(recommendation => (
              <span onClick={this.loadMovie.bind(null, recommendation.id)} className="movie" key={recommendation.id}>
                <img alt={recommendation.original_title} src={(recommendation.poster_path ? "https://image.tmdb.org/t/p/w300" + recommendation.poster_path : 'https://via.placeholder.com/300x450')} />
                <p id="rate">{recommendation.vote_average}</p>
                <div className="movie-content">
                  <h3>{recommendation.original_title}</h3>
                  <div className="line"></div>
                  <div className="genres">
                    {this.loadGenre(recommendation.genre_ids).map(genre => (
                      <p key={Math.floor(Math.random() * 10000)}>{genre}.</p>
                    ))}
                  </div>

                </div>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
};
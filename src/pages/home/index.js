import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaSearch} from "react-icons/fa";
import api from '../../services/api';

import './styles.css';

export default class home extends Component {

  state = {
    movies: [],
    genres: [],
    titlePage: '',
    menuActive: 1,
    infopage: {},
    page: 1,
    pagPagination: []
  }

  componentDidMount() {
    this.listGenre();
    this.loadMovies();
  }

  //carrega os generos dos filmes que estao em tela
  loadGenre = (params) => {
    const x = [];
    params.map(movieGenres => {
      this.state.genres.find(genre => {
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
  
  //carrega a lista de generos
  listGenre = async () => {
    const response = await api.get(`/genre/movie/list?api_key=3a67ead232de4194120586c937d412a8`);
    this.setState({ genres: response.data.genres });
  }

  //popular
  loadMovies = async (page = 1) => {
    const response = await api.get(`/discover/movie?api_key=3a67ead232de4194120586c937d412a8&page=${page}`);
    //pega o docs e armazena o resto em productInfo
    const { results, ...infopage } = response.data;
    //setando os dados em docs e o resto das informações em productInfo
    this.setState({ 
      movies: results, 
      page,
      infopage, 
      titlePage: 'Populares',
      menuActive: 1
    });
    this.loadPagination(page);
  };

  //Now Playing
  nowPlaying = async (page = 1) => {
    const response = await api.get(`/movie/now_playing?api_key=3a67ead232de4194120586c937d412a8&page=${page}`);
    //pega o docs e armazena o resto em productInfo
    const { results, ...infopage } = response.data;
    //setando os dados em docs e o resto das informações em productInfo
    this.setState({
      movies: results,
      page,
      infopage, 
      titlePage: 'Em Cartaz',
      menuActive: 2
    });
    this.loadPagination(page);
  };

  //top_rated
  topRated = async (page = 1) => {
    const response = await api.get(`/movie/top_rated?api_key=3a67ead232de4194120586c937d412a8&page=${page}`);

    //pega o docs e armazena o resto em productInfo
    const { results, ...infopage } = response.data;

    //setando os dados em docs e o resto das informações em productInfo
    this.setState({
      movies: results,
      page,
      infopage,
      titlePage: 'Melhores Avaliações',
      menuActive: 3
    });
    this.loadPagination(page);
  };

  //upcoming
  upcoming = async (page = 1) => {
    const response = await api.get(`/movie/upcoming?api_key=3a67ead232de4194120586c937d412a8&page=${page}`);

    //pega o docs e armazena o resto em productInfo
    const { results, ...infopage } = response.data;

    //setando os dados em docs e o resto das informações em productInfo
    this.setState({
      movies: results,
      page,
      infopage,
      titlePage: 'Em Breve',
      menuActive: 4
    });
    this.loadPagination(page);
  };

  loadPagination = (page) => {
    var pagPagination = [];
    var { total_pages } = this.state.infopage;

    if(page <= 3){
      pagPagination = [1,2,3,4,5];
    }else if(page >= total_pages-2){
      pagPagination = [
        total_pages-4, 
        total_pages-3, 
        total_pages-2, 
        total_pages-1, 
        total_pages
      ];
    }else{
      pagPagination = [
        page-2,
        page-1,
        page,
        page+1,
        page+2
      ];
    }
    this.setState({
      pagPagination,
    });
  }

  prevPage = () => {
    const { page, infopage, menuActive} = this.state;
  
    //caso esteja na ultima pagina, return
    if(page === infopage.total_pages) return;

    //caso a pag atual nao seja a ultima passa ela +1
    const pageNumber = page - 1;
    if(menuActive === 1){
      this.loadMovies(pageNumber);
    }else if(menuActive === 2){
      this.nowPlaying(pageNumber);
    }else if(menuActive === 3){
      this.topRated(pageNumber);
    }else if(menuActive === 4){
      this.upcoming(pageNumber);
    }
  }

  nextPage = () => {
    const { page, infopage, menuActive} = this.state;
    
    //caso esteja na ultima pagina, return
    if(page === infopage.total_pages) return;
    
    //caso a pag atual nao seja a ultima passa ela +1
    const pageNumber = page + 1;
    if(menuActive === 1){
      this.loadMovies(pageNumber);
    }else if(menuActive === 2){
      this.nowPlaying(pageNumber);
    }else if(menuActive === 3){
      this.topRated(pageNumber);
    }else if(menuActive === 4){
      this.upcoming(pageNumber);
    }
  }

  search = async (page) => {
    const search = document.getElementById('search').value;
    const response = await api.get(`/search/movie?api_key=3a67ead232de4194120586c937d412a8&query=${search}&page=${page}`);

    //pega o docs e armazena o resto em productInfo
    const { results, ...infopage } = response.data;
    const titlePage = `Pesquisa por "${search}"`;
    //setando os dados em docs e o resto das informações em productInfo
    this.setState({
      movies: results,
      page,
      infopage,
      titlePage,
      menuActive: 0
    });
    this.loadPagination(page);
  }

  render() {
    const { movies, titlePage, menuActive, page, infopage, pagPagination} = this.state;
    var load;
    if(menuActive === 1){
      load = this.loadMovies;
    }else if(menuActive === 2){
      load = this.nowPlaying;
    }else if(menuActive === 3){
      load = this.topRated;
    }else if(menuActive === 4){
      load = this.upcoming;
    }else {
      load = this.search;
    }
    return (
      <div id="home">
        
        <h1>{titlePage}</h1>

        <div className={(this.state.menuActive === 0 ? 'hide buttonGroup' : 'buttonGroup')}>
          <button className={(this.state.menuActive === 1 ? 'active' : '')} disabled={menuActive === 1} onClick={this.loadMovies.bind(null, 1)}>Populares</button>
          <button className={(this.state.menuActive === 2 ? 'active' : '')} disabled={menuActive === 2} onClick={this.nowPlaying.bind(null, 1)}>Em Cartaz</button>
          <button className={(this.state.menuActive === 3 ? 'active' : '')} disabled={menuActive === 3} onClick={this.topRated.bind(null, 1)}>Melhores Avaliações</button>
          <button className={(this.state.menuActive === 4 ? 'active' : '')} disabled={menuActive === 4} onClick={this.upcoming.bind(null, 1)}>Em Breve</button>
        </div>

        <div className="site-search">
          <input onChange={this.search.bind(null, 1)} type="text" id="search" placeholder="Pesquisar" className="search-input" aria-label="Search" />
          <button className="search-btn" aria-label="Search"><FaSearch /></button>
        </div>

        <div className="home-content">
          {movies.map(movie => (
            <Link to={`/about/${movie.id}`} className="movie" key={movie.id}>
              <img alt={movie.original_title} src={(movie.poster_path ? "https://image.tmdb.org/t/p/w300" + movie.poster_path : 'https://via.placeholder.com/300x450')} />
              <p id="rate">{movie.vote_average}</p>
              <div className="movie-content">
                <h3>{movie.original_title}</h3>
                <div className="line"></div>
                <div className="genres">
                  {this.loadGenre(movie.genre_ids).map(genre => (
                    <p key={Math.floor(Math.random() * 10000)}>{genre}.</p>
                  ))}
                </div>

              </div>
            </Link>
          ))}

          <div className={(movies.length === 0 ? "hide" : '') + "pagination"}>
              <button onClick={this.prevPage} disabled={page === 1}><FaArrowLeft /></button>
              <button onClick={load.bind(null, 1)} className={(page <= 3 ? 'hide' : '')}>{1}</button>
              <button className={(page <= 3 ? 'hide' : 0 + 'disabled')}>...</button>
              
              {pagPagination.map(pag => (
                <button key={pag} onClick={load.bind(null, pag)} className={(page === pag ? 'active' : '')}>{pag}</button>
              ))}

              <button className={(page >= infopage.total_pages-2 ? 'hide' : 0 + 'disabled')}>...</button>
              <button onClick={load.bind(null, infopage.total_pages)} className={(page >= infopage.total_pages-2 ? 'hide' : '')}>{infopage.total_pages}</button>
              <button onClick={this.nextPage} disabled={page === infopage.total_pages}><FaArrowRight /></button>
          </div>

        </div>
      </div>
    );
  }
}
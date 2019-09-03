import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
import Film from './components/Film'
import header from './star_wars_header.webp'
import image_not_found from './image_not_found.webp'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      films: [],
      page: 1,
      titleSortOrder: null,
      yearSortOrder: null,
      pageChangedNext: null,
      initioalLoadDone: false
    }

    this.imagesNeededToLoad = 0
    this.imagesLoaded = 0
    this.imagesFailedToLoad = []
  }

  componentDidMount() {
    axios.get('https://frantic.s3-eu-west-1.amazonaws.com/films.json').then(response =>{
      const films = response.data.films
      this.setState({
        films
      })
    })
    
  }

  nextPage = () => {
    this.setState({
      page: this.state.page+1,
      pageChangedNext: true,
      films: this.imagesFailedToLoadReplacer()
    })
  }
  previousPage = () => {
    this.setState({
      page: this.state.page-1,
      pageChangedNext: false
    })
  }

  sortTitle = () => {
    const sortedFilms = this.state.films
    if (this.state.titleSortOrder){
      sortedFilms.sort((a, b) => a.Title.toLowerCase() > b.Title.toLowerCase() ? 1 : -1)
    }else{
      sortedFilms.sort((a, b) => a.Title.toLowerCase() < b.Title.toLowerCase() ? 1 : -1)
    }
    this.setState({
      films: sortedFilms,
      titleSortOrder: !this.state.titleSortOrder,
      yearSortOrder: null,
    })
  }
  sortYear = () => {
    const sortedFilms = this.state.films
    if (this.state.yearSortOrder){
      sortedFilms.sort((a, b) => a.Year - b.Year)
    }else{
      sortedFilms.sort((a, b) => b.Year - a.Year)
    }
    this.setState({
      films: sortedFilms,
      yearSortOrder: !this.state.yearSortOrder,
      titleSortOrder: null,
    })
  }


displayedFilmsFunc = (a) => {
  const filmsPerPage = 8
  return this.state.films.slice((this.state.page+a)*filmsPerPage,(this.state.page+a)*filmsPerPage+filmsPerPage)
}

  filmListsFunc = () => {
    const displayedFilms = this.displayedFilmsFunc(-1)
    const displayedFilmsNext = this.displayedFilmsFunc(0)
    const displayedFilmsPrev = this.displayedFilmsFunc(-2)
    if (this.state.pageChangedNext === true) {
      return (
        <div className='film-lists next-animation' onAnimationEnd={() => this.setState({pageChangedNext: null})}>
          <Film classname='film-list' displayedFilms={displayedFilmsPrev} imageLoadError={this.imageLoadError}/>
          <Film classname='film-list' displayedFilms={displayedFilms} imageLoadError={this.imageLoadError}/>
        </div>
      )
    }else if (this.state.pageChangedNext === false) {
      return (
        <div className='film-lists prev-animation' onAnimationEnd={() => this.setState({pageChangedNext: null})}>
          <Film classname='film-list' displayedFilms={displayedFilms} imageLoadError={this.imageLoadError}/>
          <Film classname='film-list' displayedFilms={displayedFilmsNext} imageLoadError={this.imageLoadError}/>
        </div>
      )
    }else if (this.state.initioalLoadDone === true) {
      return (
        <div className='film-lists'>
          <Film classname='film-list hidden' displayedFilms={displayedFilmsPrev} imageLoadError={this.imageLoadError}/>
          <Film classname='film-list' displayedFilms={displayedFilms} imageLoadError={this.imageLoadError}/>
          <Film classname='film-list hidden' displayedFilms={displayedFilmsNext} imageLoadError={this.imageLoadError}/>
        </div>
      )
    }else if (window.innerWidth <= 768) {
      this.imagesNeededToLoad = 1
      return(
        <div className='film-lists'>
          <Film classname='film-list' displayedFilms={displayedFilms.slice(0,1)} imageLoad={this.imageLoad} imageLoadError={this.imageLoadError}/>
        </div>
        )
    }else{
      this.imagesNeededToLoad = 4
      return(
        <div className='film-lists'>
          <Film classname='film-list' displayedFilms={displayedFilms} imageLoad={this.imageLoad} imageLoadError={this.imageLoadError}/>
        </div>
      )
    }
  }
    
  
  imagesFailedToLoadReplacer = () => {
    const films = this.state.films
    this.imagesFailedToLoad.forEach(id => {
      const index = films.map(film => film.imdbID).indexOf(id);
      films[index]= {...films[index],Poster: image_not_found}
    })
    this.imagesFailedToLoad=[]
    return films
  }

  imageLoad = () => {
    this.imagesLoaded += 1
    if (this.imagesLoaded >= this.imagesNeededToLoad) {
      this.setState({initioalLoadDone: true, films: this.imagesFailedToLoadReplacer()})
    }
  }
  
  
  imageLoadError = (e, id) => {
    e.target.onerror = null
    e.target.src = image_not_found
    this.imagesFailedToLoad.push(id)
    }

  render() {
    if (this.state.films.length > 0){
      return (
        <div className='main'>
          <img
          className='headline-image'
          src={header}
          alt={'header'}
          />
          <div className='main2'>
            <ul className='sort-menu'>
              <li className="sort-menu-title">SORT:</li>
              <li><button className={this.state.titleSortOrder === null ? 'sort-button gray':'sort-button'} onClick={() => this.sortTitle()}>
              <div className={this.state.titleSortOrder ? '' : 'arrow-up'}/>
              <div className={this.state.titleSortOrder === true || this.state.titleSortOrder === null ? 'arrow-down' : ''}/>
              TITLE
              </button></li>
              <li><button className={this.state.yearSortOrder === null ? 'sort-button gray':'sort-button'} onClick={() => this.sortYear()}>
              <div className={this.state.yearSortOrder ? '' : 'arrow-up'}/>
              <div className={this.state.yearSortOrder === true || this.state.yearSortOrder === null? 'arrow-down' : ''}/>
              YEAR
              </button></li>
            </ul>
            {this.filmListsFunc()}

            <div className = 'bottom-menu'>
              <button
              className={this.state.page === 1 ? 'previous-page hidden' : 'previous-page'}
              onClick={() => this.previousPage()}>
              <div className="arrow-left"/> Previous page
              </button>
              <div className='page-number'>{this.state.page}</div>
              <button
              className={this.state.page === 13 ? 'next-page hidden' : 'next-page'}
              onClick={() => this.nextPage()}>
              Next page <div className="arrow-right"/>
              </button>
            </div>
          </div>
        </div>
      )
    }else{
      return null
    }
  }
}
export default App;

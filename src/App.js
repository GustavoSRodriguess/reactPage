import React, {useEffect, useState} from 'react';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import Header from './components/Header'

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHEader] = useState(false);

  useEffect(() =>{
    const loadAll = async () => {
      //pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i=>i.slug === 'originals');
      let random = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[random];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo)
      
    }

    loadAll();
  }, []);

  useEffect(() => {
      const scrollListner = () => {
        if(window.scrollY > 10){
          setBlackHEader(true)
        } else {
          setBlackHEader(false)
        }
      }

      window.addEventListener('scroll', scrollListner);
      return () => {
        window.removeEventListener('scroll', scrollListner)
      }

  }, [])

  return(
    <div className="page">

      <Header black={blackHeader}/>

      {featuredData &&
      <FeaturedMovie item={featuredData} />
      }
      
      <section className="lists">
        {movieList.map((item, key) =>(
        <MovieRow  key = {key} title={item.title} items={item.items}/>
        ))}
      </section>

      <footer>
          Feito em estudos por Gustavo Rodrigues <br/>
          Direitos de imagem para Netflix <br/>
          Dados retirados da API do Themoviedb.org
      </footer>

      {movieList.length <= 0 && 
      <div className="loading">
        <img src="https://i.gifer.com/origin/36/36527397c208b977fa3ef21f68c0f7b2_w200.gif"/>
      </div>
    }
    </div>
  );
}
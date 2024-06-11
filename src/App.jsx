import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Card from './components/Card';
import Navbar from './components/Navbar'
import SearchForm from './components/SearchForm'
import { PokemonProvider } from './context/Pokemon.jsx';
import Home from './pages/Home/index.jsx';
import SearchResult from './pages/SearchResult/index.jsx';
import Listing from './pages/Listing/index.jsx';
import Teams from './pages/Teams/index.jsx';
import { DarkModeProvider } from './context/DarkMode.jsx';

const App = () => {

  return (
    <>
      <DarkModeProvider>
        <PokemonProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/search/:query' element={<SearchResult />} />
              <Route path='/listing' element={<Listing />} />
              <Route path="/teams" element={<Teams />} />
            </Routes>
          </BrowserRouter>
        </PokemonProvider>
      </DarkModeProvider>




    </>
  );
}

export default App

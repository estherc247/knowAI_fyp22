import './App.css';
import NavBar from './components/Navbar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Experiments from './components/pages/Experiments';
import ObjectDetection from './components/pages/ObjectDetection';
import ImageClassification from './components/pages/ImageClassification';
import TextClassification from './components/pages/TextClassification';
import Tut from './components/Tutorials';

function App() {
  return (
    <>
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/' exact element={<Home/>} />
          <Route path='/about' exact element={<About/>} />
          <Route path='/experiments' exact element={<Experiments/>} />
          <Route path='/objectD' exact element={<ObjectDetection/>} />
          <Route path='/imageC' exact element={<ImageClassification/>} />
          <Route path='/textC' exact element={<TextClassification/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

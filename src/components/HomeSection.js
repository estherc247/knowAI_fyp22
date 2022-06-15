import React from 'react';
import {Button} from './Button';
import '../App.css';
import './HomeSection.css';


function HomeSection() {
  return (
    <div className='hero-container'>
      <h1>KnowAI</h1>
      <p>"Prediction is not the end! Open the black box! Explore Artificial Intelligence with the use of Explainable AI."</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          GET STARTED
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          DEMO VIDEO <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export default HomeSection;

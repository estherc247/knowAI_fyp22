import React from 'react';
import './Cards.css';
import CardItem from './CardItem';
import './Cards.css'
import {Button} from './Button';

function Cards() {
  return (
    <div className='cards'>
      <h1>Artificial Intelligence</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/ai1.png'
              text='Artificial Intelligence are machines or computer programs that learn to perform tasks that are usually performed by humans.'
              label='What is AI?'
              path='/about'
            />
            <CardItem
              src='images/ai2.png'
              text='AI has become an essential part of numerous real life applications. There has been an increasing usage of AI models in industries such as education, finance, healthcare, transportation and law enforcement.'
              label='Where is AI used?'
              path='/about'
            />
            <CardItem
              src='images/ai3.png'
              text='Explainable AI is an emerging field in machine learning that aims to explain predictions made by AI models to improve accuracy & fairness'
              label='Explainable AI'
              path='/about'
            />
          </ul>
        </div>
        <div className='hero-btns'>
          <Button
            className='btns'
            buttonStyle='btn--secondary'
            buttonSize='btn--large'
          >
            GET STARTED
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Cards;

import React from 'react';
import CardItem from './CardItem';
import './Cards.css'

function Tutorials() {
  return(
    <>
    <div className='cards'>
      <h1>AI Tutorials</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/objectd.png'
              text='An AI system predicts answers to questions given based on the CLEVR Dataset.'
              label='Explainable Visual Reasoning'
              path='/objectD'
            />
            <CardItem
              src='images/imgc.png'
              text='Image classification refers to predicting categories of objects given an image with the help of trained AI models.'
              label='Image Classification'
              path='/imageC'
            />
            <CardItem
              src='images/text_class.png'
              text='Text classification is a machine learning technique that assigns a set of predefined categories to open-ended text.'
              label='Text Classification'
              path='/textC'
            />
          </ul>
        </div>
        <h2> Click on the tutorials above and learn more about AI Prediction!</h2>
      </div>
    </div>
  </>
  );
}

export default Tutorials;

import React from 'react';
import './AboutAI.css';

function AboutAI() {
  return(
    <>
      <div className='about-div'>
        <div className='heading'>
          <h1>Introduction to Artificial Intelligence</h1>
        </div>

        <div className='page-1'>
          <div className='deco-img-1'>
            <img src='images/a1.png' width="400" height="400"></img>
          </div>

          <div className='text-1'>
            <h2> Artificial Intelligence </h2>
            <p>Artificial Intelligence are machines or computer programs that learn to perform tasks that require types of intelligence and that are usually performed by humans. It helps to increase efficiency and reduce human efforts. </p>
          </div>
        </div>

        <div className='page-2'>
          <div className='text-2'>
            <h2> Applications </h2>
            <p>
            AI is being widely used in many industries including Banking, Transportation, Healthcare and Business. There has been greater involvement of AI in the lifestyles of individuals. This is evident from the developement of automated vehicles and smart applications. E-commerce platforms rely heavily on AI to provide efficient and useful service to their users and at the same time obtain beneficial feedback for improvement.</p>
          </div>
          <div className='deco-img-2'>
            <img src='images/a2.png' width="400" height="400"></img>
          </div>
        </div>

        <div className='page-3'>
          <div className='deco-img-3'>
            <img src='images/a3.png' width="400" height="400"></img>
          </div>

          <div className='text-3'>
            <h2> Can we trust AI? </h2>
            <p>The consequences of decisions being made by AI-enabled systems is becoming more profound and critical to the personal well-being of individuals. The ‘blackbox’ nature of AI models makes it hard to understand and interpret decisions made by complex algorithms. Hence, the question of fairness and transparency remain undefined to users which hardens the process of trusting AI. </p>
          </div>
        </div>

        <div className='page-4'>
          <div className='text-4'>
            <h2> What can we do? </h2>
            <p> Explainable AI(XAI) is an emerging field in machine learning that aims to explain predictions made by AI models to improve accuracy, fairness and at the same time aid in the detection of possible anomalies or adversarial attacks. XAI is expected to provide explanations interpretable by humans with clear and simple visualisations. With the help of XAI a simple reason is provided to users for the predictions in order to verfiy the results. </p>
          </div>
          <div className='deco-img-4'>
            <img src='images/a4.png' width="400" height="400"></img>
          </div>
        </div>

      </div>
    </>
  );

}
export default AboutAI;

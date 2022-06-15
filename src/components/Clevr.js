import React, {useState, useEffect, Component, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Clevr.css';

function Clevr(){
    const [number, setNumber] = useState(null)
    const [results, setResults] = useState([])
    const [visible , setVisible] = useState(true)
    const [pred, setPred] = useState(true)
    const [showPred, getPred] = useState(false)
    const inpRef = useRef();
    const user_pred = useRef();
    var count = 1;
    const history = useNavigate();
    const question = 'Are there any other things that are the same shape as the big metallic object'
    const prediction = 'no'

    function getNumber(val){
        setNumber(val.target.value)
      }

    function sendNumber(){
        var instanceID = document.getElementById('inp_num').value;
        console.log(instanceID);
        setNumber(instanceID)
        var url = 'http://localhost:8000/objectD/clevr_img/'+ instanceID.toString();
        axios.post(url).then((response)=>{
            console.log(response.data);
        }).catch((err)=>console.log(err))
    }

    const fetchData = async () => {
      try{
          const url_predictions = "http://localhost:8000/objectD/clevrdetails"

          const response_predictions = await fetch(url_predictions);

          const jsonD = await response_predictions.json();
          const prediction_results = jsonD['Details'][0]

          setResults(prediction_results)

          console.log(jsonD['Details'][0]);
      }catch (error) {
          console.log("error", error)
      }
    };
    useEffect(() => {
      fetchData();
    }, []);

    function handleClick(){
      sendNumber();
    }

    function sendPred(){
      getPred(true)
      var userPred = user_pred.current;
      console.log(userPred.current);
      var currentPred = document.getElementById('p').innerHTML;

      if(userPred == currentPred){
        setPred(true)
      }else{
        setPred(false)
      }
    }

    function nextExample(){
      //getPred(false)
      console.log(count);
      //need to change count for this
      if (count < 5){
        setVisible(true)
        console.log("changing values");
        console.log(results[count]);
        //update UI details with next instance
        document.getElementById('q').innerHTML = 'Question: ' + results[count]['questions'];
        document.getElementById('p').innerHTML = 'Prediction: ' + results[count]['predictions'];
        document.getElementById('original_img').src = (results[count]['original image']).toString();
        document.getElementById('explain_img').src = (results[count]['image explanation']).toString();
        count = count + 1;
      } else{
        console.log("Error please check your input and try again.");
        setVisible(false)
      }

    }

    function endTutorial(){
      history.push('./Tutorials')
    }


    return(
        <>
        <div className='CLEVR-container'>
            <div className='CLEVR-heading'>
                <h1>Visual Reasoning on CLEVR Data</h1>
                <div className='CLEVR-art'>
                <div>
                    <img src='images/clevr_art.png' width="300" height="300"></img>
                </div>
                <div className='CLEVR-p'>
                    <p>eXplainable and eXplicit Neural Modules (XNMs) are used to explain predictions made by the AI system. XNMs allow us to pay more attention to teach machines how to "think", regardless of what they "look". An image along with a question will be displayed. The XNM model will try to predict the answer to the question. Once the prediction process has been completed, an image explaining the 'thought' process of the model will be shown.</p>
                </div>
                </div>
            </div>
        </div>

        <div className='sel-number'>
            <div className='num-exp'>
                <h3>1. Select a number between 1-10</h3>
                <p>This number depicts the number of examples you would like to try. There are 10 images with 10 different questions.</p>
            </div>
            <div className='num-inp'>
                <input ref={inpRef} id='inp_num' type="number" className='inp-number' min={1} max={10} step={1}></input>
                <button className='inp-btn' onClick={handleClick}>Get Images!</button>
            </div>
        </div>

        <div className='get-img'>
            <div className='ori-img'>
                <img id='original_img' src='images/clevr_img/image_original_0.png' className='clevr-img' width={400} height={300}></img>
            </div>
            <div className='num-exp'>
                <h3>2. Original Image</h3>
                <p>The image shown is a sample image from the Clevr Dataset. Questions regarding this image is sent into the AI system.</p>
            </div>
        </div>

        <div className='get-q'>
            <div className='num-exp-user'>
                <h3>3. Question and Prediction</h3>
                <p id='q'>Question: {question}</p>
                <div className='user-values'>
                  <input ref={user_pred} type='text' className='user-pred' onchange={sendPred}></input>
                  <button className='user-btn' onClick={sendPred}>Check</button>
                </div>
                {showPred ? (<p id= 'p'>Predicted Answer: {prediction}</p>):null}
                {/*<h4 id= 'p'>Predicted Answer: {prediction}</h4>*/}
                {pred ? (<h4>Your answer matches the prediction result!</h4>): (<h4>Your answer seems different from the predicted result. Take a look at the explanation below to detect any anomalies.</h4>)}
            </div>
            <div>
                <img src='images/clevr_pred_art.png' width="300" height="300"></img>
            </div>
        </div>

        <div className='get-exp'>
            <div>
                <img id='explain_img' src='images/clevr_img/image_explanation_0.png' width="300" height="800"></img>
            </div>
            <div className='num-exp'>
                <h3>4. Explanation for prediction</h3>
                <p>In this section an visual explanation is provided for the predicted results. From the images shown on the left, the 'throught' process of the AI model is described. The red dot on the image depicts the current logic flow of the model until the final decision is made. If a red dot cannot be found on the last image this means that the predicted answer will be 'No'.</p>
            </div>
        </div>

        <div className='next-inst'>
          {visible ? (<button className='next-btn' onClick={nextExample}>Next Instance</button>): <button className='next-btn'  onClick={endTutorial}>Done!</button>}
            {/*<button className='next-btn' onClick={nextExample}>Next Instance</button>*/}
        </div>
        </>
    )
}

export default Clevr;

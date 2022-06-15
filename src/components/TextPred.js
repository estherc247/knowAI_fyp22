import React, {useState, useEffect, Component, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TextPred.css';

const TextPred = () => {
  const [data, setData] = useState(null)
  const [text, setText] = useState(false)
  const [value, setValue] = useState(null)
  const [user_text, setuser_text] = useState('')

  function getData(val){
    setData(val.target.value)
    setText(false)
  }

  const postData = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("user_text", data);
    let res = await axios({
      method: "post",
      url: 'http://localhost:8000/textC/usertext',
      data: formData,
      headers: {
          "Content-Type": "application/json",
        }
    })
  }

  useEffect(() => {
      postData();
  }, []);

  return(
    <>
    <div className='text-container'>
      <div className='text-heading'>
        <h1>Text Classification</h1>
        <div className='text-art'>
          <div>
            <img src='images/text_art.png' width="300" height="300"></img>
          </div>
          <div className='text-p'>
            <p>Text classification is a machine learning technique that assigns a set of predefined categories to open-ended text. Text classifiers can be used to organize, structure, and categorize almost all kinds of text ranging from sentences, files, documents to medical studies.</p>
          </div>
        </div>
      </div>
    </div>

    <div className='text-intro'>
      <div className='text-inp'>
        <h3> Enter a text to classify </h3>
        <p> Please ensure that the text is 100 words or less.</p>
        <input type='text' name='user_text' onChange={getData}></input>
        {text ? <p>{data}</p> : null }
        <div className='text-btn'>
          <button className='check-btn' onClick={()=>setText(true)}>Check Text</button>
          <button className='class-btn' onClick={postData}>Classify Text</button>
        </div>
      </div>

      <div className='text-print'>
        <h3> SPAM vs HAM </h3>
        <img className='t-res' src="/textC/resulttext" width="600" height="400"></img>
      </div>
    </div>
    </>
  );

}

export default TextPred;

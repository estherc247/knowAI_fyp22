import React, {useState, useEffect, Component, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import http from "./http-common";
import './ImagePred.css';
import CardItem from './CardItem';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import * as ReactBootStrap from 'react-bootstrap';

const ImagePred = () => {
  const history = useNavigate();
  {/**API Tutorial*/}
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [preview, setPreview] = useState();
    const [currentFile, setCurrentFile] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [fileInfos, setFileInfos] = useState([]);
    const [getResult, setResult] = useState([])
    const fileInputref = useRef();

    //get image and preview image
    const selectFile = (event) => {
      fileInputref.current.click();
      console.log("File to upload: ", event.target.files[0])
      const file = event.target.files[0];
      if (file){
        setSelectedFiles(file);
      }
      else{
        setSelectedFiles(null);
      }
      //setSelectedFiles(event.target.files[0]);
    };

    useEffect(() => {
      if(selectedFiles){
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        }
        reader.readAsDataURL(selectedFiles);
      }else{
        setPreview(null);
      }
    }, [selectedFiles]);

    //call lime_preprocess api ->store result
    const upload = async () => {
        let imageFile = selectedFiles;

        console.log(imageFile)
        setCurrentFile(currentFile);
        let formData = new FormData();
        formData.append("img", selectedFiles);
        let res = await axios({
          method: "post",
          url: 'http://localhost:8000/imageC/predict',
          data: formData,
          headers: {
              "Content-Type": "application/json",
            }
        });
        setSelectedFiles(formData);
        //return http.get("/resultlime")
    }

    useEffect(() => {
        upload();
    }, []);

    //get predicted values from api /imageC/resultlime
    const fetchData = async () => {
      try{
          const url_predictions = "http://localhost:8000/imageC/resultlime"

          const response_predictions = await fetch(url_predictions);

          const jsonD = await response_predictions.json();
          const prediction_results = jsonD[0]['prediction_results']

          setResult(prediction_results)

          console.log(jsonD[0]['prediction_results']);
      }catch (error) {
          console.log("error", error)
      }
    };
    useEffect(() => {
      fetchData();
    }, []);

    function handleClick() {
      upload()
      setTimeout (() => {
               history.push("./Tutorials");
           }, 10000);
    }

    return(
    <>
    <div className='img-container'>
      <div className='img-heading'>
        <h1>Image Classification</h1>
        <div className='img-art'>
          <div>
            <img src='images/img_class_art.png' width="300" height="300"></img>
          </div>
          <div className='img-text'>
            <p>Image Classification is the task of associating one or more labels to a given image. In this experiment, we will be using AI to predict category of the item in an image. Once the prediction is made we will be learning about why and how the AI came to the given conclusion.</p>
          </div>
        </div>
      </div>

      <div className='img-intro'>
        <div className='img-inp'>
          <h3> Select an Image to classify </h3>
          <p> Please ensure that the image is of High Definition. Avoid grainy images as they may affect the predictions results.</p>
          <input type="file" id='file' accept=".jpeg, .png, .jpg" onChange={selectFile} ref={fileInputref} />
        </div>
        <div className='img-holder'>
          <img src={preview} alt='' id='img' className='img-prev' width="500" height="300"></img>
        </div>
      </div>

      <div className = 'class-results'>
        <h2> Classify Image! </h2>
        <button className='pred-btn'onClick={()=>{handleClick();}}>Get Predictions</button>
        <p> Please wait 2-3mins for the results to load. Do not refresh or leave the page.</p>
        <div className = 'pred-result'>
          <div className = 'pred-value'>
            <table className='pred-table'>
              <tr>
                <th>Category</th>
                <th>% of belonging</th>
              </tr>
            </table>
              {getResult.map((item) => {
              let values = Object.values(item)
              return(
                  <table className='pred-table'>
                    <tr>
                      <th>{values[0]}</th>
                      <th>{values[1]}</th>
                    </tr>
                  </table>
                  )
                })}
          </div>
          <div className='pred-img'>
            <div className='title'>
              <h3>+ contributions</h3>
              <h3>+ & - contributions</h3>
            </div>
            <div className='imgs'>
              <img className='pos' src="/imageC/resultlimeimagepositive" width="300" height="200"></img>
              <img className='neg' src="/imageC/resultlimeimagenegative" width="300" height="200"></img>
            </div>
          </div>
        </div>
      </div>

      <div className='exps'>
        <h2> Evaluation of Results </h2>
        <div className='exps-text'>
          <h3> Shaded areas shown on the image </h3>
          <p>The highlighted areas on the left image shows points that contributed greatly towards the results of the prediction. The image on the right
          shows further details by highlighting areas that constributed against the prediction made in red. </p>
          <h3> How is this helpful </h3>
          <p> The highlighted areas provide a simple and efficient form of visualisation to users to identify possible errors or annomalies in their AI models.
          These user friendly visualisations makes it easier for individuals with no prior knowledge on the functionality of the model to verfiy the fairness and accuracy of the results. </p>
        </div>
      </div>

      <div className='lime-intro'>
        <h2> Understanding Results </h2>
        <div className='lime-text'>
          <div className='lime-img-1'>
            <img src='images/lime_art.png' width="400" height="400"></img>
          </div>

          <div className='lime-p'>
            <h2> LIME: Local Interpretable Model-Agnostic Explanations </h2>
            <p>LIME is an algorithm that can explain the predictions of any classifier or regressor in a faithful way, by approximating it locally with an interpretable model. Local interpretability provides explanations for specified instances of predictions made by the model. A linear regression model is trained using the dataset values around the chosen instance to approximate the behaviour of the original pretrained model around the instance. This form of accuracy is known as local fidelity. </p>
          </div>
        </div>

        <div className='lime-v'>
          <h2> Youtube tutorial on LIME </h2>
          <iframe width="600" height="600" src="https://www.youtube.com/embed/vz_fkVkoGFM" title="Lime Tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
    </>
  );
}

export default ImagePred;

import React, {useState, useEffect, Component, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap'

function ObjectD() {
  const [preview, setPreview] = useState();
  const [selImage, setSelImage] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const imageInputref = useRef();
  const history = useNavigate();

  //get image and preview image
  const selectImage = (event) => {
    imageInputref.current.click();
    console.log("File to upload: ", event.target.files[0])
    const file = event.target.files[0];
    if (file){
      setSelImage(file);
    }
    else{
      setSelImage(null);
    }
  };

  useEffect(() => {
    if(selImage){
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      }
      reader.readAsDataURL(selImage);
    }else{
      setPreview(null);
    }
  }, [selImage]);

  //send image to python code
  const upload = async () => {
    setPreview(selImage)
    let imageFile = selImage;
    let formData = new FormData();
    formData.append("img", selImage);
    try{
      let res = await axios({
        method: "post",
        url: 'http://localhost:8000/objectD/upload_img',
        data: formData,
        headers: {
            "Content-Type": "application/json",
          }
      });
      setSelImage(formData);
    }catch(e){
      console.log(e);
    }
  }

  useEffect(() => {
      upload();
  }, []);

  //get results on click
  function handleClick() {
    console.log("debugging");
    upload()
    setTimeout (() => {
             history.push("./Tutorials");
         }, 10000);
  }

  return(
    <>
    <div className='o-container'>
      <div className='o-header'>
        <h1> Object Detection </h1>
        <p> Object detection refers to...</p>
      </div>

      <div className='upl-img'>
        <input type="file" id='file' accept=".jpeg, .png, .jpg" onChange={selectImage} ref={imageInputref} />
        <div className='o-img-holder'>
          <img src={preview} alt='' id='img' className='o-img-prev' width="500" height="300"></img>
        </div>
      </div>

      <div className='o-result'>
        <button className='det-btn'onClick={()=>{handleClick();}}>Detect</button>
        <div className='o-img-result'>
          <img className='o-out' src="/objectD/imgoutput" width="600" height="600"></img>
        </div>
      </div>
    </div>
    </>
  );

}

export default ObjectD;

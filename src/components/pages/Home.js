import React, {useState, useEffect} from 'react';
import '../../App.css';
import HomeSection from '../HomeSection';
import Cards from '../Cards'
import axios from 'axios';

function Home() {

  // const [result, setResult] = useState(null);
  // const message = async ()=>{
  //   try{
  //     let res = await axios.get('http://127.0.0.1:8000/');
  //     let result = res.date;
  //     setResult(result);
  //     console.log(result);
  //   }catch(e){
  //     console.log(e);
  //   }
  // };
  //
  // useEffect(()=>{
  //   message()
  // },[]);

  return (
    <>
      <HomeSection />
      <Cards />
    </>
  );
}

export default Home;

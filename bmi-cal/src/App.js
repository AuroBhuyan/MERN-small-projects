import logo from './logo.svg';
import './App.css';
import React from 'react'
import React,{useState} from 'react';

const App = () => {
  const [weight,setWeight] = useState(0);
  const [height,setHeight] = useState(0);
  const [bmi,setBmi] = useState(0);
  const [message,setMessage] = useState(0);

  return (
    <div className='App'>
      <div className='container'>
        <h1>BMI CALCULATOR</h1>
        <form>
          <div>
              <label>Weight</label>
              <input type="text" placeholder="Enter Weight(lbs)" value={weight}></input>
          </div>
          <div>
              <label>Height</label>
              <input type="text" placeholder="Enter Height(lbs)" value={height}></input>
          </div>
          <div>
            <button className='btn' type="submit">Submit</button>
            <button className='btn btn-outline' onClick={reload} type="submit">Reload</button>
          </div>

          <div className='center'>
            <h4>Your BMI Is:</h4>
            <p>{message}</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App

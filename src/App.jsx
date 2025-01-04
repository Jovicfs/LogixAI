import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signin from './components/signin';
import Homepage from './components/Homepage';
import Signup from './components/signup';
import Pricing from './components/pricing';
import About from './components/about';
import CreateLogo from './components/CreateLogo';
import GenerateImage from './components/GenerateImage';
import GenerateVideo from './components/GenerateVideo';
import SmartEdit from './components/SmartEdit';

function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<Signin/>} />
      <Route exact path="/" element={<Homepage/>} />
      <Route path='/sign-up' element={<Signup/>}/>
      <Route path='/pricing' element={<Pricing/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='create-logo' element={<CreateLogo/>}/>
      <Route path='create-image' element={<GenerateImage/>}/>
      <Route path='create-video' element={<GenerateVideo/>}/>
      <Route path='smart-edit' element={<SmartEdit/>}/>
    </Routes>
  );
}

export default App;

import React from 'react';
import {
  BrowserRouter as Router, 
  Routes,
  Route
} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import PageContent from './pages/PageContent';



const App = () => {
  return (
    
    <Router>
  
    
      <Header />
     

      <Routes>
      

        <Route path="/" element={<PageContent />} />
        <Route path="/:slug" element={<PageContent />} />
        


      </Routes>

      <Footer />
  
    </Router>
  );
};

export default App;



import React from 'react';
import Hero from '../components/home/Hero';
import Featured from '../components/home/Featured';
import Process from '../components/home/Process';
import Clients from '../components/home/Clients';

const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <Featured />
      <Process />
      <Clients />
    </div>
  );
};

export default Home;

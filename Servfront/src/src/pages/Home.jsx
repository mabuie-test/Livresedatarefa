import React from 'react';
import Hero from '../components/Hero';
import OrderWizard from '../components/OrderWizard';

export default function Home(){
  return (
    <>
      <Hero />
      <div className="max-w-5xl mx-auto px-4">
        <OrderWizard />
      </div>
    </>
  );
}

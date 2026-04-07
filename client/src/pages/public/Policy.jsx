import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Policy = ({ title, content }) => {
  return (
    <>
      <Header />
      <div className="container" style={{ padding: '80px 0', maxWidth: '800px', lineHeight: '1.8' }}>
        <h1 style={{ fontWeight: '900', fontSize: '36px', marginBottom: '30px' }}>{title}</h1>
        <div style={{ background: '#f9f9f9', padding: '40px', borderRadius: '20px' }}>
           {content}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Policy;
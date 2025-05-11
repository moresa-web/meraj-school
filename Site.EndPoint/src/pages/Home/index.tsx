import React from 'react';
import ContentEditor from '../../components/ContentEditor';
import './styles.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <ContentEditor pageId="home" />
      {/* سایر محتوای صفحه */}
    </div>
  );
};

export default Home; 
require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import {Image, CloudinaryContext, Transformation} from 'cloudinary-react';
import D3MapComponent from './D3MapComponent';



class AppComponent extends React.Component {
  render() {
    return (
      <div className='index'>

        <CloudinaryContext cloudName='ceruberu'>
	        <Image publicId='image1_rargix'>
	            <Transformation width='600' crop='scale'/>
	        </Image>
        </CloudinaryContext>
        <div className='notice'>Map Master</div>

        <D3MapComponent/>

      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

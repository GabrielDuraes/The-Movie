import React, { Component } from 'react';
import ImageGallery from 'react-image-gallery';
 
export default class Galery extends Component {
  render() {
    return <ImageGallery items={this.props.backdrops} />;
  }
}
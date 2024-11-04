import React, { useState } from 'react';
import Slider from 'react-slick';
import { Box, useTheme, MobileStepper } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const ProductBanner = ({ images }) => {
  const theme = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    afterChange: (index) => setActiveStep(index),
  };

  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  return (
    <>
      <Slider {...settings} style={{ overflow: "hidden" }}>
        {images.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            alt="Banner Image"
            sx={{ width: '100%', objectFit: "contain" }}
          />
        ))}
      </Slider>
      <div style={{ alignSelf: 'center' }}>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
        />
      </div>
    </>
  );
};

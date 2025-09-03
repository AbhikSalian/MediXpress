import React from 'react';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';

function Carousel({ items }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <Slider {...settings}>
      {items.map((item, index) => (
        <Box key={index} sx={{ p: 2, textAlign: 'center' }}>
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100%', borderRadius: 12 }}
          />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {item.title}
          </Typography>
        </Box>
      ))}
    </Slider>
  );
}

export default Carousel;

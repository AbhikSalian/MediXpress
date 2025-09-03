import React from "react";
import Slider from "react-slick";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function PharmacyCarousel({ pharmacies }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <Slider {...settings}>
      {pharmacies.map((pharmacy) => (
        <Card key={pharmacy.id} sx={{ m: 1 }}>
          <CardMedia
            component="img"
            height="140"
            image={pharmacy.image || "https://via.placeholder.com/300x140?text=Pharmacy"}
            alt={pharmacy.name}
          />
          <CardContent>
            <Typography variant="h6">{pharmacy.name}</Typography>
            <Typography variant="body2">{pharmacy.location}</Typography>
          </CardContent>
        </Card>
      ))}
    </Slider>
  );
}

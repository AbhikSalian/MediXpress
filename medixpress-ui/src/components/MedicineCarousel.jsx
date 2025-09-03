import React from "react";
import Slider from "react-slick";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";

export default function MedicineCarousel({ medicines }) {
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
      {medicines.map((med) => (
        <Card key={med.id} sx={{ m: 1 }}>
          <CardMedia
            component="img"
            height="140"
            image={med.image || "https://via.placeholder.com/300x140?text=Medicine"}
            alt={med.name}
          />
          <CardContent>
            <Typography variant="h6">{med.name}</Typography>
            <Typography variant="body2">₹{med.price}</Typography>
            <Typography variant="body2">Available at: {med.pharmacyName}</Typography>
            <Button variant="contained" sx={{ mt: 1, bgcolor: "success.main" }}>
              Buy Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </Slider>
  );
}

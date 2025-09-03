import React from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';
import { LocalPharmacy, LocalShipping, ShoppingCart } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const features = [
  {
    id: 1,
    title: 'Find Medicines Easily',
    description: 'Search and compare medicines from multiple pharmacies in seconds.',
    icon: <LocalPharmacy sx={{ fontSize: 50, color: 'green' }} />
  },
  {
    id: 2,
    title: 'Fast Delivery',
    description: 'Get your medicines delivered to your doorstep quickly and reliably.',
    icon: <LocalShipping sx={{ fontSize: 50, color: 'green' }} />
  },
  {
    id: 3,
    title: 'Seamless Ordering',
    description: 'Add items to cart, place orders, and checkout with just a few clicks.',
    icon: <ShoppingCart sx={{ fontSize: 50, color: 'green' }} />
  }
];

function Features() {
  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: 'green', fontWeight: 'bold', textAlign: 'center', mb: 4 }}
      >
        Why Choose MediXpress?
      </Typography>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        }}
        style={{ paddingBottom: '40px' }}
      >



        {features.map((feature) => (
          <SwiperSlide key={feature.id}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: 4,
                textAlign: 'center',
                p: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 }
              }}
            >
              <CardContent>
                {feature.icon}
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 2, mb: 1, color: 'green' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}

export default Features;

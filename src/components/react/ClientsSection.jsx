import React, { useEffect, useRef } from 'react';
import { register } from 'swiper/element/bundle';
import 'swiper/swiper-bundle.css';

register();

const clients = [
  { name: 'U.S. Air Force', logo: '/clientLogos/airforce.png' },
  { name: 'Milwaukee', logo: '/clientLogos/milwaukee.png' },
  { name: 'U.S. Navy', logo: '/clientLogos/navy.png' },
  { name: 'Disney', logo: '/clientLogos/disney.png' },
  { name: 'Microsoft', logo: '/clientLogos/microsoft.png' },
  { name: 'Oracle', logo: '/clientLogos/oracle.png' },
];

const ClientsSection = () => {
  const swiperElRef = useRef(null);

  useEffect(() => {
    const swiperEl = swiperElRef.current;
    const swiperParams = {
      slidesPerView: 3,
      loop: true,
      freeMode: true,
      freeModeMomentum: true,
      freeModeMomentumRatio: 0.25,
      speed: 10000, // Adjust for a slower, smooth transition
      autoplay: {
        delay: 0, // No delay between transitions
        disableOnInteraction: false,
      },
      spaceBetween: 64, // Adjust space between slides
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }, []);

  return (
    <section className="bg-white h-[40vh] flex items-center">
      <div className="w-full max-w-screen-lg mx-auto">
        <h2 className="text-center text-5xl font-bold mb-16">Our Clients</h2>
        <swiper-container init="false" ref={swiperElRef} class="h-full">
          {clients.map((client, index) => (
            <swiper-slide key={index} class="flex items-center justify-center h-full gap-40">
              <div className="flex justify-center items-center h-full w-full">
                <img src={client.logo} alt={client.name} className="max-h-[20vh] object-contain" />
              </div>
            </swiper-slide>
          ))}
        </swiper-container>
      </div>
    </section>
  );
};

export default ClientsSection;
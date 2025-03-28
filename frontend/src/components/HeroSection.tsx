'use client';

import React from 'react';
// import Image from 'next/image';
import styled from 'styled-components';
import Carousel from './Carousel'; // your embla-carousel with autoscroll

const HeroWrapper = styled.section`
  width: 100%;
  background: #ffffff;
  padding: 4rem 0 6rem;
  position: relative;
`;

const HeroInner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  text-align: center;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-family: 'Outfit', sans-serif;
  font-size: 56px;
  font-weight: 700;
  color: #0d0d0d;

  span {
    color: #35938d;
  }
`;

const Subtitle = styled.p`
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: #121212;
  max-width: 672px;
  margin: 1rem auto 3rem;

  span {
    color: #35938d;
  }
`;

const HeroSection = () => {
  return (
    <HeroWrapper>
      <HeroInner>
        <Title>
          Elevate Your Craft, <br />
          <span>Effortlessly!</span>
        </Title>
        <Subtitle>
          Your all-in-one tools to craft freely, engage meaningfully, and{' '}
          <span>monetize seamlessly.</span>
        </Subtitle>
      </HeroInner>

      <Carousel />
    </HeroWrapper>
  );
};

export default HeroSection;

"use client";

import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

const CTASection = styled.section`
  background: #0d0d0d;
  padding: 2.5rem;
  border-radius: 32px;
  outline: 6px solid #aecdcb;
  outline-offset: -6px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 7.5rem;
  margin: 2rem 0;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const TextContent = styled.div`
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  color: white;
  font-size: 36px;
  font-family: "Outfit";
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: white;
  font-size: 16px;
  font-family: "Outfit";
  font-weight: 300;
`;

const CTAButton = styled(Link)`
  background: var(--CF-Primary, #35938d);
  color: white;
  font-size: 16px;
  font-family: "Inter";
  font-weight: 500;
  line-height: 24px;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  text-align: center;
  text-decoration: none;
  width: fit-content;
`;

const DashboardImage = styled(Image)`
  position: absolute;
  right: 0;
  top: 2px;
  width: 829px;
  height: auto;

  @media (max-width: 1024px) {
    position: relative;
    width: 100%;
    margin-top: 2rem;
  }
`;

const CallToAction = () => {
  return (
    <CTASection>
      <TextContent>
        <Title>
          Join the craft, <br />
          Sell to your circle.
        </Title>
        <Subtitle>
          An all-in-one platform that brings everything together.
        </Subtitle>
        <CTAButton href="/signup">Get Started</CTAButton>
      </TextContent>

      <DashboardImage
        src="/15.svg"
        alt="Dashboard preview"
        width={829}
        height={605}
        priority
      />
    </CTASection>
  );
};

export default CallToAction;

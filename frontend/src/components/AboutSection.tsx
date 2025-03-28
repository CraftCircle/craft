import Image from "next/image";
import styled from "styled-components";
import DotGrid from "./DotGrid";

// ==== Styled Components ====

const AboutSection = styled.section`
  display: flex;
  justify-content: center;
  gap: 3rem;
  align-items: flex-start;
  padding: 4rem 2rem;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 420px;
  height: 430px;
`;

const BaseImage = styled(Image)`
  width: 272px;
  height: 395px;
  border-radius: 22.14px;
  border: 4px solid #1b4a47;
  background: white;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const OverlayImage = styled(Image)`
  width: 304px;
  height: 409px;
  border-radius: 22.14px;
  border: 4px solid #1b4a47;
  background: white;
  position: absolute;
  top: 20px;
  left: 60px;
  z-index: 2;
`;


const TealCircle = styled.div`
  position: absolute;
  bottom: -30px;
  left: 30px;
  width: 110px;
  height: 110px;
  border-radius: 9999px;
  border: 13px solid var(--CF-Primary, #35938d);
  z-index: 0;
`;

const TextContent = styled.div`
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  span {
    color: #35938d;
    font-weight: 500;
    font-family: "Outfit";
    font-size: 16px;
  }

  h2 {
    color: #101010;
    font-size: 36px;
    font-family: "Outfit";
    font-weight: 700;
  }

  h4 {
    font-size: 16px;
    font-weight: 500;
    color: #060606;
    margin-bottom: 0.25rem;
  }

  p {
    color: #060606;
    font-size: 16px;
    font-family: "Outfit";
    font-weight: 300;
    line-height: 1.6;
  }
`;

// ==== Component ====

const AboutUs = () => (
  <AboutSection>
    <ImageWrapper>
    <DotGrid top="-30px" right="-30px" />

      <TealCircle />

      <BaseImage src="/6.svg" alt="Behind" width={272} height={395} />
      <OverlayImage src="/5.svg" alt="Front" width={304} height={409} />
    </ImageWrapper>

    <TextContent>
      <span>About Us</span>
      <h2>Simple, Fast & Secure</h2>
      <div>
        <h4>Craft freely</h4>
        <p>
          At CraftCircle, we empower ventures to craft freely, engage
          meaningfully, and monetize seamlessly with an all-in-one platform
          designed for creators, entrepreneurs, and businesses. We believe that
          turning passion into success should be simple, not overwhelming.
        </p>
      </div>
      <div>
        <h4>Focus on what matters</h4>
        <p>
          That’s why we provide personalized, seamless, and flexible
          tools—from client engagement to e-commerce—to help you focus on what
          matters most: your craft and your clients.
        </p>
      </div>
    </TextContent>
  </AboutSection>
);

export default AboutUs;

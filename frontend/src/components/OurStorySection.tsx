import Image from "next/image";
import styled from "styled-components";
import DotGrid from "./DotGrid";

const SectionWrapper = styled.section`
  width: 100%;
  padding: 0 162px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Heading = styled.div`
  text-align: center;
  color: #35938d;
  font-size: 16px;
  font-family: "Outfit";
  font-weight: 500;
`;

const Title = styled.h2`
  width: 584px;
  text-align: center;
  color: #101010;
  font-size: 36px;
  font-family: "Outfit";
  font-weight: 700;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Paragraph = styled.p`
  width: 668px;
  text-align: center;
  color: #060606;
  font-size: 16px;
  font-family: "Outfit";
  font-weight: 300;
  line-height: 1.6;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Wrap = styled.div`
  padding: 4.5rem 0;
`;

const FinalNote = styled.p`
  width: 668px;
  text-align: center;
  color: #060606;
  font-size: 24px;
  font-family: "Outfit";
  font-weight: 500;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const OurStorySection = () => {
  return (
    <SectionWrapper>
      <DotGrid top="30px" left="53px" />
      <Heading>Our Story</Heading>
      <Title>
        At CraftCircle, we believe ambition shouldnt be held back by complexity.
      </Title>
      <Paragraph>
        Yet, across Africa, weve seen passionate entrepreneurs and creatives
        struggle with scattered tools, disconnected workflows, and
        time-consuming processes. Managing bookings, payments, and customer
        interactions across multiple platforms has led to lost opportunities,
        reduced brand value, and missed revenue.
      </Paragraph>

      <Wrap>
        <Image
          src="/7.svg"
          alt="Workflow visual"
          width={776}
          height={453}
          priority
        />
      </Wrap>

      <FinalNote>
        So, were building CraftCircle—an all-in-one platform that brings
        everything together.
      </FinalNote>
    </SectionWrapper>
  );
};

export default OurStorySection;

"use client";

import styled from "styled-components";
import Image from "next/image";
import { motion } from "framer-motion";

const Section = styled.section`
  background-color: #1b4a47;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const Heading = styled.h2`
  color: #f5f5f5;
  font-size: 52px;
  font-family: "Outfit";
  font-weight: 700;
  margin-bottom: 4rem;
`;

const StepsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 6rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
`;

const StepImage = styled(motion.div)`
  width: 298px;
  height: auto;

  img {
    width: 100%;
    height: auto;
  }
`;

const ArrowSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

// Motion path variant
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 0.4,
    transition: {
      pathLength: { delay: 0.3, type: "spring", duration: 1.5, bounce: 0 },
      opacity: { delay: 0.3, duration: 0.5 },
    },
  },
};

const steps = [
  { src: "/12.svg", alt: "Step 1 - Set Up" },
  { src: "/13.svg", alt: "Step 2 - Manage & Engage" },
  { src: "/14.svg", alt: "Step 3 - Grow & Scale" },
];

const OurSimpleWay = () => {
  return (
    <Section>
      <Heading>Our simpler way</Heading>

      {/* Animated arrows */}
      <ArrowSvg viewBox="0 0 1200 400" preserveAspectRatio="none">
        {/* Line from step 1 to 2 */}
        <motion.path
          d="M300,220 C400,100 600,100 700,220"
          stroke="#f5f5f5"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          variants={draw}
          initial="hidden"
          whileInView="visible"
        />
        {/* Line from step 2 to 3 */}
        <motion.path
          d="M700,220 C800,300 1000,300 1100,220"
          stroke="#f5f5f5"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          variants={draw}
          initial="hidden"
          whileInView="visible"
        />
      </ArrowSvg>

      <StepsWrapper>
        {steps.map(({ src, alt }, index) => (
          <StepImage
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            style={{
                marginLeft: index === 0 ? "2rem" : undefined,
                marginRight: index === steps.length - 1 ? "2rem" : undefined,
              }}
          >
            <Image src={src} alt={alt} width={298} height={355} />
          </StepImage>
        ))}
      </StepsWrapper>
    </Section>
  );
};

export default OurSimpleWay;

import styled, { keyframes } from "styled-components";
import Image from "next/image";
import SolutionCard from "@/components/SolutionsCard";

// ==== Animation ====

const fadeSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ==== Styled Components ====

const SectionWrapper = styled.section`
  position: relative;
  background: #e4f9f8;
  padding: 4rem 2rem;
  overflow: hidden;
`;

const BackgroundImage = styled(Image)`
  position: absolute;
  top: -20px;
  right: 20px;
  width: 370px;
  height: auto;
  object-fit: contain;
  z-index: 0;
  animation: ${fadeSlideIn} 1s ease forwards;

  @media (max-width: 1024px) {
    top: auto;
    bottom: 0;
    right: 10px;
    width: 240px;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  color: #101010;
  font-size: 48px;
  font-family: "Outfit";
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #1b4a47;
  font-size: 24px;
  font-family: "Outfit";
  font-weight: 400;
  margin-bottom: 2rem;
`;

const CardsRow = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
`;



// ==== Card Data ====

const cards = [
  {
    imageSrc: "/16.svg",
    alt: "Events",
    bgColor: "#B3261E",
    title: "Host Seamless Events",
    description:
      "Sell tickets, manage guest lists, and create engaging in-event experiences.",
  },
  {
    imageSrc: "/10.svg",
    alt: "Appointments",
    bgColor: "#35938D",
    title: "Streamline Appointments",
    description:
      "Manage sessions with automated reminders—no more back-and-forth scheduling.",
  },
  {
    imageSrc: "/11.svg",
    alt: "Portfolio",
    bgColor: "#F7B501",
    title: "Showcase Your Work, Your Way",
    description:
      "Create a stunning digital portfolio to display and promote your products, services, or creative work.",
  },
  {
    imageSrc: "/8.svg",
    alt: "Data",
    bgColor: "#121212",
    title: "Collect Documents, Data & More",
    description:
      "Smart forms for applications, registrations, and customer data.",
  },
];

// ==== Component ====

const SolutionsSection = () => {
 

  return (
    <SectionWrapper>
      <BackgroundImage
        src="/20.svg"
        alt="Smiling Lady"
        width={370}
        height={523}
        priority
      />
      <Content>
        <Title>Solutions</Title>
        <Subtitle>
          CraftCircle Solutions – Everything You Need, in One Place
        </Subtitle>

    
        <CardsRow >
          {cards.map((card, idx) => (
            <SolutionCard key={idx} {...card} />
          ))}
        </CardsRow>
      </Content>
    </SectionWrapper>
  );
};

export default SolutionsSection;

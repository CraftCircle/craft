import Image from "next/image";
import styled from "styled-components";

type SolutionCardProps = {
  imageSrc: string;
  alt: string;
  bgColor: string;
  title: string;
  description: string;
};

const CardWrapper = styled.div`
  width: 275px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ImageWrapper = styled.div<{ $bg: string }>`
  padding: 18px 22px;
  background: ${({ $bg }) => $bg};
  box-shadow: 0px -8px 14.5px rgba(0, 0, 0, 0.08);
  border-radius: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledImage = styled(Image)`
  height: 116px;
  width: auto;
  object-fit: cover;
  border-radius: 16px;
  flex: 1;
`;

const Title = styled.h4`
  font-size: 28px;
  font-weight: 500;
  font-family: "Outfit";
  color: var(--Dark-Teal, #1b4a47);
`;

const Description = styled.p`
  font-size: 16px;
  font-weight: 400;
  font-family: "Outfit";
  color: #444;
`;

const SolutionCard: React.FC<SolutionCardProps> = ({
  imageSrc,
  alt,
  bgColor,
  title,
  description,
}) => (
  <CardWrapper>
    <ImageWrapper $bg={bgColor}>
      <StyledImage src={imageSrc} alt={alt} width={231} height={116} />
    </ImageWrapper>
    <Title>{title}</Title>
    <Description>{description}</Description>
  </CardWrapper>
);

export default SolutionCard;

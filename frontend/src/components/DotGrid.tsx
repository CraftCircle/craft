import styled from "styled-components";

const DotGridContainer = styled.div<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}>`
  position: absolute;
  ${({ top }) => top && `top: ${top};`}
  ${({ left }) => left && `left: ${left};`}
  ${({ right }) => right && `right: ${right};`}
  ${({ bottom }) => bottom && `bottom: ${bottom};`}
  width: 172px;
  opacity: 0.5;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: flex-end;
  gap: 20px;
  z-index: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Dot = styled.div`
  width: 3px;
  height: 3px;
  background: var(--Dark-Teal, #1b4a47);
  border-radius: 9999px;
`;

interface DotGridProps {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  count?: number;
}

const DotGrid = ({ top, left, right, bottom, count = 64 }: DotGridProps) => {
  return (
    <DotGridContainer top={top} left={left} right={right} bottom={bottom}>
      {Array.from({ length: count }).map((_, idx) => (
        <Dot key={idx} />
      ))}
    </DotGridContainer>
  );
};

export default DotGrid;

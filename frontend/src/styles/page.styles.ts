import styled from "styled-components";
// import { motion } from "framer-motion";

interface CardProps {
  $border: string;
  $rotate: string;
}

interface SectionProps {
  $bg?: string;
  $color?: string;
}

interface NavLinksProps {
  $open: boolean;
}

/* ============================= */
/* LAYOUT BASE */
/* ============================= */

export const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

/* ============================= */
/* NAVBAR */
/* ============================= */

export const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2rem;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.surface};
`;

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

export const LogoWrap = styled.a`
  display: flex;
  align-items: center;

  img {
    width: 64px;
    height: 64px;
  }
`;

export const NavLinks = styled.div<NavLinksProps>`
  display: flex;
  gap: 1.25rem;

  a {
    color: ${({ theme }) => theme.text};
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.primary};
      color: white;
    }
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background: ${({ theme }) => theme.background};
    flex-direction: column;
    padding: 1rem 2rem;
    display: ${({ $open }) => ($open ? "flex" : "none")};
    border-top: 1px solid ${({ theme }) => theme.surface};
  }
`;

export const NavButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0f766e;
  }
`;
export const NavToggle = styled.button`
  background: transparent;
  border: 2px solid currentColor;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: ${({ theme }) => theme.text};

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }
`;


export const DropdownContainer = styled.div`
  position: relative;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  z-index: 999;

  a {
    display: block;
    padding: 0.75rem 1.25rem;
    text-decoration: none;
    color: ${({ theme }) => theme.text};
    font-weight: 500;

    &:hover {
      background-color: ${({ theme }) => theme.primary};
      color: white;
    }
  }
`;

export const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  div {
    width: 25px;
    height: 3px;
    background-color: ${({ theme }) => theme.text};
    margin: 3px 0;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

/* ============================= */
/* SECTIONS & TYPOGRAPHY */
/* ============================= */

export const Section = styled.section<SectionProps>`
  padding: 4rem 1rem;
  background-color: ${({ $bg, theme }) => $bg || theme.background};
  color: ${({ $color, theme }) => $color || theme.text};
`;

export const Centered = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  text-align: center;
`;

export const Title = styled.h1<{ small?: boolean }>`
  font-size: ${({ small }) => (small ? "2rem" : "2.5rem")};
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
`;

export const Subheading = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const Highlight = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
`;

export const Text = styled.p`
  max-width: 600px;
  margin: 0 auto;
`;

/* ============================= */
/* HERO IMAGE CARDS */
/* ============================= */

export const ImageGrid = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const ImageCard = styled.div<CardProps>`
  width: 250px;
  height: 360px;
  border: 4px solid ${({ $border }) => $border};
  transform: rotate(${({ $rotate }) => $rotate});
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    transform: scale(1.03) rotate(0deg);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  img {
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

/* ============================= */
/* TWO-COLUMN LAYOUT (ABOUT) */
/* ============================= */

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1024px;
  margin: 0 auto;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

export const TextCol = styled.div`
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  strong {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
`;

/* ============================= */
/* SOLUTIONS - CARDS */
/* ============================= */

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  max-width: 1024px;
  margin: 2rem auto 0;

  h4 {
    margin-top: 1rem;
    font-weight: 600;
  }

  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text};
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;

  img {
    border-radius: 0.5rem;
  }
`;

/* ============================= */
/* CTA + LINK BUTTON */
/* ============================= */

export const CTA = styled.a`
  display: inline-block;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.75rem 1.75rem;
  margin-top: 2rem;
  font-weight: 600;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0f766e;
  }
`;

/* ============================= */
/* FAQs */
/* ============================= */

export const FAQ = styled.div`
  max-width: 640px;
  margin: 2rem auto 0;
  text-align: left;

  strong {
    display: block;
    margin-top: 1.5rem;
    font-weight: 600;
  }

  p {
    margin-top: 0.5rem;
    line-height: 1.6;
  }
`;

/* ============================= */
/* Footer */
/* ============================= */

export const Footer = styled.footer`
  text-align: center;
  font-size: 0.85rem;
  padding: 2rem 1rem;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border-top: 1px solid ${({ theme }) => theme.border};
`;

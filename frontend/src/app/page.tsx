"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import EmblaCarousel from "@/components/Carousel";
import AboutSection from "@/components/AboutSection";
import OurStorySection from "@/components/OurStorySection";
import * as S from "@/styles/page.styles";
import SolutionsSection from "@/components/SolutionsSection";
import OurSimpleWay from "@/components/OurSimpleWay";
import CallToAction from "@/components/CallToAction";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

const Page = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <S.Main>
      {/* Nav Section */}
      <S.Navbar>
        <S.NavLeft>
          <Link href="/" passHref>
            <S.LogoWrap>
              <Image
                src="/logo.svg"
                alt="CraftCircle Logo"
                width={156}
                height={80}
              />
            </S.LogoWrap>
          </Link>
        </S.NavLeft>

        <S.NavRight>
          <S.NavLinks $open={menuOpen}>
            <Link href="/">Home</Link>
            <Link href="/events">Events</Link>
            <Link href="/pricing">Pricing</Link>
            <ThemeToggle />
          </S.NavLinks>

          <S.DropdownContainer
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <S.NavButton>Login as</S.NavButton>
            {showDropdown && (
              <S.Dropdown>
                <Link href="/login/creator">Creator</Link>
                <Link href="/login/admin">Admin</Link>
              </S.Dropdown>
            )}
          </S.DropdownContainer>

          <S.Hamburger onClick={() => setMenuOpen(!menuOpen)}>
            <div />
            <div />
            <div />
          </S.Hamburger>
        </S.NavRight>
      </S.Navbar>

      {/* Hero Section */}
      <S.Section>
        <S.Centered>
          <S.Title>Elevate Your Craft,</S.Title>
          <S.Subtitle>Effortlessly!</S.Subtitle>
          <S.Text>
            Your all-in-one tools to craft freely, engage meaningfully, and{" "}
            <S.Highlight>monetize seamlessly</S.Highlight>.
          </S.Text>
        </S.Centered>
        <EmblaCarousel />
      </S.Section>

      {/* About Section */}
      <AboutSection />

      {/* Our Story */}
      <OurStorySection />

      {/* Solutions Section */}
      <SolutionsSection />

      {/* Our Simple Way */}
      <OurSimpleWay />

      {/* CTA Section */}
      <CallToAction />

      {/* FAQs Section */}
      <FaqSection />

      {/* Footer */}
      <Footer />
    </S.Main>
  );
};

export default Page;

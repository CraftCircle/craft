"use client";

import React, { useState } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import * as S from "@/styles/page.styles";
import Link from "next/link";
import EmblaCarousel from "@/components/Carousel";

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
                width={80}
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
      <S.Section>
        <S.TwoCol>
          <div>
            <Image src="/5.svg" alt="Mobile UI" width={400} height={300} />
          </div>
          <S.TextCol>
            <S.Subheading>Simple, Fast & Secure</S.Subheading>
            <p>
              At CraftCircle, we empower ventures to craft freely, engage
              meaningfully, and monetize seamlessly.
            </p>
            <strong>Focus on what matters</strong>
            <p>
              We provide seamless tools—from client engagement to e-commerce—so
              you focus on your craft and your clients.
            </p>
          </S.TextCol>
        </S.TwoCol>
      </S.Section>

      {/* Our Story */}
      <S.Section>
        <S.Centered>
          <S.Subheading>Our Story</S.Subheading>
          <S.Title small>
            At CraftCircle, we believe ambition shouldn’t be held back by
            complexity.
          </S.Title>
          <p>
            Across Africa, passionate entrepreneurs struggle with scattered
            tools. We&apos;re building a unified platform that brings it all
            together.
          </p>
          <Image
            src="/7.svg"
            alt="Workflow"
            width={600}
            height={400}
            style={{ marginTop: "2rem" }}
          />
        </S.Centered>
      </S.Section>

      {/* Solutions Section */}
      <S.Section>
        <S.Centered>
          <S.Subheading>Solutions</S.Subheading>
          <p>CraftCircle Solutions – Everything You Need, in One Place</p>
        </S.Centered>

        <S.Cards>
          <S.Card>
            <Image src="/16.svg" alt="Events" width={300} height={200} />
            <h4>Host Seamless Events</h4>
            <p>
              Sell tickets, manage guest lists, and create engaging event
              experiences.
            </p>
          </S.Card>
          <S.Card>
            <Image src="/10.svg" alt="Appointments" width={300} height={200} />
            <h4>Streamline Appointments</h4>
            <p>
              Manage sessions with automated reminders—no more back-and-forth.
            </p>
          </S.Card>
          <S.Card>
            <Image src="/11.svg" alt="Portfolio" width={300} height={200} />
            <h4>Showcase Your Work</h4>
            <p>Create a digital portfolio to promote your services or work.</p>
          </S.Card>
          <S.Card>
            <Image src="/8.svg" alt="Data" width={300} height={200} />
            <h4>Collect Documents & Data</h4>
            <p>
              Smart forms for applications, registrations, and customer data.
            </p>
          </S.Card>
        </S.Cards>
      </S.Section>

      {/* CTA Section */}
      <S.Section $bg="black" $color="white">
        <S.Centered>
          <S.Title>Join the craft, Sell to your circle.</S.Title>
          <p>An all-in-one platform that brings everything together.</p>
          <S.CTA href="/signup">Get Started</S.CTA>
        </S.Centered>
      </S.Section>

      {/* FAQs Section */}
      <S.Section>
        <S.Centered>
          <S.Subheading>FAQs</S.Subheading>
          <S.FAQ>
            <strong>What is CraftCircle?</strong>
            <p>
              CraftCircle is an all-in-one platform to manage bookings,
              payments, interactions, and more.
            </p>

            <strong>What solutions does it offer?</strong>
            <p>
              Ticketing, bookings, portfolios, bulk messaging, forms, and
              e-commerce.
            </p>

            <strong>Is my data safe?</strong>
            <p>Yes, we follow best security practices to protect your data.</p>
          </S.FAQ>
        </S.Centered>
      </S.Section>

      {/* Footer */}
      <S.Footer>
        <p>© 2025 CraftCircle. Made with ❤️</p>
        <p>support@craftcircle.com</p>
      </S.Footer>
    </S.Main>
  );
};

export default Page;

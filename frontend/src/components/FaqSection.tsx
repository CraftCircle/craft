"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const Section = styled.section`
  padding: 4rem 2rem;
  max-width: 1120px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  font-family: "Outfit";
  color: #101010;
  margin-bottom: 2rem;
`;

const Item = styled.div`
  border-bottom: 1px solid #f3f3f3;
  padding: 1.5rem 0;
  cursor: pointer;
`;

const Question = styled.div`
  font-size: 16px;
  font-weight: 500;
  font-family: "Outfit";
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Answer = styled(motion.div)`
  font-size: 14px;
  font-family: "Outfit";
  font-weight: 300;
  margin-top: 1rem;
  line-height: 1.6;
  color: #444;
`;

const PlusMinus = styled.span`
  font-size: 24px;
  font-weight: 500;
`;

const faqData = [
  {
    question: "What is CraftCircle?",
    answer:
      "CraftCircle is an all-in-one platform designed to help businesses, creatives, and entrepreneurs streamline bookings, payments, customer interactions, and more—all in one place.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign up, customize your profile, and choose the solutions that fit your business needs. It’s fast and easy to begin!",
  },
  {
    question: "What solutions does CraftCircle offer?",
    answer:
      "We provide tools for event ticketing, bookings, bulk SMS, digital portfolios, e-commerce, and smart digital forms.",
  },
  {
    question: "Is my data safe?",
    answer: "Yes, we follow best security practices to protect your data.",
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) =>
    setActiveIndex(index === activeIndex ? null : index);

  return (
    <Section>
      <Title>FAQs</Title>
      {faqData.map((faq, index) => (
        <Item key={index} onClick={() => toggleFAQ(index)}>
          <Question>
            {faq.question}
            <PlusMinus>{activeIndex === index ? "−" : "+"}</PlusMinus>
          </Question>
          <AnimatePresence initial={false}>
            {activeIndex === index && (
              <Answer
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {faq.answer}
              </Answer>
            )}
          </AnimatePresence>
        </Item>
      ))}
    </Section>
  );
};

export default FaqSection;

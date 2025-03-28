"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import styled from "styled-components";

const TWEEN_FACTOR_BASE = 0.84;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

const CarouselContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
  height: 650px;
`;

const Viewport = styled.div`
  overflow: hidden;
  width: 100%;
`;

const SlideContainer = styled.div`
  display: flex;
`;

const Slide = styled.div<{ $border: string; $rotate: string }>`
  flex: 0 0 100%;
  position: relative;
  height: 650px;
  border: 4px solid ${({ $border }) => $border};
  border-radius: 22px;
  overflow: hidden;
  transform: rotate(${({ $rotate }) => $rotate});
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.03) rotate(0deg);
  }

  img {
    object-fit: cover;
  }
`;

const images = [
  { src: "/1.svg", border: "#14b8a6", rotate: "-2deg" },
  { src: "/2.svg", border: "#facc15", rotate: "2deg" },
  { src: "/3.svg", border: "#ef4444", rotate: "-3deg" },
  { src: "/4.svg", border: "#10b981", rotate: "3deg" },
];

const Carousel: React.FC = () => {
  const tweenFactor = useRef(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    AutoScroll({ stopOnInteraction: false }),
  ]);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tweenOpacity = useCallback(
    (api: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();
      const slidesInView = api.slidesInView();
      const isScrollEvent = eventName === "scroll";

      api.scrollSnapList().forEach((snap, snapIndex) => {
        let diffToTarget = snap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1) diffToTarget = snap - (1 + scrollProgress);
                if (sign === 1) diffToTarget = snap + (1 - scrollProgress);
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const opacity = numberWithinRange(tweenValue, 0, 1).toString();
          api.slideNodes()[slideIndex].style.opacity = opacity;
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    const autoScroll = emblaApi.plugins()?.autoScroll;
    autoScroll?.play();

    setTweenFactor(emblaApi);
    tweenOpacity(emblaApi);
    emblaApi
      .on("reInit", setTweenFactor)
      .on("reInit", tweenOpacity)
      .on("scroll", tweenOpacity)
      .on("slideFocus", tweenOpacity);
  }, [emblaApi, tweenOpacity, setTweenFactor]);

  return (
    <CarouselContainer>
      <Viewport ref={emblaRef}>
        <SlideContainer>
          {images.map((img, index) => (
            <Slide key={index} $border={img.border} $rotate={img.rotate}>
              <Image
                src={img.src}
                alt={`slide-${index}`}
                fill
                priority={index === 0}
              />
            </Slide>
          ))}
        </SlideContainer>
      </Viewport>
    </CarouselContainer>
  );
};

export default Carousel;

import styled from "styled-components";
import Image from "next/image";

const FooterWrapper = styled.footer`
  background-color: #f1f1f1;
  padding: 40px 160px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
`;

const FooterColumn = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  span {
    font-size: 18px;
    font-weight: 700;
    font-family: "Outfit";
    color: #0d0d0d;
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: "Outfit";
  font-size: 18px;
  color: #0d0d0d;

  a {
    text-decoration: none;
    color: inherit;
    line-height: 28px;
  }
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 18px;
    font-family: "Outfit";
    font-weight: 400;
    line-height: 28px;
    color: #0d0d0d;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 24px;

  div {
    width: 14px;
    height: 14px;
    background: #060606;
  }
`;

const Legal = styled.div`
  text-align: center;
  padding: 24px 0;
  font-size: 14px;
  font-family: "Outfit";
  color: #0d0d0d;

  a {
    color: #0d0d0d;
  }
`;

const Footer = () => {
  return (
    <>
      <FooterWrapper>
        <FooterColumn>
          <LogoWrap>
            <div style={{ width: 50, height: 50, background: "#060606" }} />
            <span>CraftCircle</span>
          </LogoWrap>
          <LinkGroup>
            <div style={{ display: "flex", gap: 27 }}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms and conditions</a>
            </div>
            <div>Made with us by ❤️ 2025</div>
          </LinkGroup>
        </FooterColumn>

        <FooterColumn>
          <LinkGroup>
            <span>Have a question for us?</span>
            <ContactRow>
              <div style={{ width: 20, height: 20, background: "#121212" }} />
              <span>support@craftcircle.com</span>
            </ContactRow>
            <ContactRow>
              <Image src="/phone.svg" alt="phone" width={20} height={20} />
              <span>+254 </span>
            </ContactRow>
            <ContactRow>
              <div style={{ width: 20, height: 20, background: "#111928" }} />
              <span>P.O. Box 12345 – 00100, Nairobi, Kenya</span>
            </ContactRow>
          </LinkGroup>
          <SocialIcons>
            <div />
            <div />
            <div />
            <div />
            <div />
          </SocialIcons>
        </FooterColumn>

        <FooterColumn style={{ alignItems: "flex-end" }}>
          <LinkGroup>
            <a href="#">About</a>
            <a href="#">Pricing</a>
            <a href="#">Back to top</a>
          </LinkGroup>
        </FooterColumn>
      </FooterWrapper>

      <Legal>
        © 2025 CraftCircle. Made with ❤️ <br />
        <a href="mailto:support@craftcircle.com">support@craftcircle.com</a>
      </Legal>
    </>
  );
};

export default Footer;

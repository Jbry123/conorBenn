import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import conorVertical from "./conorVertical.webm";
import logo from "./logo.svg";
import boxingGloves from "./styles/boxing-gloves.png";
import ticket from "./styles/ticket.png";
import shake from "./styles/shake-hands.png";
import boxingShorts from "./styles/boxing-shorts.png";
import robe from "./styles/robe.png";
import plotter from "./styles/plotter.png";
import press from "./styles/lectern.png";
import sessions from "./styles/sand-bag.png";
import { Collapse } from 'antd';
import axios from 'axios';
import Web3 from "web3";

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;


const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #F3164A;
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #F3164A;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  width: 400px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: #F3164A;
  text-decoration: none;
`;


function App() {

  
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [ethPriceGBP, setEthPriceGBP] = useState(13411111);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "0x20bcde673cc3e77d843d100ea14e3760f64e1e11",
    SCAN_LINK: "https://etherscan.io/address/0x20bcde673cc3e77d843d100ea14e3760f64e1e11",
    NETWORK: {
      NAME: "Ethereum",
      SYMBOL: "ETH",
      ID: 1,
    },
    NFT_NAME: "BenNFT",
    SYMBOL: "BNFT",
    MAX_SUPPLY: 5555,
    WEI_COST: ethPriceGBP,
    DISPLAY_COST: 0.15,
    GAS_LIMIT: 120000,
    MARKETPLACE: "opensea",
    MARKETPLACE_LINK: "https://opensea.io/collection/BenNFT-official",
    SHOW_BACKGROUND: false,
  });


  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);

    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);


    let signature = "S2Atx0qfYi32bleF";
    // signature = S2Atx0qfYi32bleF
    blockchain.smartContract.methods
      //change params in mint to number of mints first, then the signature
      .mint(mintAmount, signature)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
    const priceResponse = await fetch("https://api.etherscan.io/api?module=stats&action=ethprice&apikey=MIG4QSH7EQ36WU9TS879FHY99QMG7ZSIEG", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    let price = await priceResponse.json();
    let calcPrice =(200 / (price.result.ethusd * .85) * 1000000000000000000);
    setEthPriceGBP(calcPrice);
    console.log(calcPrice, "testPrice");
console.log(ethPriceGBP);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      {/*-------------------------ABSOLUTE OBJECTS BELOW---------------------------- */}
      <div className="spinner">
        <div className="logocontainer2" style={{ marginBottom: "25px", fontSize: "60px", fontFamily: "Orbitron", color: "white" }}>
          BenNFT
        </div>
        <div className="sk-cube-grid">
          <div className="sk-cube sk-cube1"></div>
          <div className="sk-cube sk-cube2"></div>
          <div className="sk-cube sk-cube3"></div>
          <div className="sk-cube sk-cube4"></div>
          <div className="sk-cube sk-cube5"></div>
          <div className="sk-cube sk-cube6"></div>
          <div className="sk-cube sk-cube7"></div>
          <div className="sk-cube sk-cube8"></div>
          <div className="sk-cube sk-cube9"></div>
        </div>
      </div>

      <div className="navContainer">
        <div className="nav-header-hide">
          <div className="logocontainer">
            <h1 className="ml14">
              <span className="text-wrapper">
                <span className="letters">BenNFT</span>
                <span className="line"></span>
              </span>
            </h1>
          </div>
          <div className="site-links">
            <div className="site-link1">
              <a href="#item1">About</a>

            </div>
            <div className="site-link1">
              <a href="#item2">Utility</a>
            </div>
            <div className="site-link1">
              <a href="#faq">FAQ</a>
            </div>
            <div className="site-link1">
              <a href="#item4">Buy</a>
            </div>
          </div>
          <div className="socials">
            <div className="social-link1">
              <a href="instagram.com/monsterbuds"></a>
            </div>
            <div className="social-link2">
              <a href="twitter.com/monsterbuds"></a>
            </div>
            <div className="social-link3">
              <a href="discord.com/monsterbuds"></a>
            </div>
          </div>
          <div className="connectWallet" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {blockchain.account === "" ||
              blockchain.smartContract === null ? null : (<p>{truncate(blockchain.account, 5)}</p>)}
            <button className="button-49"
              onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                getData();
              }}
            >
              CONNECT
            </button>
          </div>
        </div>
      </div>


      {/*-------------------------ABSOLUTE OBJECTS ABOVE---------------------------- */}
      <div className="item1" id="item1">
        <div className="heroHeader">
          <h1 style={{ textAlign: "center" }}>Build a Legacy With<br />Conor Benn</h1>
          <div className="blueStripe1">

          </div>
        </div>
        <div className="heroSubText" style={{ marginTop: "15px", textAlign: "center", fontSize: "1.1rem", width: "75%", lineHeight: "1.2", display: "flex", justifyContent: 'center', alignItems: "center", flexDirection: "column-reverse" }}>
          <div id="heroBtnContainer" style={{ width: "50%", padding: "10px 20px"}}><a href="#item4"><button id="mintHeroBtn" style={{padding: "10px 20px", background: "transparent", border: "solid 1px #ffffffed", borderRadius: "15px", color: "white", fontSize: "16px"}}>Buy Here!</button></a></div>
          <p id="heroSubText" style={{ width: "80%"}}>Connecting Conor to his fans, BenNFT grants you exclusive access and unrivalled utility to his career.</p>
        </div>
      </div>
      <div id="item2">
        <div className="heroHeader2" >
          <h1 style={{ textAlign: "left", marginBottom: "10vh" }}>What is BenNFT?</h1>
          {/* <div className="blueStripe2" style={{ backgroundPosition: "top top" }}>

          </div> */}
        </div>
        <div >
          <p className="heroSubText2" style={{ textShadow: "0px 1px 15px #000", fontFamily: "Roboto", lineHeight: "1.5" }}>
            BenNFT is a 3D NFT project by undefeated professional boxer Conor Benn. Giving back to
            Conor’s fans, BenNFT grants holders exclusive access to his career and allows them to build a
            legacy alongside The Destroyer himself.
            BenNFT is a collection of 5,555 NFTs that utilises the technology to give you unmatched
            opportunities and benefits, including but not limited to: Fight Tickets, Press Conference Access,
            Meet & Greets, Live Training Sessions, Signed Memorabilia, 1-on-1 Calls, Virtual Hangouts, and
            Behind-The-Scenes access to Conor’s life.
          </p>
        </div>
      </div>
      <div id="item3">
        <div className="cardgrid_container">
          <h1 className="heroHeader" style={{ textAlign: "center", fontSize: "2.2rem", margin: "50px 25px" }}>Connecting Conor To His Fans </h1>
          {/* <p className="heroSubText" style={{ textAlign: "center", fontSize: "1.2rem", margin: "17.5px 25px" }}>-Exclusive access to his career-</p> */}
          <ul className="cards">
            <li className="cards_item">
              <div className="card">
                <div className="card_image"><img src={ticket} /></div>
                <div className="card_content">
                  <h2 className="card_title">Fight Tickets</h2>
                  <p className="card_text">Ringside and standard seats for NFT holders on upcoming fights </p>
                </div>
              </div>
            </li>
            <li className="cards_item">
              <div className="card">
                <div className="card_image"><img src={press} /></div>
                <div className="card_content">
                  <h2 className="card_title">Press Conference Access</h2>
                  <p className="card_text">Exclusive access to upcoming fight press conferences. </p>
                </div>
              </div>
            </li>
            <li className="cards_item">
              <div className="card">
                <div className="card_image"><img src={shake} /></div>
                <div className="card_content">
                  <h2 className="card_title">Meet & Greet</h2>
                  <p className="card_text">A meet and greet with Conor Benn for 5 people. </p>
                </div>
              </div>
            </li>
            <li className="cards_item">
              <div className="card">
                <div className="card_image"><img src={sessions} /></div>
                <div className="card_content">
                  <h2 className="card_title">Live Training Sessions</h2>
                  <p className="card_text">Behind the scenes access to a Conor Benn Training session. </p>
                </div>
              </div>
            </li>
            
            <li className="cards_item">
              <div className="card">
                <div className="card_image"><img src={boxingShorts} /></div>
                <div className="card_content">
                  <h2 className="card_title">Signed Memorabilia</h2>
                  <p className="card_text">Exclusive Merch only available to token holders</p>
                </div>
              </div>
            </li>
            <li className="cards_item">
              <div className="card">
                <div className="card_image"><img src={plotter} /></div>
                <div className="card_content">
                  <h2 className="card_title">1-on-1 Calls</h2>
                  <p className="card_text">50 prints up for grabs from the world famouse artits, The Connor Brothers</p>
                </div>
              </div>
            </li>
            <li className="cards_item">
              <div className="card">
                <div className="card_image"><img src={robe} /></div>
                <div className="card_content">
                  <h2 className="card_title">Virtual Hangouts</h2>
                  <p className="card_text">1 lucky token holder will win Conor’s actual ring walk robe from an upcoming fight</p>
                </div>
              </div>
            </li>
            <li className="cards_item">
              <div className="card">
                <div className="card_image"><img src={boxingGloves} /></div>
                <div className="card_content">
                  <h2 className="card_title">Behind-The-Scenes Access to Conor's Life</h2>
                  <p className="card_text">1 lucky token holder will win the gloves that Conor uses in his upcoming fight. </p>
                </div>
              </div>
            </li>
          </ul>
        </div>


        <div id="faq" className="heroHeader" style={{ textAlign: "center", margin: "50px" }} >
          <h1 style={{ textAlign: "center", margin: "50px" }}>FAQ:</h1>
          <div className="blueStripe1" style={{ backgroundPosition: "top top" }}>

          </div>
        </div>
        <div style={{ marginBottom: "50px" }} id="accordionContainer">
          <button className="accordion">What are the benefits of holding a BenNFT?</button>
          <div className="panel">
            <p>BenNFTs grant you exclusive access to Conor and his legacy. These NFTs give you unmatched
opportunities and benefits, including but not limited to: Fight Tickets, Press Conference Access,
Meet & Greets, Live Training Sessions, Signed Memorabilia, 1-on-1 Calls, Virtual Hangouts, and
Behind-The-Scenes access to Conor’s life.
</p>
          </div>

          <button className="accordion">How much do they cost?</button>
          <div className="panel">
            <p>There are two pricing options for BenNFTs. Early Allow List (Presale) can purchase a
BenNFT for £200 GBP and the Public Sale can purchase a BenNFT for £250 GBP.</p>
          </div>

          <button className="accordion"> What is the Allow List and how can I get on it?</button>
          <div className="panel">
            <p>The Allow List is to reward our early supporters of Conor and the project. The Allow List can
purchase a BenNFT for 20% off (£200 GBP) and has a 3 hour purchase period before the
Public Sale. <br />
You can get on the Allow List by joining our Discord, engaging with the community, playing
weekly games, and interacting with us on Twitter.

</p>
          </div>

          <button className="accordion">Will each NFT be unique?</button>
          <div className="panel">
            <p>Yes, every single NFT will be unique with traits. There will also be rares and special 1/1 NFTs
that will offer even more utility than the rest.</p>
          </div>

          <button className="accordion">How can I stay up to date?</button>
          <div className="panel">
            <p>Stay up to date with the latest news and announcements by joining our Discord and following us
on Twitter.
</p>
          </div>

          <button className="accordion">Where can I buy a BenNFT if I miss the sale?
</button>
          <div className="panel">
            <p>BenNFTs will be available for purchase on a secondary market such as Opensea.</p>
          </div>

        </div>
      </div>
// TIMELINE START
<h1 style={{ textAlign: "center", margin: "50px", color: "#ffffffed", fontSize: "35px", fontFamily: "Orbitron" }}>The BenNFT Roadmap</h1>
<ul className="timeline">

	<li>
		<div className="direction-r">
			<div className="flag-wrapper">
				<span className="flag">LAUNCH</span>
			</div>
			<div className="desc">Launch Discord/Website <br /><br />Artwork Previews<br /><br />Open Allowlist</div>
		</div>
	</li>
  
	<li>
		<div className="direction-l">
			<div className="flag-wrapper">
				<span className="flag">25% Minted</span>
				<span className="time-wrapper"><span className="time">Raffle</span></span>
			</div>
			<div className="desc">Raffle for The Connor Brothers art</div>
		</div>
	</li>

  <li>
		<div className="direction-r">
			<div className="flag-wrapper">
				<span className="flag">33% Minted</span>
				<span className="time-wrapper"><span className="time">Boots</span></span>
			</div>
			<div className="desc">Raffle for Conor's Boxing Boots he used in a match</div>
		</div>
	</li>

	<li>
		<div className="direction-l">
			<div className="flag-wrapper">
				<span className="flag">50% Minted</span>
				<span className="time-wrapper"><span className="time">Community Content</span></span>
			</div>
			<div className="desc">AMA with Conor Benn<br /><br />BTS access to watch training session</div>
		</div>
	</li>

  <li>
		<div className="direction-r">
			<div className="flag-wrapper">
				<span className="flag">75% Minted</span>
				<span className="time-wrapper"><span className="time">Raffle</span></span>
			</div>
			<div className="desc">Snapshot for standard seat raffle</div>
		</div>
	</li>

  <li>
		<div className="direction-l">
			<div className="flag-wrapper">
				<span className="flag">100% Minted</span>
				<span className="time-wrapper"><span className="time">Raffles</span></span>
			</div>
			<div className="desc">Snapshot for Conor's robe raffle<br /><br />Snapshot for Conor's gloves raffle<br /><br />Raffle for ringside seats</div>
		</div>
	</li>

  <li>
		<div className="direction-r">
			<div className="flag-wrapper">
				<span className="flag">Winners Drawn</span>
			</div>
			<div className="desc">The winners from all snapshots will be revealed.</div>
		</div>
	</li>

  <li>
		<div className="direction-l">
			<div className="flag-wrapper">
				<span className="flag">Additional Utility</span>
			</div>
			<div className="desc">More TBD and upcoming fight.</div>
		</div>
	</li>
  
</ul>
// TIMELINE END



      <h1 className="heroHeader" style={{zIndex: "100", textAlign: "center", margin: "50px"}}>Mint Now</h1>
      <div id="item4">
        <div className="heroHeader" >
          {/* <s.TextTitle
                  style={{
                    textAlign: "center",
                    fontSize: 50,
                    fontWeight: "bold",
                    color: "#F3164A",
                  }}
                >
                  <span style={{ color: "white", fontSize: "15px", lineHeight: "1" }}>*mint data not accurate until wallet is connected, we're at over 1400*</span> <br />
                  {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                </s.TextTitle> */}

          <>
            <div className="supplyContainer">
              
              <div className="supplyLeft">
                Supply
              </div>
              <div className="supplyRight">
                {data.totalSupply} / {CONFIG.MAX_SUPPLY}
              </div>
            </div>

            <div className="quantityContainer">
              <div className="quantityLeft">
                Price
              </div>
              <div className="quantityRight">
              £ 200 GBP
              </div>
            </div>
            {blockchain.account === "" ||
              blockchain.smartContract === null ? (
              <s.Container ai={"center"} jc={"center"}>
                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                    fontFamily: "Roboto"
                  }}
                >
                  Connect to the {CONFIG.NETWORK.NAME} network
                </s.TextDescription>
                {/* <StyledButton
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        CONNECT
                      </StyledButton> */}
                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "#ffffffed",
                    padding: "15px 40px",
                    borderRadius: "30px",
                    fontSize: "24px",
                    fontWeight: "800",
                    fontFamily: "Orbitron"
                  }}
                >
                  Quantity
                </s.TextDescription>

                <s.Container ai={"center"} jc={"center"} fd={"row"}>

                  <StyledRoundButton
                    style={{
                      background: "#ffffffed",
                      color: "#000",
                      fontSize: "40px",
                      transform: "scale(1.2)",
                      border: "none",
                      fontWeight: "600",
                      padding: "0px 3px 3px 0px",
                    }}
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      decrementMintAmount();
                    }}
                  >
                    -
                  </StyledRoundButton>
                  <s.SpacerMedium />
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "#000",
                      background: "#ffffffed",
                      padding: "0 40px",
                      borderRadius: "30px",
                      fontSize: "34px",
                      fontWeight: "800",
                    }}
                  >
                    {mintAmount}
                  </s.TextDescription>
                  <s.SpacerMedium />
                  <StyledRoundButton
                    style={{
                      lineHeight: 0.4,
                      background: "#ffffffed",
                      color: "#000",
                      fontSize: "40px",
                      transform: "scale(1.2)",
                      border: "none",
                      fontWeight: "600",
                    }}
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      incrementMintAmount();
                    }}
                  >
                    +
                  </StyledRoundButton>
                </s.Container>
                <s.Container ai={"center"} jc={"center"} fd={"row"} style={{ marginTop: "25px" }}>
                  <StyledButton id="buyButton1"
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      claimNFTs();
                      getData();
                    }}
                  >
                    {claimingNft ? "MINTING" : "Buy w/ Wallet"}
                  </StyledButton>

                  <StyledButton id="buyButton2"
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      claimNFTs();
                      getData();
                    }}
                  >
                    {claimingNft ? "MINTING" : "Buy w/ Credit Card"}
                  </StyledButton>
                  <div className="heroSubText" style={{ marginTop: "30.5vh", padding: "10px 0px", position: "absolute" }}>
                    
                  </div>
                </s.Container>
<h1 style={{ textAlign: "center", fontSize: "25px", marginTop: "25px" }}> Ends In:</h1>
                    <div id="countdown"></div>

                {blockchain.errorMsg !== "" ? (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {blockchain.errorMsg}
                    </s.TextDescription>
                  </>
                ) : null}
              </s.Container>
            ) : (
              <>
<s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "#ffffffed",
                    padding: "15px 40px",
                    borderRadius: "30px",
                    fontSize: "24px",
                    fontWeight: "800",
                    fontFamily: "Orbitron"
                  }}
                >
                  Quantity
                </s.TextDescription>
                <s.Container ai={"center"} jc={"center"} fd={"row"}>
                  <StyledRoundButton
                    style={{
                      background: "#ffffffed",
                      color: "#000",
                      fontSize: "40px",
                      transform: "scale(1.2)",
                      border: "none",
                      fontWeight: "600",
                      padding: "0px 3px 3px 0px",
                    }}
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      decrementMintAmount();
                    }}
                  >
                    -
                  </StyledRoundButton>
                  <s.SpacerMedium />
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "#000",
                      background: "#ffffffed",
                      padding: "0 40px",
                      borderRadius: "30px",
                      fontSize: "34px",
                      fontWeight: "800",
                    }}
                  >
                    {mintAmount}
                  </s.TextDescription>
                  <s.SpacerMedium />
                  <StyledRoundButton
                    style={{
                      lineHeight: 0.4,
                      background: "#ffffffed",
                      color: "#000",
                      fontSize: "40px",
                      transform: "scale(1.2)",
                      border: "none",
                      fontWeight: "600",
                    }}
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      incrementMintAmount();
                    }}
                  >
                    +
                  </StyledRoundButton>
                </s.Container>
                <s.Container ai={"center"} jc={"center"} fd={"row"} style={{ marginTop: "25px" }}>
                  <StyledButton id="buyButton1"
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      claimNFTs();
                      getData();
                    }}
                  >
                    {claimingNft ? "MINTING" : "Buy w/ Wallet"}
                  </StyledButton>

                  <StyledButton id="buyButton2"
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      claimNFTs();
                      getData();
                    }}
                  >
                    {claimingNft ? "MINTING" : "Buy w/ Credit Card"}
                  </StyledButton>
                  <div className="heroSubText" style={{ marginTop: "42.5vh", padding: "10px 0px", position: "absolute", opacity: "1" }}>
                    <h1 style={{ textAlign: "center" }}> Ends In:</h1>
                    <div id="countdown"></div>
                  </div>

                </s.Container>

              </>
            )}

          </>

        </div>


      </div>
      <footer className="site-footer" style={{ display: "flex", justifyContent: "center", background: "transparent", zIndex: "200", boxShadow: "0px -5px 60px 40px #000000ad", marginTop: "10vh" }}>

        <div className="container" style={{ display: "flex", justifyContent: "center", width: "50%" }}>

          <div className="row" style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "space-evenly", width: "100%" }}>
            <div>
            <h2 style={{ display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "space-evenly", width: "100%", fontSize: "40px", fontFamily: "Orbitron" }}>BenNFT</h2>
            </div>


            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div className="col-xs-6 col-md-3" style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", margin: "25px 0px"  }}>
              <h6>Links</h6>
              <ul className="footer-links">
                <li><a href="http://scanfcode.com/category/c-language/">C</a></li>
                <li><a href="http://scanfcode.com/category/front-end-development/">UI Design</a></li>
                <li><a href="http://scanfcode.com/category/back-end-development/">PHP</a></li>
                <li><a href="http://scanfcode.com/category/java-programming-language/">Java</a></li>
                <li><a href="http://scanfcode.com/category/android/">Android</a></li>
                <li><a href="http://scanfcode.com/category/templates/">Templates</a></li>
              </ul>
            </div>

            <div className="col-xs-6 col-md-3" style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", margin: "25px 0px" }}>
              <h6>Community</h6>
              <ul className="footer-links">
                <li><a href="http://scanfcode.com/about/">About Us</a></li>
                <li><a href="http://scanfcode.com/contact/">Contact Us</a></li>
                <li><a href="http://scanfcode.com/contribute-at-scanfcode/">Contribute</a></li>
                <li><a href="http://scanfcode.com/privacy-policy/">Privacy Policy</a></li>
                <li><a href="http://scanfcode.com/sitemap/">Sitemap</a></li>
              </ul>
            </div>
</div>
          </div>

        </div>

        <div className="container containerMobile">

          <div className="row">

            <div className="col-sm-12 col-md-6">
              <h6>Sign up for updates!</h6>
            </div>

            <div className="col-xs-6 col-md-3">

            </div>

            <div className="col-xs-6 col-md-3">
              <div className="ml-embedded" data-form="kTbFbe"></div>
            </div>

          </div>

        </div>

      </footer>

    </s.Screen>
  );
}

export default App;

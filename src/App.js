import React, { useEffect, useState, useRef } from "react";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
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
import nftImage1 from "./styles/nftimage1.png";
import nftImage2 from "./styles/nftimage2.png";
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
    let cost = ethPriceGBP;
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
    let calcPrice = (200 / (price.result.ethusd * .8756) * 1000000000000000000);
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

            <h1 className="ml14" style={{ display: "flex", justifyContent: "center" }}>
              <span className="text-wrapper">
                <span className="letters">BenNFT</span>
                <span className="line"></span>
              </span>
            </h1>

          </div>
          <div className="site-links">
            <div className="site-link1">
              <a href="#item2">About</a>

            </div>
            <div className="site-link1">
              <a href="#item3">Utility</a>
            </div>
            <div className="site-link1">
              <a href="#faq">FAQ</a>
            </div>
            <div className="site-link1">
              <a href="#item4">Buy Now</a>
            </div>
            <div className="site-link1">
              <a href="https://bennft.myshopify.com/">Store</a>
            </div>
          </div>
          <div className="socials">
            <a href="https://instagram.com/BenNFT">
              <div className="social-link1">

              </div>
            </a>
            <a href="https://twitter.com/BenNFT">
              <div className="social-link2">

              </div>
            </a>
            <a href="https://discord.com/BenNFT">
              <div className="social-link3">

              </div>
            </a>
          </div>
          <div className="connectWallet" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {blockchain.account === "" ||
              blockchain.smartContract === null ? null : (<p style={{ fontFamily: "Open Sans" }}>{truncate(blockchain.account, 5)}</p>)}
            <button className="button-49"
              onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                getData();
              }}
            >
              CONNECT WALLET
            </button>
          </div>
        </div>
      </div>


      {/*-------------------------ABSOLUTE OBJECTS ABOVE---------------------------- */}
      <div className="item1" id="item1">
        <div className="open">
          <span className="cls" style={{ zIndex: "1000" }}></span>
          <span>
            <ul className="sub-menu ">
              <li>
                <a href="#item2" title="about">About</a>
              </li>
              <li>
                <a href="#item3" title="skills">Utilities</a>
              </li>
              <li>
                <a href="#faq" title="jobs">FAQ</a>
              </li>
              <li>
                <a href="#item4" title="contact">Buy Now</a>
              </li>
              <li>
                <a href="https://bennft.myshopify.com/" title="contact">Store</a>
              </li>
            </ul>
          </span>
          <span className="cls"></span>
        </div>
        <div className="heroContainer">
          <div className="heroHeader">
            <h1 style={{ textAlign: "center", letterSpacing: ".2rem", lineHeight: "1.2",fontSize: "2.3rem" }}>Build a Legacy With<br />Conor Benn</h1>
          </div>
          <div className="heroSubText" style={{ marginTop: "35px", textAlign: "center", fontSize: "1.1rem", width: "100%", lineHeight: "1.2", display: "flex", justifyContent: 'center', alignItems: "center", flexDirection: "column" }}>
            <p id="heroSubText" style={{ width: "70%", letterSpacing: ".1rem", lineHeight: "1.2", fontFamily: "Open Sans" }}>Connecting Conor to his fans, BenNFT grants you exclusive access and unrivalled utility to his career.</p>
            <div id="heroBtnContainer" style={{ width: "40%", padding: "10px 20px", marginTop: "25px" }}>
              <a href="#item4" style={{ height: "40px" }}>
                <button id="mintHeroBtn" style={{ width: "100%", padding: "10px 20px", background: "rgba(255, 227, 0, 0.08)", border: "solid 1px #ffe300", borderRadius: "15px", color: "#cacaca", fontSize: "23px", fontFamily: "Open Sans", fontWeight: "600" }}>Buy Now!</button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div id="item2">
        <div className="heroHeader2" >
          <h1 style={{ textAlign: "left", marginBottom: "1vh", fontWeight: "800",fontSize: "2.3rem", }}>What is BenNFT?</h1>
          {/* <div className="blueStripe2" style={{ backgroundPosition: "top top" }}>

          </div> */}
        </div>
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column"}} >
          <p className="heroSubText2" style={{ textShadow: "0px 1px 15px #000", fontFamily: "Open Sans", lineHeight: "1.5" }}>
            BenNFT is a 3D NFT project by undefeated professional boxer <span style={{color: "#ffe300"}}>Conor Benn.</span> Giving back to
            Conors fans, BenNFT grants holders <span style={{color: "#ffe300"}}>exclusive access to his career </span>and allows them to build a
            legacy alongside The Destroyer himself.<br /><br />
            BenNFT is a collection of <b style={{textDecoration: "underline",color: "#ffe300"}}>5,555 NFTs</b> that utilises blockchain technology to give you unmatched
            opportunities and benefits. <br /><br />
            Including but not limited to: Fight Tickets, Press Conference Access,
            Meet & Greets, Live Training Sessions, Signed Memorabilia, 1-on-1 Calls, Virtual Hangouts, and
            Behind-The-Scenes access to Conor’s life.
            <div style={{display: "flex", justifyContent: "center", flexDirection: "row", width: "100%"}} >
              <img className="nftImage1" src={nftImage1}></img>
              <img className="nftImage2" src={nftImage2}></img>
            </div>
          </p>
          
        </div>
      </div>
      <div id="item3">
        <div className="cardgrid_container">
          <h1 className="heroHeader" style={{ textAlign: "center", fontSize: "2.3rem", margin: "50px 25px" }}>Connecting Conor To His Fans </h1>
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
                  <h2 className="card_title">B.T.S. Access to Conor's Life</h2>
                  <p className="card_text">Get exclusive access to Conor's career and personal life.</p>
                </div>
              </div>
            </li>
            <li className="cards_item">
              <div className="card">
                <div className="card_image"><img src={plotter} /></div>
                <div className="card_content">
                  <h2 className="card_title">IRL Events</h2>
                  <p className="card_text">Special experiences, q&a sessions & more only for Holders.</p>
                </div>
              </div>
            </li>
            <li className="cards_item">
              <div className="card">
                <div className="card_image"><img src={boxingShorts} /></div>
                <div className="card_content">
                  <h2 className="card_title">Monthly Prizes</h2>
                  <p className="card_text">Cash prizes and other surprises exclusively for BenNFT holders, every month.</p>
                </div>
              </div>
            </li>
          </ul>
        </div>



      </div>




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
          <h1 style={{ textAlign: "center", marginBottom: "10vh", fontWeight: "800", fontFamily: "Orbitron", fontSize: "2.3rem", color: "#ffe300" }}>Buy Here</h1>
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
                    fontFamily: "Open Sans"
                  }}
                >
                  Error: Connect to the {CONFIG.NETWORK.NAME} network
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
                    color: "#cacaca",
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
                      background: "#cacaca",
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
                      background: "#cacaca",
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
                      background: "#cacaca",
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
                    {claimingNft ? "MINTING" : "Buy With Wallet"}
                  </StyledButton>

                  <CrossmintPayButton id="buyButton2" style={{ borderRadius: "30px" }}
                  collectionTitle="MonsterBuds x LittyUp"
                  collectionDescription="Snoop has partnered with LittyUp and MonsterBuds to build positive interactions between all of our fans and across many aspects including IRL, online, gaming, and music."
                  collectionPhoto="https://gateway.pinata.cloud/ipfs/QmepxrN2HsYmQz6RqtSyPDoy2fFpA9CVBkR44aTpeRNMo4/snoop_higher_conciousness.png"
                  clientId="a012ba57-a72d-4497-86ef-85efd51a5b6e"
                  mintConfig={{ "type": "erc-721", "totalPrice": JSON.stringify(mintAmount * 0.065), "quantity": mintAmount }}
                />
                  <div className="heroSubText" style={{ marginTop: "30.5vh", padding: "10px 0px", position: "absolute" }}>

                  </div>
                </s.Container>
                <div className="fancy" style={{margin: "30px 25px"}}>
                  <span>Ends In:</span>
                </div>
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
                    color: "#cacaca",
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
                      background: "#cacaca",
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
                      background: "#cacaca",
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
                      background: "#cacaca",
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
                    {claimingNft ? "MINTING" : "Buy With Wallet"}
                  </StyledButton>

                  <CrossmintPayButton id="buyButton2" style={{ borderRadius: "30px" }}
                  collectionTitle="MonsterBuds x LittyUp"
                  collectionDescription="Snoop has partnered with LittyUp and MonsterBuds to build positive interactions between all of our fans and across many aspects including IRL, online, gaming, and music."
                  collectionPhoto="https://gateway.pinata.cloud/ipfs/QmepxrN2HsYmQz6RqtSyPDoy2fFpA9CVBkR44aTpeRNMo4/snoop_higher_conciousness.png"
                  clientId="a012ba57-a72d-4497-86ef-85efd51a5b6e"
                  mintConfig={{ "type": "erc-721", "totalPrice": JSON.stringify(mintAmount * 0.065), "quantity": mintAmount }}
                />
                  

                </s.Container>
                <div className="fancy" style={{margin: "30px 25px"}}>
                  <span>Ends In:</span>
                </div>
                <div id="countdown"></div>
              </>
            )}

          </>

        </div>


      </div>
      <div id="faq">
        <div className="heroHeader" style={{ textAlign: "center", margin: "0px" }} >
          <h1 style={{ textAlign: "center", marginTop: "50px" }}>FAQ:</h1>

        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ marginBottom: "50px" }} id="accordionContainer">

            <button className="accordion">What is an NFT? And why use them for this?</button>
            <div className="panel">
              <p>NFTs, simply put, are a small part of ownership verification, for the distributed internet known as the blockchain.
                they can be bought and sold based on what people are willing to give for the value locked into them, that can be: membership, giveaways, purchases, investments, anything.
                <br /><br />
                We're using NFTs and other blockchain technologies because the capability to give back to the community we build, verify giveaways, and otherwise be transparent in what we're building here at <i>BenNFT</i>.
              </p>
            </div>

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
      </div>
      {/* // TIMELINE START */}
      <div id="timelineContainer">
        <h1 style={{ textAlign: "center", margin: "50px", color: "#cacaca", fontSize: "35px", fontFamily: "Orbitron", fontWeight: "900" }}>The BenNFT Roadmap</h1>
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
                <span className="time-wrapper"><span className="time">Content</span></span>
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
      </div>
      {/* // TIMELINE END */}
      <footer className="site-footer" style={{ display: "flex", justifyContent: "center", background: "transparent", zIndex: "10", boxShadow: "0px -5px 60px 40px #000000ad" }}>

        <div className="container" style={{ display: "flex", justifyContent: "center", width: "50%" }}>

          <div className="row" style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "space-evenly", width: "100%" }}>
            <div>
              <h2 style={{ display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "space-evenly", width: "100%", fontSize: "40px", fontFamily: "Orbitron" }}>BenNFT</h2>
            </div>


            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>

              <div className="col-xs-6 col-md-3" style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", margin: "25px 0px" }}>
                <h6>Community</h6>
                <ul className="footer-links">
                  <li><a href="https://discord.gg/bennft">Talk to us on discord!</a></li>
                  <li><a href="https://www.instagram.com/conorbennofficial/">Conor's Instagram</a></li>
                  <li><a href="http://scanfcode.com/sitemap/">Sitemap</a></li>
                </ul>
              </div>

            </div>

            <p style={{ textAlign: "center" }}>Copyright © 2022 BenNFT. All Rights Reserved </p>
          </div>

        </div>


      </footer>

    </s.Screen>
  );
}

export default App;

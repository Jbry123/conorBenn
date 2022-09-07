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
  width: 30px;
  height: 30px;
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
    WEI_COST: 150000000000000000,
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
        <div className="logocontainer" style={{ marginBottom: "25px", fontSize: "60px", fontFamily: "Orbitron", color: "white" }}>
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
            <h1 class="ml14">
              <span class="text-wrapper">
                <span class="letters">BenNFT</span>
                <span class="line"></span>
              </span>
            </h1>
          </div>
          <div className="site-links">
            <div className="site-link1">
              <a href="#item1">Learn More</a>

            </div>
            <div className="site-link1">
              <a href="#item2">Utility</a>
            </div>
            <div className="site-link1">
              <a href="#item3">Mint Now</a>
            </div>
            <div className="site-link1">
              <a href="#item4">FAQ</a>
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

      <div className="heroHeader">
        <h1 style={{ textAlign: "center" }}>-Undeafeated Pro Boxer-<br />Conor Benn</h1>
        <div className="blueStripe1">

        </div>
      </div>
      <div className="heroSubText" style={{ marginTop: "5px" }}>
        <p>NFT Brand With Massive Utility</p>
      </div>


      <div className="heroHeader2" >
        <h1 style={{ textAlign: "left" }}>What is BenNFT?</h1>
        <div className="blueStripe2" style={{ backgroundPosition: "top top" }}>

        </div>
      </div>
      <div className="heroSubText2">
        <p style={{ textShadow: "0px 1px 15px #000" }}>Launched to give back to his loyal fans, allow them to own a part of his legacy and gain access to exclusive and unrivaled utility.
          BenNFT is a 3D NFT project launching its initial collection with 5,555 NFTs. Being a part of BenNFT means getting access to a community of boxing fans, AMAs with industry insiders, AMAs with Conor, the opportunity to win fight memorabilia, and more.
          What sets this apart from other boxing or athlete-related projects? Conor is building this to be an unprecedented Web3 brand and bringing you along for the ride.</p>
      </div>

      <div className="heroHeader" >
        <h1 style={{ textAlign: "center", marginBottom: "25px" }}>FAQ:</h1>
        <div className="blueStripe1" style={{ backgroundPosition: "top top" }}>

        </div>
      </div>
      <button class="accordion">Section 1</button>
      <div class="panel">
        <p>Lorem ipsum...</p>
      </div>

      <button class="accordion">Section 2</button>
      <div class="panel">
        <p>Lorem ipsum...</p>
      </div>

      <button class="accordion">Section 3</button>
      <div class="panel">
        <p>Lorem ipsum...</p>
      </div>
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
                      $XXX
                    </div>
                  </div>
                  {blockchain.account === "" ||
                    blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
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
                          color: "#fff",
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
                            background: "#fff",
                            color: "#000",
                            fontSize: "40px",
                            transform: "scale(1.5)",
                            border: "none",
                            fontWeight: "600",
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
                            background: "#fff",
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
                            background: "#fff",
                            color: "#000",
                            fontSize: "40px",
                            transform: "scale(1.5)",
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
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
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
                      </s.Container>

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

                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                          style={{
                            background: "#fff",
                            color: "#000",
                            fontSize: "40px",
                            transform: "scale(1.5)",
                            border: "none",
                            fontWeight: "600",
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
                            background: "#fff",
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
                            background: "#fff",
                            color: "#000",
                            fontSize: "40px",
                            transform: "scale(1.5)",
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
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
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
                      </s.Container>
                    </>
                  )}
                </>
              </div>
              <div className="heroSubText" style={{ marginTop: "10.5vh", padding: "10px 0px" }}>
                <h1 style={{ textAlign: "center" }}> Ends In:</h1>
                <div id="countdown"></div>
              </div>


              <div className="cardgrid_container">
                <h1 className="heroHeader">BenNFT Utilities Connect Conor Directly To His Fans!</h1>
                <p className="heroSubText" style={{ textAlign: "center", fontSize: "1.2rem", margin: "17.5px 25px" }}>-Exclusive access to his career-</p>
                <ul className="cards">
                  <li className="cards_item">
                    <div className="card">
                      <div className="card_image"><img src={ticket} /></div>
                      <div className="card_content">
                        <h2 className="card_title">Tickets to live fights</h2>
                        <p className="card_text">Ringside and standard seats will be available for NFT holders on upcoming fights </p>
                      </div>
                    </div>
                  </li>
                  <li className="cards_item">
                    <div className="card">
                      <div className="card_image"><img src={shake} /></div>
                      <div className="card_content">
                        <h2 className="card_title">Meet & Greet</h2>
                        <p className="card_text">Ringside and standard seats will be available for NFT holders on upcoming fights </p>
                      </div>
                    </div>
                  </li>
                  <li className="cards_item">
                    <div className="card">
                      <div className="card_image"><img src={sessions} /></div>
                      <div className="card_content">
                        <h2 className="card_title">Watch Training Sessions</h2>
                        <p className="card_text">Ringside and standard seats will be available for NFT holders on upcoming fights </p>
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
                      <div className="card_image"><img src={boxingShorts} /></div>
                      <div className="card_content">
                        <h2 className="card_title">Exclusive Merch</h2>
                        <p className="card_text">Exclusive merchandise only available to token holders</p>
                      </div>
                    </div>
                  </li>
                  <li className="cards_item">
                    <div className="card">
                      <div className="card_image"><img src={plotter} /></div>
                      <div className="card_content">
                        <h2 className="card_title">Connor Brothers Prints</h2>
                        <p className="card_text">50 prints up for grabs from the world famouse artits, The Connor Brothers</p>
                      </div>
                    </div>
                  </li>
                  <li className="cards_item">
                    <div className="card">
                      <div className="card_image"><img src={robe} /></div>
                      <div className="card_content">
                        <h2 className="card_title">Conor’s Robe</h2>
                        <p className="card_text">1 lucky token holder will win Conor’s actual ring walk robe from an upcoming fight</p>
                      </div>
                    </div>
                  </li>
                  <li className="cards_item">
                    <div className="card">
                      <div className="card_image"><img src={boxingGloves} /></div>
                      <div className="card_content">
                        <h2 className="card_title">Conor’s Gloves</h2>
                        <p className="card_text">1 lucky token holder will win the gloves that Conor uses in his upcoming fight. </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>











    </s.Screen>
  );
}

export default App;

import {useEffect, useState} from 'react'
import './App.css'
import {ConnectButton, Modal} from "web3uikit";
import { useMoralisWeb3Api, useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import logo from "./images/Moralis.png";
import Coin from "./components/Coin";
import {abouts} from "./abouts";

function App() {
    const [btc, setBtc] = useState(80);
    const [eth, setEth] = useState(30);
    const [link, setLink] = useState(60);

    const [modalToken, setModalToken] = useState("");
    const [modalPrice, setModalPrice] = useState("");

    const contractProcessor = useWeb3ExecuteFunction();
    const Web3Api = useMoralisWeb3Api();
    const { Moralis, isAuthenticated , isInitialized } = useMoralis();

    const calculateVotePercentage = async (token: string): Promise<number> => {
        const Votes = Moralis.Object.extend("Votes");

        const query = new Moralis.Query(Votes);
        query.equalTo("coin", token);
        query.descending("createdAt");

        const results = await query.first();

        if (! results) return 0;

        let up = Number(results!.attributes.up);
        let down = Number(results!.attributes.down);

        return Math.round(up/(up+down)*100);
    }

    useEffect(() => {
        // Initialize percentages
        if (isInitialized) {
            calculateVotePercentage('BTC')
                .then((percentage) => setBtc(percentage));
            calculateVotePercentage('ETH')
                .then((percentage) => setEth(percentage));
            calculateVotePercentage('LINK')
                .then((percentage) => setLink(percentage));
        }

        // Live update
        async function createLiveQuery() {
            const query = new Moralis.Query("Votes");
            const subscription = await query.subscribe();
            subscription.on('update', (object) => {
                if (object.attributes.coin == "BTC") {
                    calculateVotePercentage(object.attributes.coin)
                        .then((percentage) => setBtc(percentage));
                } else if (object.attributes.coin == "ETH") {
                    calculateVotePercentage(object.attributes.coin)
                        .then((percentage) => setEth(percentage));
                } else if (object.attributes.coin == "LINK") {
                    calculateVotePercentage(object.attributes.coin)
                        .then((percentage) => setLink(percentage));
                }
            });
        }

        createLiveQuery();
    }, [isInitialized])

    const displayInfo = async (token: string) => {
        // Retrieve price
        const price = await Web3Api.token.getTokenPrice({
            address: abouts.find(x => x.token == token)!.address
        })

        setModalPrice(price.usdPrice.toFixed(2));
        setModalToken(token);
    }

    const vote = async (token: string, up: boolean) => {
        if (! isAuthenticated) {
            alert("Authenicate to Vote");
            return;
        }

        const options = {
            contractAddress: import.meta.env.VITE_SMARTCONTRACT_ADDRESS,
            functionName: "vote",
            abi: [
                {
                    "inputs":[
                        {
                            "internalType":"string",
                            "name":"_coin",
                            "type":"string"
                        },
                        {
                            "internalType":"bool",
                            "name":"_vote",
                            "type":"bool"
                        }
                    ],
                    "name":"vote",
                    "outputs":[

                    ],
                    "stateMutability":"nonpayable",
                    "type":"function"
                }
            ],
            params: {
                _coin: token,
                _vote: up,
            },
        }

        await contractProcessor.fetch({
            params: options,
            onSuccess: () => {
                console.log("vote succesful");
            },
            onError: (error) => {
                console.log(error);
                alert(error.message)
            }
        });
    }

    return (
        <>
            <div className="header">
                <div className="logo">
                    <img src={logo} alt="logo" height="50px"/>
                    Sentiment
                </div>
                <ConnectButton/>
            </div>
            <div className="instructions">
                Where do you think these tokens are going? Up or Down?
            </div>
            <div className="list">
                <Coin
                    percentage={btc}
                    token={"BTC"}
                    onInfo={displayInfo}
                    onVote={vote}
                />
                <Coin
                    percentage={eth}
                    token={"ETH"}
                    onInfo={displayInfo}
                    onVote={vote}
                />
                <Coin
                    percentage={link}
                    token={"LINK"}
                    onInfo={displayInfo}
                    onVote={vote}
                />
            </div>

            <Modal
                isVisible={modalToken != ""}
                onCloseButtonPressed={() => setModalToken("")}
                hasFooter={false}
                title={modalToken}
            >
                <div>
                    <span style={{ color: "white" }}>{`Price: `}</span>
                    {modalPrice}$
                </div>
                <div>
                    <span style={{ color: "white" }}>{`About`}</span>
                </div>
                <div>
                    {modalToken && abouts[abouts.findIndex((x) => x.token === modalToken)].about}
                </div>

            </Modal>
        </>
    )
}

export default App

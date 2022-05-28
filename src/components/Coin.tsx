import React from "react";
import "./Coin.css";
import { Button } from "web3uikit";

interface CoinProps {
    token: string;
    percentage: number;
    onInfo: (token: string) => void;
    onVote: (token: string, up: boolean) => void;
}

const Coin = ({ token, percentage, onInfo, onVote }: CoinProps) => {
    const color = percentage < 50 ? "#c43d08" : "green";

    return (
        <>
            <div>
                <div className="token">{token}</div>
                <div className="circle" style={{ boxShadow: `0 0 20px ${color}` }}>
                    <div
                        className="wave"
                        style={{
                            marginTop: `${100 - percentage}%`,
                            boxShadow: `0 0 20px ${color}`,
                            backgroundColor: color,
                        }}
                    ></div>
                    <div className="percentage">{percentage}%</div>
                </div>
                <div className="votes">
                    <Button
                        onClick={() => onInfo(token)}
                        text="INFO"
                        theme="translucent"
                        type="button"
                    />
                    <Button
                        onClick={() => onVote(token, true)}
                        text="Up"
                        theme="primary"
                        type="button"
                    />

                    <Button
                        color="red"
                        onClick={() => onVote(token, false)}
                        text="Down"
                        theme="colored"
                        type="button"
                    />
                </div>
            </div>
        </>
    );
}

export default Coin;
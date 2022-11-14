import React, { Component } from 'react';
import { ethers } from 'ethers';

import Greeter from '../../artifacts/contracts/SimpleToken.sol/SimpleToken.json';

// 合约的部署地址
const contractAddr = '0x9C66A34Cfa1B6a259f929C073E3A07447a1b3344';

export default class GreeterComponent extends Component {
    state = {
        value: undefined,
    };

    requestAccount = async () => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    };

    async _getTokenBalance(to) {
        if (typeof window.ethereum !== 'undefined') {
            // request access to the user's MetaMask account
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log({ account });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddr, Greeter.abi, signer);
            contract.balanceOf(account).then(data => {
                console.log('balance: ', data.toString());
                // eth 转换, wei => ether
                // const ethBalanceStr2 = ethers.utils.formatUnits(ethers.BigNumber.from(data.toString),'ether');

                this.setState({
                    value: data.toString(),
                });
            });
        }
    }

    // call the smart contract, read the current greeting value
    getTokenBalance = () => {
        const to = this.input1.value;
        this._getTokenBalance(to).then(d => {
            return d;
        });
    };

    async _sendToken(to, value) {
        if (typeof window.ethereum !== 'undefined') {
            await this.requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddr, Greeter.abi, signer);
            contract.transfer(to, value).then(tx => console.log('tx: ', tx));
        }
    }

    // call the smart contract, send an update
    sendToken = () => {
        // const { input1 } = this.refs;

        const to = this.input1.value;
        const value = this.input2.value;
        if (!to || !value || value === undefined || to === undefined) {
            console.log('has empty value...');
            return;
        }

        this._sendToken(to, value).then(
            data => {
                this._getTokenBalance();
            },
            err => {
                console.log('sendToken failed...', err);
            }
        );
    };

    render() {
        const { value } = this.state;
        return (
            <div>
                <button onClick={this.getTokenBalance}>getTokenBalance</button>&nbsp;&nbsp;
                <button onClick={this.sendToken}>sendToken</button>&nbsp;&nbsp;
                <input
                    ref={o => {
                        this.input1 = o;
                    }}
                    placeholder="addr"
                />
                &nbsp;&nbsp;
                <input
                    ref={o => {
                        this.input2 = o;
                    }}
                    placeholder="value"
                />
                &nbsp;&nbsp;
                <br />
                <b>ERC20 Token Balance: {value}</b>
            </div>
        );
    }
}

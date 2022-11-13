import React, { Component } from 'react';
import { ethers } from 'ethers';

import Greeter from '../../artifacts/contracts/Greeter.sol/Greeter.json';

// 合约的部署地址
const contractAddr = '0xc3cf5cb9a7d9060207b805c619f4831ae3d83ccf';

// 调用合约的账号私钥
const adminPrivateKey = '0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad';

export default class GreeterComponent extends Component {
    // store greeting in local state
    contractObj = undefined;

    state = {
        value: undefined,
    };

    // 组件挂载好了以后，构造合约调用对象
    componentDidMount() {
        const provider = new ethers.providers.WebSocketProvider('ws://127.0.0.1:8545', 30303);
        const wallet = new ethers.Wallet(adminPrivateKey, provider);
        this.contractObj = new ethers.Contract(contractAddr, Greeter.abi, wallet);
    }

    // request access to the user's MetaMask account
    requestAccount = () => {
        window.ethereum.request({ method: 'eth_requestAccounts' });
    };

    async _getGreeting() {
        try {
            const data = await this.contractObj.greet();
            console.log('data1: ', data);
            this.setState({
                value: data,
            });
            return data;
        } catch (err) {
            console.log('Error: ', err);
            return err;
        }
    }

    // call the smart contract, read the current greeting value
    getGreeting = () => {
        let obj = {};
        this._getGreeting()
            .then(d => {
                console.log('data2: ', d);
                obj.data = d;
                return d;
            })
            .then(d => {
                obj.data2 = d;
                console.log('data3: ', d);
            })
            .finally(() => {
                console.log('data4: ', obj);
                console.log('data4 value: ', obj.data);
            });

        console.log('data5: ', obj);
        console.log('data5 value: ', obj.data);
    };

    async _setGreeting(value) {
        try {
            console.log('set value: ', value);
            const tx = await this.contractObj.setGreeting(value);

            // tx.wait();
            console.log('set tx: ', tx);
            return tx;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    // call the smart contract, send an update
    setGreeting = () => {
        // const { input1 } = this.refs;

        const value = this.input1.value;
        if (!value || value === undefined) {
            console.log('empty value...');
            return;
        }

        this._setGreeting(value).then(
            data => {
                this._getGreeting();
            },
            err => {
                console.log('set value failed...', err);
            }
        );
    };

    render() {
        const { value } = this.state;
        return (
            <div>
                <button onClick={this.getGreeting}>Get Greeting</button>&nbsp;&nbsp;
                <button onClick={this.setGreeting}>Set Greeting</button>&nbsp;&nbsp;
                <input
                    ref={o => {
                        this.input1 = o;
                    }}
                    // ref="input1"
                    // onChange={e => this.setGreeting(e.target.value)}
                    // onChange={e => console.log(e.target.value)}
                    placeholder="greeting value"
                />
                <br />
                <b>{value}</b>
            </div>
        );
    }
}

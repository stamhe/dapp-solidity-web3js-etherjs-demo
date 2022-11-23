import React, { Component } from 'react';
import { ethers } from 'ethers';

// import { toChecksumAddress } from 'ethereumjs-util';
// import { encrypt } from 'eth-sig-util';

import Greeter from '../../artifacts/contracts/SimpleToken.sol/SimpleToken.json';

// 合约的部署地址
const contractAddr = '0x9C66A34Cfa1B6a259f929C073E3A07447a1b3344';

export default class GreeterComponent extends Component {
    state = {
        value: 0,
        tip: '',
        publicKey: '',
        signedMessage: '',
        signedMessageVerify: '',
        signedMessageAddr: '',
        chainId: '',
        networkVersion: '',
        latestBlockInfo: '',
    };

    accountList = {};

    async _isUnlocked() {
        try {
            const isLock = await window.ethereum._metamask.isUnlocked();
            return isLock;
        } catch (err) {
            console.log('_isUnlocked failed: ' + err);
        }
    }

    componentDidMount() {
        // to verify if the browser is running MetaMask
        if (typeof window.ethereum === 'undefined') {
            console.log('MetaMask is not installed!');
            return;
        }

        // Detecting MetaMask
        if (window.ethereum.isMetaMask) {
            console.log('It is a MetaMask Provider....');
            console.log('networkVersion: ', window.ethereum.networkVersion);
            console.log('isConnected: ', window.ethereum.isConnected());
            console.log('isUnlocked: ', this._isUnlocked());

            // If you'd like to be notified when the address changes, we have an event you can subscribe to
            window.ethereum.on('accountsChanged', function (accounts) {
                // Time to reload your interface with accounts[0]!
                console.log('accountsChanged event: ', accounts);
                // window.location.reload();
            });

            window.ethereum.on('chainChanged', function (chainId) {
                console.log('chainChanged event: ', chainId);
                // window.location.reload();
            });

            window.ethereum.on('connect', function (connectInfo) {
                console.log('connect event: ', connectInfo);
            });

            window.ethereum.on('disconnect', function (err) {
                console.log('disconnect event: ', err);
            });

            window.ethereum.on('message', function (msg) {
                console.log('message event: ', msg);
            });
        }

        this._ethRequestAccounts();
    }

    componentWillUnmount() {
        // window.ethereum.removeListener('accountsChanged', this.accountsChangedEvent);
    }

    async _ethRequestAccounts() {
        try {
            // "Connecting" or "logging in" to MetaMask effectively means "to access the user's Ethereum account(s)".
            // Access the user's accounts (per EIP-1102)
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // console.log('account list: ' + JSON.stringify(accounts));
            console.log('_ethRequestAccounts: ', accounts);
            console.log('selectedAddress: ', window.ethereum.selectedAddress);
            this.accountList = accounts;
        } catch (err) {
            console.log('_ethRequestAccounts failed: ', err);
        }
    }

    ethRequestAccounts = () => {
        this._ethRequestAccounts();
    };

    async _getTokenBalance(to) {
        if (typeof window.ethereum !== 'undefined') {
            // request access to the user's MetaMask account
            // const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // console.log({ account });
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            console.log('provider: ', provider);
            const accounts = await provider.listAccounts();
            console.log(accounts);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddr, Greeter.abi, signer);
            contract.balanceOf(to).then(data => {
                console.log('balance: ', data.toString());
                // eth 转换, wei => ether
                // const ethBalanceStr2 = ethers.utils.formatUnits(ethers.BigNumber.from(data.toString),'ether');

                this.setState({
                    value: data.toString(),
                    tip: data.toString(),
                });
            });
        }
    }

    // call the smart contract, read the current greeting value
    getTokenBalance = () => {
        const to = this.input3.value;
        this._getTokenBalance(to).then(d => {
            return d;
        });
    };

    async _sendToken(to, value) {
        try {
            if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.request({
                    method: 'eth_requestAccounts',
                    params: [
                        {
                            // from: '0xE3205B97510cF1052DCe5b476f409731bbe3921E',
                            // to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567',
                            // gas: '0x76c0', // 30400
                            // gasPrice: '0x9184e72a000', // 10000000000000
                            // value: '0x9184e72a', // 2441406250
                            // data: '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
                        },
                    ],
                });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                // 检查是否是 metamask
                if (provider.connection.url !== 'metamask') {
                    console.log('wallet is not metamask...');
                    return;
                }

                const signer = provider.getSigner(0);
                const contract = new ethers.Contract(contractAddr, Greeter.abi, signer);
                contract
                    .transfer(to, value)
                    .then(tx => {
                        this.setState({
                            tip: JSON.stringify(tx),
                        });
                    })
                    .catch(err => {
                        // console.log('transfer catch: ', err);
                        this.setState({
                            tip: JSON.stringify(err),
                        });
                    });
                return true;
            }
        } catch (err) {
            console.log('sendToken failed: ', err);
            return err;
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

    async _walletGetPermissions() {
        try {
            await window.ethereum
                .request({ method: 'wallet_getPermissions' })
                .then(permissions => {
                    console.log('_walletGetPermissions: ', permissions);
                })
                .catch(error => {
                    if (error.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        console.log('Permissions needed to continue.');
                    } else {
                        console.error(error);
                    }
                });
        } catch (err) {
            console.log('_walletGetPermissions catch: ', err);
        }
    }

    walletGetPermissions = () => {
        this._walletGetPermissions();
    };

    async _walletRequestPermissions() {
        await window.ethereum
            .request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }],
            })
            .then(permissions => {
                console.log('_walletRequestPermissions: ', permissions);
                const accountsPermission = permissions.find(
                    permission => permission.parentCapability === 'eth_accounts'
                );
                if (accountsPermission) {
                    console.log('eth_accounts permission successfully requested!');

                    this._ethRequestAccounts();
                    this._walletGetPermissions();
                }
            })
            .catch(error => {
                if (error.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    console.log('_walletRequestPermissions failed: userRejectedRequest');
                } else {
                    console.log('_walletRequestPermissions failed: ', error);
                }
            });
    }

    walletRequestPermissions = () => {
        this._walletRequestPermissions();
    };

    async _ethSendTransaction(to) {
        try {
            const to = this.input1.value;
            const value = this.input2.value;
            if (!to || !value || value === undefined || to === undefined) {
                console.log('has empty value...');
                return;
            }

            const value2 = BigInt(value * 1 * 10 ** 18);
            const value3 = ethers.BigNumber.from(value2);
            // const value2 = ethers.BigNumber.from(value * 10 ** 16);
            const transactionParameters = {
                // nonce: '0x00', // ignored by MetaMask
                // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
                // gas: '0x2710', // customizable by user during MetaMask confirmation.
                // to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
                to: to,
                from: window.ethereum.selectedAddress, // must match user's active address.
                // value: '0x00', // Only required to send ether to the recipient from the initiating external account.
                value: value3.toHexString(),
                // data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
                // chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
            };

            // txHash is a hex string
            // As with any RPC call, it may throw an error
            const txHash = await window.ethereum
                .request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                })
                .then(tx => {
                    console.log('_ethSendTransaction tx: ', tx);
                    this.setState({
                        tip: tx,
                    });
                })
                .catch(err => {
                    console.log('_ethSendTransaction err: ', err);
                });

            return txHash;
        } catch (err) {
            console.log('_ethSendTransaction failed: ' + err);
        }
    }
    ethSendTransaction = () => {
        this._ethSendTransaction();
    };

    async _ethAccounts() {
        try {
            window.ethereum
                .request({ method: 'eth_accounts' })
                .then(accounts => {
                    console.log('_ethAccounts accounts: ', accounts);
                })
                .catch(err => {
                    // Some unexpected error.
                    // For backwards compatibility reasons, if no accounts are available,
                    // eth_accounts will return an empty array.
                    console.error(err);
                });
        } catch (err) {
            console.log('_ethAccounts failed: ' + err);
        }
    }

    ethAccounts = () => {
        this._ethAccounts();
    };

    async _ethGetEncryptionPublicKey() {
        let encryptionPublicKey;
        try {
            await window.ethereum
                .request({
                    method: 'eth_getEncryptionPublicKey',
                    params: [this.accountList[0]], // you must have access to the specified account
                })
                .then(result => {
                    encryptionPublicKey = result;
                    console.log('_ethGetEncryptionPublicKey: ', result);
                    this.setState({
                        publicKey: result,
                    });
                })
                .catch(error => {
                    if (error.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        console.log("We can't encrypt anything without the key.");
                    } else {
                        console.error(error);
                    }
                });

            console.log('_ethGetEncryptionPublicKey encryptionPublicKey: ', encryptionPublicKey);
        } catch (err) {
            console.log('_ethGetEncryptionPublicKey failed: ', err);
        }
    }

    ethGetEncryptionPublicKey = () => {
        this._ethGetEncryptionPublicKey();
    };

    async _ethSign() {
        // 要求 eth_sign requires 32 byte message hash
        const rawMessage = this.input7.value;
        if (rawMessage === undefined || rawMessage === '') {
            console.log('_ethSign: empty raw message...');
            return;
        }

        try {
            const from = this.accountList[0];
            const msg = rawMessage;
            const sign = await window.ethereum.request({
                method: 'eth_sign',
                params: [from, msg],
            });

            console.log('_ethSign: ', sign);
            this.setState({
                signedMessage: sign,
                signedMessageAddr: from,
            });
        } catch (err) {
            console.error('_ethSign: ', err);
        }
    }

    ethSign = () => {
        this._ethSign();
    };

    async _personalSign() {
        const rawMessage = this.input7.value;
        if (rawMessage === undefined || rawMessage === '') {
            console.log('_personalSign: empty raw message...');
            return;
        }
        try {
            const from = this.accountList[0];
            // const msg = `0x${Buffer.from(rawMessage, 'utf8').toString('hex')}`;
            const msg = rawMessage;
            const sign = await window.ethereum.request({
                method: 'personal_sign',
                params: [msg, from],
            });

            console.log('_personalSign: ', sign);
            this.setState({
                signedMessage: sign,
                signedMessageAddr: from,
                tip: sign,
            });
        } catch (err) {
            console.error('_personalSign: ', err);
        }
    }

    personalSign = () => {
        this._personalSign();
    };

    async _personalEcRecover() {
        const signedMessage = this.input8.value;
        const rawMessage = this.input7.value;
        const addr = this.accountList[0];
        try {
            const ecRecoverAddr = await window.ethereum.request({
                method: 'personal_ecRecover',
                params: [rawMessage, signedMessage],
            });
            if (ecRecoverAddr === addr) {
                console.log(`Successfully ecRecovered signer as ${ecRecoverAddr}`);
                this.setState({
                    signedMessageVerify: ecRecoverAddr,
                });
            } else {
                console.log(`Failed to verify signer when comparing ${ecRecoverAddr} to ${addr}`);
                this.setState({
                    signedMessageVerify: false,
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    personalEcRecover = () => {
        this._personalEcRecover();
    };

    async _getBasicInfo() {
        try {
            const chainId = await window.ethereum.request({
                method: 'eth_chainId',
            });

            const networkVersion = await window.ethereum.request({
                method: 'net_version',
            });

            const latestBlockInfo = await window.ethereum.request({
                method: 'eth_getBlockByNumber',
                params: ['latest', false],
            });

            const chainId2 = ethers.BigNumber.from(chainId);
            this.setState({
                chainId: chainId2.toNumber(),
                networkVersion: networkVersion,
                latestBlockInfo: JSON.stringify(latestBlockInfo),
            });
            console.log('chainId: ' + chainId);
            console.log('networkVersion: ', networkVersion);
            console.log('latestBlockInfo', latestBlockInfo);
        } catch (err) {
            console.error(err);
        }
    }
    getBasicInfo = () => {
        this._getBasicInfo();
    };
    render() {
        const {
            value,
            tip,
            signedMessageAddr,
            signedMessage,
            signedMessageVerify,
            chainId,
            networkVersion,
            latestBlockInfo,
        } = this.state;
        return (
            <div>
                <b>
                    Tip:
                    <textarea rows="5" cols="100" value={tip}></textarea>
                </b>
                <br />
                <b>
                    ERC20 Token Balance: <span style={{ color: 'red' }}>{value}</span>
                    <span style={{ color: 'orange' }}> STAM</span>
                </b>
                <br />
                <input
                    ref={o => {
                        this.input1 = o;
                    }}
                    placeholder="to addr"
                />
                &nbsp;&nbsp;
                <input
                    ref={o => {
                        this.input2 = o;
                    }}
                    placeholder="ether or token"
                />
                <hr />
                <input
                    ref={o => {
                        this.input3 = o;
                    }}
                    placeholder="addr"
                />
                <hr />
                <button onClick={this.ethSendTransaction}>eth_sendTransaction</button>&nbsp;&nbsp;
                <button onClick={this.getTokenBalance}>getTokenBalance</button>
                &nbsp;&nbsp;
                <button onClick={this.sendToken}>sendToken</button>
                <hr />
                <button onClick={this.ethAccounts}>eth_accounts</button>
                &nbsp;&nbsp;
                <button onClick={this.ethRequestAccounts}>eth_requestAccounts</button>&nbsp;&nbsp;
                <button onClick={this.walletRequestPermissions}>wallet_requestPermissions</button>
                &nbsp;&nbsp;
                <button onClick={this.walletGetPermissions}>wallet_getPermissions</button>
                <hr />
                <input
                    ref={o => {
                        this.input7 = o;
                    }}
                    placeholder="raw message"
                />
                &nbsp;&nbsp;
                <input
                    ref={o => {
                        this.input8 = o;
                    }}
                    placeholder="signed message"
                    value={signedMessage}
                />
                <hr />
                <div>
                    <b>Personal Signed Message Addr: </b>
                    <span
                        style={{ color: 'red' }}
                        ref={o => {
                            this.input4 = o;
                        }}
                    >
                        <b>{signedMessageAddr}</b>
                    </span>
                </div>
                <div>
                    <b>Personal Signed Message: </b>
                    <span style={{ color: 'red' }}>
                        <b
                            ref={o => {
                                this.input5 = o;
                            }}
                        >
                            {signedMessage}
                        </b>
                    </span>
                </div>
                <div>
                    <b>Personal Signed Message Verify: </b>
                    <span style={{ color: 'red' }}>
                        <b>{signedMessageVerify}</b>
                    </span>
                </div>
                <br />
                <button onClick={this.ethGetEncryptionPublicKey}>
                    eth_getEncryptionPublicKey(DEPRECATED)
                </button>
                &nbsp;&nbsp;
                <button onClick={this.personalSign}>personal_sign</button>
                &nbsp;&nbsp;
                <button onClick={this.personalEcRecover}>personal_ecRecover</button>
                &nbsp;&nbsp;
                <button onClick={this.ethSign}>eth_sign</button>
                &nbsp;&nbsp;
                <hr />
                <button onClick={this.getBasicInfo}>GetBasicInfo</button>
                <br />
                <div>
                    <b>ChainId: </b>
                    <span style={{ color: 'red' }}>
                        <b>{chainId}</b>
                    </span>
                </div>
                <br />
                <div>
                    <b>NetworkVersion: </b>
                    <span style={{ color: 'red' }}>
                        <b>{networkVersion}</b>
                    </span>
                </div>
                <br />
                <div>
                    <b>Latest Block Info: </b>
                    <textarea rows="10" cols="100" value={latestBlockInfo}></textarea>
                </div>
            </div>
        );
    }
}

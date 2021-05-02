import web3 from 'web3';
import React, {Component} from "react";
import './Styles.css';
import Estatejson from '../build/contracts/Estate.json'

import {pinJSONToIPFS} from './MintFunc'


class Application extends Component{
    constructor(props) {
        super(props);
        this.state = {
            connect:false,
            chainaccount: "",
            chaincontract: null,
            home_address: "",
            userid:"",
            ipfskey:"93a73d8ffb7b015cf03e",
            ipfssecret:"b5575b1500bebe3f875e2a451bd587aa79ccfc2f5f5311f68d666c40fb5cf0a2",
            homes: []
        }
    }
    async componentWillMount() {
        await this.connectWeb3()
        if (this.state.connected === true){
            await this.connectBlockChain()
        }
        // Once the component mounts, the above functions can run because web3 is injected
    }
    async connectWeb3() {
        if (window.ethereum){
            window.web3 = new web3(window.ethereum)
            await window.ethereum.enable()
            this.setState({connected:true})
            console.log("connected:",this.state.connected)
        }
        else{
            window.alert("Please Install MetaMask as a Chrome Extension")
        }
    }
    AccountKeeper(){
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function(accounts){
                console.log("account upon keeper:",accounts[0]);


            })
        }
    }
    async connectBlockChain() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts()
        this.setState({chainaccount:accounts[0]})
        console.log("account:", this.state.chainaccount)
        const ethNetwork_userid = await window.web3.eth.net.getId()
        this.setState({userid:ethNetwork_userid})
        console.log("Network Id (likely 5777 for ganache):",ethNetwork_userid)
        if (Estatejson.networks[ethNetwork_userid]){
            const abstract_binary_interface = Estatejson.abi
            // an abi is just an interface between react and solidity but as a variable here to allow for use in contract initiation
            const ethNetwork_address = Estatejson.networks[ethNetwork_userid].address
            console.log("HERE++++++", ethNetwork_address)
            const contract = new web3.eth.Contract(abstract_binary_interface,ethNetwork_address)
            this.setState({chaincontract:contract})
            console.log(this.state.chaincontract)
        }

        //window.ethereum.wallet.eth_signTypedData( ,"Please sign this document to verify your address",)
        //this.AccountKeeper()
    }


    reqtokenuri = async(address, description) => {
        const metadata = new Object();
        metadata.address = address;
        metadata.description = description;

        const pinataResponse = await pinJSONToIPFS(metadata);
        if (!pinataResponse.success) {
            return {
                success: false,
                status: "Something went wrong while uploading your tokenURI.",
            }
        }
        const tokenURI = pinataResponse.pinataUrl;
        return tokenURI
    }


    pinJSONToIPFS = async(JSONBody) => {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        const axios = require('axios');
        //making axios POST request to Pinata
        return axios
            .post(url, JSONBody, {
                headers: {
                    pinata_api_key: this.state.ipfskey,
                    pinata_secret_api_key: this.state.ipfssecret,
                }
            })
            .then(function (response) {
                return {
                    success: true,
                    pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
                };
            })
            .catch(function (error) {
                console.log(error)
                return {
                    success: false,
                    message: error.message,
                }

            });
    };


    mint = async (addressofhouse,description) => {
        const tokenuri = this.reqtokenuri(addressofhouse,description)
        console.log("tokenuri:",tokenuri)
        const house = await this.state.chaincontract.methods.mint(tokenuri).send({from:this.state.chainaccount})
        console.log(house)
        console.log("success")
        this.setState({
            homes: [...this.state.homes, house]
        })
    }


    render() {
        return (
            <div className="App">
                <span> </span>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="https://github.com/giovannivignone"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        NFT Real Estate
                    </a>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white"><span id="account">account name: {this.state.chainaccount}</span></small>
                        </li>
                    </ul>
                </nav>
                <br>

                </br>
                <br>

                </br>
                <h1 id="title"> Mint a House 🏠</h1>
                <p>

                </p>
                <form>
                    <h3>House Address: </h3>
                    <input
                        type="text"
                        placeholder="e.g. 123 Duke Drive!"
                        onChange={(event) => this.setState({homeaddress:event.target.value})}
                    />
                    <h3>House Description: </h3>
                    <input
                        type="text"
                        placeholder="e.g. 5 bedrooms 2 baths"
                        onChange={(event) => this.setState({homedescription:event.target.value})}
                    />
                </form>
                <br>

                </br>
                <button className="btn-1" id="mintButton" onClick={() =>this.mint(this.state.homeaddress,this.state.homedescription)}>
                    Mint NFT
                </button>
            </div>

        );
    }
}
export default Application;
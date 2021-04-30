import web3 from 'web3';
import React, {Component} from "react";
import styles from './Styles.css';
import Estatejson from '../build/contracts/Estate.json'


class Application extends Component{
    constructor(props) {
        super(props);
        this.state = {
            connect:false,
            chainaccount: "",
            chaincontract: null
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
        console.log("Network Id (likely 5777 for ganache):",ethNetwork_userid)
        if (Estatejson.networks[ethNetwork_userid]){
            const abstract_binary_interface = Estatejson.abi
            // an abi is just an interface between react and solidity but as a variable here to allow for use in contract initiation
            const ethNetwork_address = Estatejson.networks[ethNetwork_userid].address
            const contract = new web3.eth.Contract(abstract_binary_interface,ethNetwork_address)
            this.setState({chaincontract:contract})
            console.log(this.state.chaincontract)



        }

        //window.ethereum.wallet.eth_signTypedData( ,"Please sign this document to verify your address",)
        //this.AccountKeeper()
    }

    render() {
        return (
            <div>
                <button className="Sign in Button" style={styles.button}
                        onClick={() =>alert("Please add meta")}>Log Into MetaMask</button>
            </div>
        );
    }
}
export default Application;
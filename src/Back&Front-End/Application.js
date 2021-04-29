import web3 from 'web3';
import React, {Component} from "react";
import styles from './Styles.css';



class Application extends Component{
    constructor(props) {
        super(props);
        this.state = {
            connect:false,
            chainaccount: ""
        }
    }
    async componentWillMount() {
        await this.connectWeb3()
        if (this.state.connected === true){
            await this.connectBlockChain()
        }
        // Once the component mounts we can utilize web3
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

        //this.AccountKeeper()
        //console.log("account:",this.state.chainaccount)

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
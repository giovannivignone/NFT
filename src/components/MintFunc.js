import { useEffect, useState } from "react";
import Estate from '../builds/contracts/Estate.json'
import web3 from "web3";

export const reqtokenuri = async(url, address, description) => {
        const metadata = new Object();
        metadata.address = address;
        metadata.image = url;
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

const key = "93a73d8ffb7b015cf03e"
const secret = "b5575b1500bebe3f875e2a451bd587aa79ccfc2f5f5311f68d666c40fb5cf0a2"

const axios = require('axios');

export const pinJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
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
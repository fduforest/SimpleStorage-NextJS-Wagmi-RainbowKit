'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi, contractAddress } from '@/constants';

import { useAccount } from 'wagmi'
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core'

import { useState } from 'react';

export default function Home() {

  // The State that will get the number on the blockchain (get method)
  const [getNumber, setGetNumber] = useState()
  // The State that will keep track of the user input (set method)
  const [setNumber, setSetNumber] = useState()
  // We get the address from rainbowkit and if the user is connected or not
  const { address, isConnected } = useAccount()

  const getTheNumber = async() => {
    const data = await readContract({
      address: contractAddress,
      abi: abi,
      functionName: 'retrieve',
    })
    setGetNumber(Number(data))
  }

  const changeNumber = async() => {
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'store',
      args: [setNumber]
    })
    const { hash } = await writeContract(request)
    await getTheNumber()
    setSetNumber()
  }

  return (
    <>
      <ConnectButton />
      {isConnected ? (
        <div>
          <p><button onClick={getTheNumber}>Get The Number</button> : {getNumber}</p>
          <p><input type="number" onChange={(e) => setSetNumber(e.target.value)} /> <button onClick={changeNumber}>Change the number</button></p>
        </div>
      ) : (
        <p>Please connect your Wallet to our DApp.</p>
      )}
    </>
  )
}

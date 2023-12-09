import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Link, json } from "react-router-dom";
import Safe, { EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'

import {
  AuthKitSignInData,
  SafeAuthInitOptions,
  SafeAuthPack,
  SafeAuthUserInfo
} from '@safe-global/auth-kit'
// 0x37A34c5c036aaD0FED7a7B8f4D73aDdfb69AeaCB - safe
import { redirect } from "react-router-dom";

const options = {
  enableLogging: true,
  chainConfig: {
    chainId: '0x5', // Goerli chain ID
    rpcTarget: 'https://rpc.ankr.com/eth_goerli',
    blockExplorerUrl: 'https://goerli.etherscan.io/',
    isTestnet: true
  }
}

export function SignIn() {
  
  const [safeAuthPack, setSafeAuthPack] = useState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState(
    null
  )
  const [userInfo, setUserInfo] = useState(null)
  const [chainId, setChainId] = useState()
  const [balance, setBalance] = useState()
  const [provider, setProvider] = useState()
  const [safeFactory, setSafeFactory] = useState()

  useEffect(() => {

    ;(async () => {
      
      const authPack = new SafeAuthPack()
      await authPack.init(options)
      setSafeAuthPack(authPack)

      if (authPack.isAuthenticated) {
        const signInInfo = await authPack?.signIn()
        setSafeAuthSignInResponse(signInInfo)
        setIsAuthenticated(true)
      }

      await storeInfoInLocalStorage();

      authPack.subscribe('accountsChanged', async (accounts) => {
        console.log('safeAuthPack:accountsChanged', accounts, authPack.isAuthenticated)
        if (authPack.isAuthenticated) {
          const signInInfo = await authPack?.signIn()

          setSafeAuthSignInResponse(signInInfo)
          setIsAuthenticated(true)
        }
      })

      authPack.subscribe('chainChanged', (eventData) =>
        console.log('safeAuthPack:chainChanged', eventData)
      )
    })()
  }, [])

  useEffect(() => {
    if (!safeAuthPack || !isAuthenticated) return
    ;(async () => {
      await storeInfoInLocalStorage();
      if(isAuthenticated) {
        redirect('/')
      }
    })()
  }, [isAuthenticated])

  const getSigner = async () => {
    const web3Provider = safeAuthPack?.getProvider()
    if (web3Provider) {
      const provider = new ethers.BrowserProvider(web3Provider)
      setProvider(provider)
      const signer = await provider.getSigner()
      return signer;

      // const signerAddress = await signer.getAddress()
      // setChainId((await provider?.getNetwork()).chainId.toString())
      // setBalance(
      //   ethers.formatEther((await provider.getBalance(signerAddress)))
      // )
    }
  }

  const getUserInfo = async () => {
    const userInfo = await safeAuthPack?.getUserInfo()
    setUserInfo(userInfo)
    return userInfo;
  }

  const login = async () => {
    const signInInfo = await safeAuthPack?.signIn()
    await initSafeFactory()

    setSafeAuthSignInResponse(signInInfo)

    await storeInfoInLocalStorage()
    if(isAuthenticated) {
      redirect("/");
    }
  }

  const storeInfoInLocalStorage = async () => {
    const isAuthenticated = safeAuthPack.isAuthenticated
    setIsAuthenticated(isAuthenticated);

    const info = await getUserInfo();
    const signer = await getSigner();
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("userInfo", JSON.stringify(info))
    localStorage.setItem("signer", JSON.stringify(signer))
    localStorage.setItem("authSignInInfo", JSON.stringify(safeAuthSignInResponse))
  }

  async function getBalance() {
    try {
      const balance_wei = await provider.getBalance("0xA07e8c0920601C98B00665Bc8bf294A8303A4Fd1");
  
      // Convert Wei to ETH
      const balance_eth = ethers.formatEther(balance_wei);
  
      console.log("Balance : ", balance_eth, " ETH");
    } catch (error) {
      console.error(error);
    }
  }

  const logout = async () => {
    // await safeAuthPack?.signOut()
    
    setIsAuthenticated(false)
    setSafeAuthSignInResponse(null)
    await storeInfoInLocalStorage();
  }


  const getAccounts = async () => {
    const accounts = await provider?.send('eth_accounts', [])

    console.log(accounts);
  }

  const getChainId = async () => {
    const chainId = await provider?.send('eth_chainId', [])

    console.log(getChainId);
  }

  const initSafeFactory = async () => {
    const signer = await getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer
    })

    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter })
    setSafeFactory(safeFactory)
  }

  const createJointSafeWallet = async () => {

    if(!isAuthenticated) return '0x0'
    if(safeFactory == null) {
      await initSafeFactory()
    }

    const safeAccountConfig = {
      owners: [
        safeAuthSignInResponse?.eoa,
        import.meta.env.VITE_SAFE_LINK_PUBLIC_KEY
      ],
      threshold: 2,
    }
    const saltNonce =  new Date().getTime().toString();
    
    const predictedSafeAddress = await safeFactory.predictSafeAddress(safeAccountConfig, saltNonce)
    console.log('predictedSafeAddress: ', predictedSafeAddress)
    
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, saltNonce })
    const safeAddress = await safeSdk.getAddress()
    
    console.log('Your Safe has been deployed:')
    console.log(safeAddress)
    alert(safeAddress);
    return safeAddress || '0x0';
  }

  const getSafeWallet = async () => {
    const safeAddress = "0x0FBF1a01C8d06eb958D730358CF704797C2B2c14"

    const signer = await getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer
    })

    const safeSdk = await Safe.create({ ethAdapter: ethAdapter, safeAddress })
    
    console.log(await safeSdk.getOwners());

    return safeSdk
  }

  const addOwner = async () => {
    const safeAddress = "0x37A34c5c036aaD0FED7a7B8f4D73aDdfb69AeaCB"
    const toAddAddress = "0x24f8cb46582324b79833f6baCad84D8d18458f36"

    const signer = await getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer
    })

    const safeSdk = await Safe.create({ ethAdapter: ethAdapter, safeAddress })

    const params = {
      ownerAddress: toAddAddress, 
      threshold: 1
    }
    const safeTransaction = await safeSdk.createAddOwnerTx(params)
    const txResponse = await safeSdk.executeTransaction(safeTransaction)
    await txResponse.transactionResponse?.wait()

    console.log("Updated owners list", await safeSdk.getOwners())
  }

  const removeOwner = async () => {
    const safeAddress = "0x37A34c5c036aaD0FED7a7B8f4D73aDdfb69AeaCB"
    const toRemoveAddress = "0x24f8cb46582324b79833f6baCad84D8d18458f36"

    const signer = await getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer
    })

    const safeSdk = await Safe.create({ ethAdapter: ethAdapter, safeAddress })

    const params = {
      ownerAddress: toRemoveAddress,
      threshold: 1
    }
    const safeTransaction = await safeSdk.createRemoveOwnerTx(params)
    const txResponse = await safeSdk.executeTransaction(safeTransaction)
    await txResponse.transactionResponse?.wait()

    console.log("Updated owners list", await safeSdk.getOwners())
  }

  const send = async () => {
    const toAddress = "0x37A34c5c036aaD0FED7a7B8f4D73aDdfb69AeaCB"
    const weiValue = "100000000000000"

    const safeTransactionData = {
      to: toAddress,
      value: weiValue, // eth value in wei
      data: '0x<data>'
    }
    const safeTransaction = await safeFactory.createTransaction({ transactions: [safeTransactionData] })
  }

  const sendFromSafe = async () => {
    ;
  }

  const signAndExecuteSafeTx = async (index) => {
    
    // Create transaction
    let tx = await safeFactory.createTransaction({
      transactions: [
        {
          to: ethers.getAddress(safeAuthSignInResponse?.eoa || '0x'),
          data: '0x',
          value: ethers.parseUnits('0.0001', 'ether').toString()
        }
      ]
    })

    // // Sign transaction. Not necessary to execute the transaction if the threshold is one
    // // but kept to test the sign transaction modal
    // tx = await protocolKit.signTransaction(tx)

    // // Execute transaction
    // const txResult = await protocolKit.executeTransaction(tx)
    // uiConsole('Safe Transaction Result', txResult)
  }

  return (
    <section className="m-1 flex gap-2">
      <img src="/img/app-logo.png" className="absolute left-5 top-5" alt="app-logo" size="lg" height={150} width={150} variant="rounded" />
      <div className="w-full lg:w-3/5 mx-auto my-auto">
        <Card className="my-auto mx-auto w-80 max-w-screen-lg lg:w-1/2 p-10 border-2 shadow-2xl min-h-[350px]">
        <div className="text-center">
          <Typography variant="h3" color="black" className="font-bold mb-4 font-sans ">Sign In</Typography>
          </div>
          <div className="space-y-4 mt-8">
            <Button size="lg" variant="outlined" className="flex items-center gap-2  justify-center shadow-lg" onClick={login} fullWidth>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1156_824)">
                  <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                  <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                  <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                  <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_1156_824">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Sign in With Google</span>
            </Button>
            <Button size="lg" variant="outlined" className="flex items-center gap-2 justify-center shadow-md" onClick={removeOwner} fullWidth>
              <img src="/img/twitter-logo.svg" height={24} width={24} alt="" />
              <span>Sign in With Twitter</span>
            </Button>
          </div>

        </Card>

      </div>
      <Card className="bg-blue-100 w-2/5 m-1" style={{height:"98vh"}}>
      <div class="flex flex-col justify-center items-center h-screen gap-4">
        <Card className="shadow-lg w-2/3 h-18 p-4" color="white">
          <div className="flex flex-cols-2 ">
            <div className="w-1/6 flex">
            <img src="/img/twitter-logo.svg" className="mx-auto my-auto" height={32} width={32 } alt="" />
            </div>
            <div className="w-5/6">
            <div className="justify-center items-center">
              <div className="flex justify-between items-center">
                <div class="text-md font-bold">Twitter</div>
                <div class="text-md font-bold">$100.00</div>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
            <div class="text-sm font-normal">Last month</div>
            <div className="flex items-center gap-2">
            <img src="/img/solana-sol-logo.svg" height={20} width={20} alt="" />
          <Typography className="font-sans font-sm font-normal">1.29 SOL</Typography>
            </div>
            </div>
          </div>
          </div>
        </Card>
        <Card className="shadow-lg w-2/3 h-18 p-4" color="white">
          <div className="flex flex-cols-2 ">
            <div className="w-1/6 flex">
            <img src="/img/Instagram_logo_2016.svg" className="mx-auto my-auto" height={32} width={32 } alt="" />
            </div>
            <div className="w-5/6">
            <div className="justify-center items-center">
              <div className="flex justify-between items-center">
                <div class="text-md font-bold">Instagram</div>
                <div class="text-md font-bold">$50.00</div>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
            <div class="text-sm font-normal">A week ago</div>
            <div className="flex items-center gap-2">
            <img src="/img/ethereum-eth-logo.svg" height={16} width={16} alt="" />
          <Typography className="font-sans font-sm font-normal">0.02 ETH</Typography>
            </div>

            </div>
          </div>
          </div>
        </Card>
        <Card className="shadow-lg w-2/3 h-18 p-4" color="white">
          <div className="flex flex-cols-2 ">
            <div className="w-1/6 flex">
            <img src="/img/discord-icon-svgrepo-com.svg" className="mx-auto my-auto" height={32} width={32 } alt="" />
            </div>
            <div className="w-5/6">
            <div className="justify-center items-center">
              <div className="flex justify-between items-center">
                <div class="text-md font-bold">Discord</div>
                <div class="text-md font-bold">$10.00</div>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
            <div class="text-sm font-normal">Yesterday</div>
            <div className="flex items-center gap-2">
            <img src="/img/polygon-matic-logo.svg" height={20} width={20} alt="" />
          <Typography className="font-sans font-sm font-normal">10.75 MATIC</Typography>
            </div>
            </div>
          </div>
          </div>
        </Card>
        <Typography className="font-sans font-bold-900 w-2/3 ml-2" color='black' variant="h2">INSTANT PAYMENTS ANYWHERE.</Typography>
        <Typography variant="sm" className="font-sans font-normal w-2/3 -mt-4 -mr-2  ">A fully integrated suite of web3 payment solutions to supercharge your crypto payments.</Typography>
  </div>
      </Card>

    </section>
  );
}

export default SignIn;
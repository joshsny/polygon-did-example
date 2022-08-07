import { ConnectButton, useAccountModal, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import axios from 'axios'
import ConnectWallet from 'components/Connect/ConnectWallet'
import ThemeToggleButton from 'components/Theme/ThemeToggleButton'
import ThemeToggleList from 'components/Theme/ThemeToggleList'
import { useState } from 'react'
import styles from 'styles/Home.module.scss'
import { useAccount, useBalance, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi'

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className={styles.header}>
      <div>
        <ThemeToggleList />
      </div>
      <div className="flex items-center">
        <ThemeToggleButton /> header <ThemeToggleList />
      </div>

      <div className="flex items-center">
        <ThemeToggleButton />
        <ThemeToggleList />
      </div>
    </header>
  )
}

type Data = {
  did: string
  address: string
  publicKey: string
  privateKey: string
}

function Main() {
  const { address, isConnected, connector } = useAccount()
  const { chain, chains } = useNetwork()
  const { isLoading: isNetworkLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    addressOrName: address,
  })
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()

  const [data, setData] = useState<Data>({ did: '', address: '', publicKey: '', privateKey: '' })

  return (
    <main className={styles.main + ' space-y-6'}>
      <div>
        <h4 className="text-sm font-medium text-center">demo: ConnectWalletBtn Full</h4>
        <div className="flex flex-col items-center w-full">
          <ConnectWallet />
        </div>
      </div>

      <div className="flex flex-col items-center w-full space-y-2">
        <button
          className="btn"
          onClick={() =>
            axios.post('/api/did').then(res => {
              console.log(res)
              setData(res.data.data)
            })
          }
        >
          Create a DID on Polygon
        </button>
        <div>Your DID is: {data.did}</div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-center">demo: useModal (rainbowkit ^0.4.3)</h4>
        <div className="flex flex-col items-center w-full">
          {openConnectModal && (
            <button
              onClick={openConnectModal}
              type="button"
              className="px-3 py-1 m-1 text-white transition-all duration-150 bg-orange-500 rounded-lg hover:scale-105"
            >
              useConnectModal
            </button>
          )}

          {openAccountModal && (
            <button
              onClick={openAccountModal}
              type="button"
              className="px-3 py-1 m-1 text-white transition-all duration-150 bg-orange-500 rounded-lg hover:scale-105"
            >
              useAccountModal
            </button>
          )}

          {openChainModal && (
            <button
              onClick={openChainModal}
              type="button"
              className="px-3 py-1 m-1 text-white transition-all duration-150 bg-orange-500 rounded-lg hover:scale-105"
            >
              useChainModal
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-xl p-6 text-center rounded-xl bg-sky-500/10">
        <dl className={styles.dl}>
          <dt>Connector</dt>
          <dd>
            {connector?.name}
            {!address && (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <span onClick={openConnectModal} className="cursor-pointer hover:underline">
                    Not connected, connect wallet
                  </span>
                )}
              </ConnectButton.Custom>
            )}
          </dd>
          <dt>Connected Network</dt>
          <dd>{chain ? `${chain?.id}: ${chain?.name}` : 'n/a'}</dd>
          <dt>Switch Network</dt>
          <dd className="flex flex-wrap justify-center">
            {isConnected &&
              chains.map(x => (
                <button
                  disabled={!switchNetwork || x.id === chain?.id}
                  key={x.id}
                  onClick={() => switchNetwork?.(x.id)}
                  className={
                    (x.id === chain?.id ? 'bg-green-500' : 'bg-blue-500 hover:scale-105') +
                    ' m-1 rounded-lg py-1 px-3 text-white transition-all duration-150'
                  }
                >
                  {x.name}
                  {isNetworkLoading && pendingChainId === x.id && ' (switching)'}
                </button>
              ))}
            <ConnectWallet show="disconnected" />
          </dd>
          <dt>Account</dt>
          <dd className="break-all">{address ? `${address}` : 'n/a'}</dd>
          <dt>Balance</dt>
          <dd className="break-all">
            {isBalanceLoading ? 'loading' : balance ? `${balance?.formatted} ${balance?.symbol}` : 'n/a'}
          </dd>
          <dt>Sign Message</dt>
          <dd className="break-all">{address ? <SignMsg /> : 'n/a'} </dd>
        </dl>
      </div>
    </main>
  )
}

function SignMsg() {
  const [msg, setMsg] = useState('Dapp Starter')
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: msg,
  })
  const signMsg = () => {
    if (msg) {
      signMessage()
    }
  }

  return (
    <>
      <p>
        <input value={msg} onChange={e => setMsg(e.target.value)} className="p-1 rounded-lg" />
        <button
          disabled={isLoading}
          onClick={() => signMsg()}
          className="px-2 py-1 ml-1 text-white transition-all duration-150 bg-blue-500 rounded-lg hover:scale-105"
        >
          Sign
        </button>
      </p>
      <p>
        {isSuccess && <span>Signature: {data}</span>}
        {isError && <span>Error signing message</span>}
      </p>
    </>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <ThemeToggleList />
      </div>
      <div className="flex items-center">
        <ThemeToggleButton /> footer <ThemeToggleList />
      </div>

      <div className="flex items-center">
        <ThemeToggleButton />
        <ThemeToggleList />
      </div>
    </footer>
  )
}

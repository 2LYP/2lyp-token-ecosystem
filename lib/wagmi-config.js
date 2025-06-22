// lib/wagmi-config.ts
import { getDefaultConfig } from '@wagmi/core'
import { createConfig, http } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(),
  },
  ssr: true,
})

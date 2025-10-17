export interface Token {
  symbol: string;
  address: string;
  category?: "AI" | "Meme" | "DeFi" | "LST" | "Stablecoin" | "Wrapped" | "Infrastructure" | "Other";
}

export const ALL_TOKENS: Token[] = [
  // AI Tokens
  { symbol: "AI16Z", address: "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC", category: "AI" },
  { symbol: "AIXBT", address: "14zP2ToQ79XWvc7FQpm4bRnp9d6Mp1rFfsUW3gpLcRX", category: "AI" },
  { symbol: "ANON", address: "9McvH6w97oewLmPxqQEoHUAv3u5iYMyQ9AeZZhguYf1T", category: "AI" },
  { symbol: "GRIFFAIN", address: "KENJSUYLASHUMfHyy5o4Hp2FdNqZg1AsUPhfH2kYvEP", category: "AI" },
  { symbol: "LOCKIN", address: "8Ki8DpuWNxu9VsS3kQbarsCWMcFGWkzzA8pUPto9zBd5", category: "AI" },
  { symbol: "RIFT", address: "jUpa2aDCzvdR9EF4fqDXmuyMUkonPTohphABLmRkRFj", category: "AI" },
  { symbol: "SHOGGOTH", address: "H2c31USxu35MDkBrGph8pUDUnmzo2e4Rf4hnvL2Upump", category: "AI" },
  { symbol: "VIRTUAL", address: "3iQL8BFS2vE7mww4ehAqQHAsbmRNCrPxizWAT2Zfyr9y", category: "AI" },
  { symbol: "ZEREBRO", address: "8x5VqbHA8D7NkD52uNuS5nnt3PwA8pLD34ymskeSo2Wn", category: "AI" },

  // Meme Coins
  { symbol: "MOBY", address: "Cy1GS2FqefgaMbi45UunrUzin1rfEmTUYnomddzBpump", category: "Meme" },
  { symbol: "VERSE", address: "vRseBFqTy9QLmmo5qGiwo74AVpdqqMTnxPqWoWMpump", category: "Meme" },
  { symbol: "DOOD", address: "DvjbEsdca43oQcw2h3HW1CT7N3x5vRcr3QrvTUHnXvgV", category: "Meme" },
  { symbol: "YZY", address: "DrZ26cKJDksVRWib3DVVsjo9eeXccc7hKhDJviiYEEZY", category: "Meme" },
  { symbol: "STREAMER", address: "3arUrpH3nzaRJbbpVgY42dcqSq9A5BFgUxKozZ4npump", category: "Meme" },
  { symbol: "DUPE", address: "fRfKGCriduzDwSudCwpL7ySCEiboNuryhZDVJtr1a1C", category: "Meme" },
  { symbol: "PCULE", address: "J27UYHX5oeaG1YbUGQc8BmJySXDjNWChdGB2Pi2TMDAq", category: "Meme" },
  { symbol: "POLYFACTS", address: "FfixAeHevSKBZWoXPTbLk4U4X9piqvzGKvQaFo3cpump", category: "Meme" },
  { symbol: "CAR", address: "7oBYdEhV4GkXC19ZfgAvXpJWp2Rn9pm1Bx2cVNxFpump", category: "Meme" },
  { symbol: "CHILLGUY", address: "Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump", category: "Meme" },
  { symbol: "CWIF", address: "7atgF8KQo4wJrD5ATGX7t1V2zVvykPJbFfNeVf1icFv1", category: "Meme" },
  { symbol: "FARTCOIN", address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump", category: "Meme" },
  { symbol: "FWOG", address: "A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump", category: "Meme" },
  { symbol: "GOAT", address: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump", category: "Meme" },
  { symbol: "LABUBU", address: "JB2wezZLdzWfnaCfHxLg193RS3Rh51ThiXxEDWQDpump", category: "Meme" },
  { symbol: "LUCE", address: "CBdCxKo9QavR9hfShgpEBG3zekorAeD7W1jfq2o3pump", category: "Meme" },
  { symbol: "MICHI", address: "5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp", category: "Meme" },
  { symbol: "MOODENG", address: "ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY", category: "Meme" },
  { symbol: "MOTHER", address: "3S8qX1MsMqRbiwKg2cQyx7nis1oHMgaCuc9c4VfvVdPN", category: "Meme" },
  { symbol: "MYRO", address: "HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4", category: "Meme" },
  { symbol: "PNUT", address: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump", category: "Meme" },
  { symbol: "PONKE", address: "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC", category: "Meme" },
  { symbol: "POPCAT", address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr", category: "Meme" },
  { symbol: "RETARDIO", address: "6ogzHhzdrQr9Pgv6hZ2MNze7UrzBMAFyBBWUYp1Fhitx", category: "Meme" },
  { symbol: "SAMO", address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", category: "Meme" },
  { symbol: "SLERF", address: "7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3", category: "Meme" },
  { symbol: "titcoin", address: "FtUEW73K6vEYHfbkfpdBZfWpxgQar2HipGdbutEhpump", category: "Meme" },
  { symbol: "TRUMP", address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN", category: "Meme" },
  { symbol: "UFD", address: "eL5fUxj2J4CiQsmW85k5FG9DvuQjjUoBHoQBi2Kpump", category: "Meme" },
  { symbol: "VINE", address: "6AJcP7wuLwmRYLBNbi825wgguaPsWzPBEHcHndpRpump", category: "Meme" },
  { symbol: "WEN", address: "WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk", category: "Meme" },
  { symbol: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", category: "Meme" },
  { symbol: "USELESS", address: "Dz9mQ9NzkBcCsuGPFJ3r1bS4wgqKMHBPiVuniW8Mbonk", category: "Meme" },
  { symbol: "TROLL", address: "5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2", category: "Meme" },
  { symbol: "AURA", address: "DtR4D9FtVoTX2569gaL837ZgrB6wNjj6tkmnX9Rdk9B2", category: "Meme" },
  { symbol: "BABYDOGE", address: "7dUKUopcNWW6CcU4eRxCHh1uiMh32zDrmGf6ufqhxann", category: "Meme" },
  { symbol: "BOME", address: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82", category: "Meme" },
  { symbol: "GIGA", address: "63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9", category: "Meme" },
  { symbol: "MORI", address: "8ZHE4ow1a2jjxuoMfyExuNamQNALv5ekZhsBn5nMDf5e", category: "Meme" },
  { symbol: "BERT", address: "HgBRWfYxEfvPhtqkaeymCQtHCrKE46qQ43pKe8HCpump", category: "Meme" },
  { symbol: "NOBODY", address: "C29ebrgYjYoJPMGPnPSGY1q3mMGk4iDSqnQeQQA7moon", category: "Meme" },
  { symbol: "NUB", address: "GtDZKAqvMZMnti46ZewMiXCa4oXF4bZxwQPoKzXPFxZn", category: "Meme" },
  { symbol: "USDUC", address: "CB9dDufT3ZuQXqqSfa1c5kY935TEreyBw9XJXxHKpump", category: "Meme" },
  { symbol: "ANI", address: "9tqjeRS1swj36Ee5C1iGiwAxjQJNGAVCzaTLwFY8bonk", category: "Meme" },
  { symbol: "CHILLHOUSE", address: "GkyPYa7NnCFbduLknCfBfP7p8564X1VZhwZYJ6CZpump", category: "Meme" },
  { symbol: "MASK", address: "6MQpbiTC2YcogidTmKqMLK82qvE9z5QEm7EP3AEDpump", category: "Meme" },
  { symbol: "STARTUP", address: "97PVGU2DzFqsAWaYU17ZBqGvQFmkqtdMywYBNPAfy8vy", category: "Meme" },
  { symbol: "SPARK", address: "5zCETicUCJqJ5Z3wbfFPZqtSpHPYqnggs1wX7ZRpump", category: "Meme" },
  { symbol: "CLIPPY", address: "7eMJmn1bYWSQEwxAX7CyngBzGNGu1cT582asKxxRpump", category: "Meme" },
  { symbol: "TOKABU", address: "H8xQ6poBjB9DTPMDTKWzWPrnxu4bDEhybxiouF8Ppump", category: "Meme" },
  { symbol: "PYTHIA", address: "CreiuhfwdWCN5mJbMJtA9bBpYQrQF2tCBuZwSPWfpump", category: "Meme" },
  { symbol: "SPX", address: "J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr", category: "Meme" },
  { symbol: "MEW", address: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5", category: "Meme" },
  { symbol: "MITCH", address: "FDEF2U9geiWS7sdGPCUo2r1wGswkJr2mmVTECiH6pump", category: "Meme" },
  { symbol: "REKT", address: "vQoYWru2pbUdcVkUrRH74ktQDJgVjRcDvsoDbUzM5n9", category: "Meme" },
  { symbol: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", category: "Meme" },

  // DeFi
  { symbol: "LAUNCHCOIN", address: "Ey59PH7Z4BFU4HjyKnyMdWt5GGN76KazTAwQihoUXRnk", category: "DeFi" },
  { symbol: "ME", address: "MEFNBXixkEbait3xn9bkm8WsJzXtVsaJEn4c8Sam21u", category: "DeFi" },
  { symbol: "PENGU", address: "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv", category: "DeFi" },
  { symbol: "FLIPR", address: "JCBKQBPvnjr7emdQGCNM8wtE8AZjyvJgh7JMvkfYxypm", category: "DeFi" },
  { symbol: "TNSR", address: "TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6", category: "DeFi" },
  { symbol: "PUMP", address: "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn", category: "DeFi" },
  { symbol: "MPLX", address: "METAewgxyPbgwsseH8T16a39CQ5VyVxZi9zXiDPY18m", category: "DeFi" },
  { symbol: "CLOUD", address: "CLoUDKc4Ane7HeQcPpE3YHnznRxhMimJ4MyaUqyHFzAu", category: "DeFi" },
  { symbol: "KMNO", address: "KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS", category: "DeFi" },
  { symbol: "STEP", address: "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT", category: "DeFi" },
  { symbol: "UNI", address: "8FU95xFJhUUkyyCLU13HSzDLs7oC4QZdXQHL6SCeab36", category: "DeFi" },
  { symbol: "xSTEP", address: "xStpgUCss9piqeFUk2iLVcvJEGhAdJxJQuwLkXP555G", category: "DeFi" },
  { symbol: "TUNA", address: "TUNAfXDZEdQizTMTh3uEvNvYqJmqFHZbEJt8joP4cyx", category: "DeFi" },
  { symbol: "ZBCN", address: "ZBCNpuD7YMXzTHB2fhGkGi78MNsHGLRXUhRewNRm9RU", category: "DeFi" },
  { symbol: "HUMA", address: "HUMA1821qVDKta3u2ovmfDQeW2fSQouSKE8fkF44wvGw", category: "DeFi" },
  { symbol: "PYTH", address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", category: "DeFi" },
  { symbol: "LIGHT", address: "LiGHtkg3uTa9836RaNkKLLriqTNRcMdRAhqjGWNv777", category: "DeFi" },
  { symbol: "WLFI", address: "WLFinEv6ypjkczcS83FZqFpgFZYwQXutRbxGe7oC16g", category: "DeFi" },
  { symbol: "ZEUS", address: "ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq", category: "DeFi" },
  { symbol: "W", address: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ", category: "DeFi" },
  { symbol: "SAROS", address: "SarosY6Vscao718M4A778z4CGtvcwcGef5M9MEH1LGL", category: "DeFi" },
  { symbol: "LAYER", address: "LAYER4xPpTCb3QL8S9u41EAhAX7mhBn8Q6xMTwY2Yzc", category: "DeFi" },
  { symbol: "DRIFT", address: "DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7", category: "DeFi" },
  { symbol: "JTO", address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL", category: "DeFi" },
  { symbol: "JUP", address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", category: "DeFi" },
  { symbol: "ORCA", address: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE", category: "DeFi" },
  { symbol: "RAY", address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", category: "DeFi" },
  { symbol: "DBR", address: "DBRiDgJAMsM95moTzJs7M9LnkGErpbv9v6CUR1DXnUu5", category: "DeFi" },
  { symbol: "MNDE", address: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey", category: "DeFi" },
  { symbol: "JLP", address: "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4", category: "DeFi" },
  { symbol: "FLP.1", address: "NUZ3FDWTtN5SP72BsefbsqpnbAY5oe21LE8bCSkqsEK", category: "DeFi" },
  { symbol: "ALP", address: "4yCLi5yWGzpTWMQ1iWHG5CrGYAdBkhyEdsuSugjDUqwj", category: "DeFi" },
  { symbol: "COLLAT", address: "C7heQqfNzdMbUFQwcHkL9FvdwsFsDRBnfwZDDyWYCLTZ", category: "DeFi" },
  { symbol: "CARDS", address: "CARDSccUMFKoPRZxt5vt3ksUbxEFEcnZ3H2pd3dKxYjp", category: "DeFi" },

  // Infrastructure
  { symbol: "GRASS", address: "Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs", category: "Infrastructure" },
  { symbol: "HNT", address: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux", category: "Infrastructure" },
  { symbol: "HONEY", address: "4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy", category: "Infrastructure" },
  { symbol: "IO", address: "BZLbGTNCSFfoth2GYDtwr7e4imWzpR5jqcUuGEwr646K", category: "Infrastructure" },
  { symbol: "RENDER", address: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof", category: "Infrastructure" },
  { symbol: "PAXG", address: "C6oFsE8nXRDThzrMEQ5SxaNFGKoyyfWDDVPw37JKvPTe", category: "Infrastructure" },
  { symbol: "PRCL", address: "4LLbsb5ReP3yEtYzmXewyGjcir5uXtKFURtaEUVC2AHs", category: "Infrastructure" },
  { symbol: "INF", address: "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm", category: "Infrastructure" },
  { symbol: "PST", address: "59obFNBzyTBGowrkif5uK7ojS58vsuWz3ZCvg6tfZAGw", category: "Infrastructure" },
  { symbol: "ONYC", address: "5Y8NV33Vv7WbnLfq3zBcKSdYPrk7g2KoiQoe7M2tcxp5", category: "Infrastructure" },
  { symbol: "HYPE", address: "98sMhvDwXj1RQi5c5Mndm3vPe9cBqPrbLaufMXFNMh5g", category: "Infrastructure" },

  // Liquid Staking Tokens
  { symbol: "SOL", address: "So11111111111111111111111111111111111111112", category: "LST" },
  { symbol: "BBSOL", address: "Bybit2vBJGhPF52GBdNaQfUJ6ZpThSgHBobjWZpLPb4B", category: "LST" },
  { symbol: "BNSOL", address: "BNso1VUJnh4zcfpZa6986Ea66P6TCp59hvtNJ8b1X85", category: "LST" },
  { symbol: "bonkSOL", address: "BonK1YhkXEGLZzwtcvRTip3gAL9nCeQD7ppZBLXhtTs", category: "LST" },
  { symbol: "BSOL", address: "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1", category: "LST" },
  { symbol: "CDCSOL", address: "CDCSoLckzozyktpAp9FWT3w92KFJVEUxAU7cNu2Jn3aX", category: "LST" },
  { symbol: "CGNTSOL", address: "CgnTSoL3DgY9SFHxcLj6CgCgKKoTBr6tp4CPAEWy25DE", category: "LST" },
  { symbol: "dfdvSOL", address: "sctmB7GPi5L2Q5G9tUSzXvhZ4YiDMEGcRov9KfArQpx", category: "LST" },
  { symbol: "DSOL", address: "Dso1bDeDjCQxTrWHqUUi63oBvV7Mdm6WaobLbQ7gnPQ", category: "LST" },
  { symbol: "ezSOL", address: "ezSoL6fY1PVdJcJsUpe5CM3xkfmy3zoVCABybm5WtiC", category: "LST" },
  { symbol: "HSOL", address: "he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A", category: "LST" },
  { symbol: "HUBSOL", address: "HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX", category: "LST" },
  { symbol: "JITOSOL", address: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn", category: "LST" },
  { symbol: "JUPSOL", address: "jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v", category: "LST" },
  { symbol: "JupSOL", address: "jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v", category: "LST" },
  { symbol: "LAINESOL", address: "LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X", category: "LST" },
  { symbol: "MSOL", address: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", category: "LST" },
  { symbol: "picoSOL", address: "picobAEvs6w7QEknPce34wAE4gknZA9v5tTonnmHYdX", category: "LST" },
  { symbol: "strongSOL", address: "strng7mqqc1MBJJV6vMzYbEqnwVGvKKGKedeCvtktWA", category: "LST" },
  { symbol: "STSOL", address: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj", category: "LST" },
  { symbol: "VSOL", address: "vSoLxydx6akxyMD9XEcPvGYNGq6Nn66oqVb3UkGkei7", category: "LST" },

  // Stablecoins
  { symbol: "EURC", address: "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr", category: "Stablecoin" },
  { symbol: "FDUSD", address: "9zNQRsGLjNKwCUU5Gq5LR8beUCPzQMVMqKAi3SSZh54u", category: "Stablecoin" },
  { symbol: "PYUSD", address: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo", category: "Stablecoin" },
  { symbol: "USDC", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", category: "Stablecoin" },
  { symbol: "USDe", address: "DEkqHyPN7GMRJ5cArtQFAWefqbZb33Hyf6s5iCwjEonT", category: "Stablecoin" },
  { symbol: "USDG", address: "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH", category: "Stablecoin" },
  { symbol: "USDH", address: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX", category: "Stablecoin" },
  { symbol: "USDS", address: "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA", category: "Stablecoin" },
  { symbol: "USDT", address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", category: "Stablecoin" },
  { symbol: "UXD", address: "7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT", category: "Stablecoin" },
  { symbol: "SYRUPUSDC", address: "AvZZF1YaZDziPY2RCK4oJrRVrbN3mTD9NL24hPeaZeUj", category: "Stablecoin" },
  { symbol: "SUSDE", address: "Eh6XEPhSwoLv5wFApukmnaVSHQ6sAnoD9BmgmwQoN2sN", category: "Stablecoin" },

  // Wrapped Assets
  { symbol: "wstETH", address: "ZScHuTtqZukUrtZS43teTKGs2VqkKL8k4QCouR2n6Uo", category: "Wrapped" },
  { symbol: "AVAX", address: "AUrMpCDYYcPuHhyNX8gEEqbmDPFUpBpHrNW3vPeCFn5Z", category: "Wrapped" },
  { symbol: "cbBTC", address: "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij", category: "Wrapped" },
  { symbol: "tBTC", address: "6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU", category: "Wrapped" },
  { symbol: "WBTC", address: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh", category: "Wrapped" },
  { symbol: "WETH", address: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", category: "Wrapped" },
  { symbol: "xBTC", address: "CtzPWv73Sn1dMGVU3ZtLv9yWSyUAanBni19YWDaznnkn", category: "Wrapped" },
  { symbol: "TRX", address: "GbbesPbaYh5uiAZSYNXTc7w9jty1rpg3P9L4JeN4LkKc", category: "Wrapped" },
  { symbol: "LBTC", address: "LBTCgU4b3wsFKsPwBn1rRZDx5DoFutM6RPiEt1TPDsY", category: "Wrapped" },
  { symbol: "ZBTC", address: "zBTCug3er3tLyffELcvDNrKkCymbPWysGcWihESYfLg", category: "Wrapped" },
  { symbol: "ZENBTC", address: "9hX59xHHnaZXLU6quvm5uGY2iDiT3jczaReHy6A6TYKw", category: "Wrapped" },
];

// Popular tokens for quick access
export const POPULAR_TOKENS = ALL_TOKENS.filter(t =>
  ["WIF", "BONK", "POPCAT", "AI16Z", "VIRTUAL", "JUP", "SOL", "USDC", "cbBTC", "PYTH"].includes(t.symbol)
);

// Get token by symbol
export function getTokenBySymbol(symbol: string): Token | undefined {
  return ALL_TOKENS.find((t) => t.symbol.toUpperCase() === symbol.toUpperCase());
}

// Get token by address
export function getTokenByAddress(address: string): Token | undefined {
  return ALL_TOKENS.find((t) => t.address === address);
}

// Search tokens
export function searchTokens(query: string): Token[] {
  if (!query || query.trim().length === 0) return ALL_TOKENS;

  const q = query.toLowerCase().trim();
  return ALL_TOKENS.filter(
    (t) =>
      t.symbol.toLowerCase().includes(q) ||
      t.address.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q)
  );
}

// Group tokens by category
export function getTokensByCategory(): Record<string, Token[]> {
  const grouped: Record<string, Token[]> = {};

  ALL_TOKENS.forEach((token) => {
    const category = token.category || "Other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(token);
  });

  return grouped;
}



// 参数是一个 wallet address
// 返回是一个只有前 5 位和后 5 位的 wallet address，中间用 ... 代替
export const formatWalletAddress = (walletAddress: string) => {
  if(!walletAddress) {
    return
  }
  if (walletAddress.length < 10) {
    return walletAddress;
  }
  return walletAddress.slice(0, 5) + "..." + walletAddress.slice(walletAddress.length - 5);
};

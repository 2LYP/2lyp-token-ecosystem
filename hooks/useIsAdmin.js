import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";

export function useIsAdmin() {
  const { address, isConnected } = useAccount();

  const { data: ownerAddress, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "owner",
  });

  const isAdmin =
    isConnected &&
    ownerAddress &&
    address?.toLowerCase() === ownerAddress.toLowerCase();

  return { isAdmin, isLoading, isError };
}

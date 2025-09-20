import { Wallet, HDNodeWallet, Mnemonic, JsonRpcProvider, formatEther, encodeBase58 } from "ethers";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const RPC_URLS = {
    mainnet: {
        evm: "https://ethereum.publicnode.com",
        sol: "https://api.mainnet-beta.solana.com",
    },
    testnet: {
        evm: "https://eth-sepolia.g.alchemy.com/v2/demo",
        sol: "https://api.devnet.solana.com",
    }
};

export function getKeysFromMnemonic(mnemonic) {
    const seed = Mnemonic.fromPhrase(mnemonic).computeSeed();
    const masterNode = HDNodeWallet.fromSeed(seed);

    const evmNode = masterNode.derivePath("m/44'/60'/0'/0/0");
    const solanaNode = masterNode.derivePath("m/44'/501'/0'/0'");
    const suiNode = masterNode.derivePath("m/44'/784'/0'/0'/0'");

    const evmWallet = new Wallet(evmNode.privateKey);
    
    const solanaHexKey = solanaNode.privateKey;
    const solanaSeed = Buffer.from(solanaHexKey.slice(2), 'hex');
    const solanaKeypair = Keypair.fromSeed(solanaSeed);

    const suiHexKey = suiNode.privateKey;
    const suiSecretKey = Buffer.from(suiHexKey.slice(2), 'hex');
    const suiKeypair = Ed25519Keypair.fromSecretKey(suiSecretKey);
    
    return {
        mnemonic: mnemonic,
        evm: { address: evmWallet.address, privateKey: evmWallet.privateKey.slice(2) },
        solana: { address: solanaKeypair.publicKey.toBase58(), privateKey: encodeBase58(solanaKeypair.secretKey) },
        sui: { address: suiKeypair.getPublicKey().toSuiAddress(), privateKey: suiKeypair.getSecretKey() },
    };
}

export async function checkAllBalances(walletData, network) {
    const evmProvider = new JsonRpcProvider(RPC_URLS[network].evm);
    const solConnection = new Connection(RPC_URLS[network].sol);
    const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
    
    const [evmBalanceWei, solBalanceLamports, suiBalanceResult] = await Promise.all([
        evmProvider.getBalance(walletData.evm.address),
        solConnection.getBalance(new PublicKey(walletData.solana.address)),
        suiClient.getBalance({ owner: walletData.sui.address })
    ]);
    
    return {
        evm: formatEther(evmBalanceWei),
        sol: solBalanceLamports / LAMPORTS_PER_SOL,
        sui: parseInt(suiBalanceResult.totalBalance) / 1_000_000_000
    };
}
import { Wallet, HDNodeWallet, Mnemonic, JsonRpcProvider, formatEther, encodeBase58 } from "ethers";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { derivePath } from 'ed25519-hd-key'; // <-- IMPORT BARU

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

    // --- 1. Derivasi EVM (SECP256k1) ---
    // Metode ini tetap sama, menggunakan ethers.js
    const masterNodeEVM = HDNodeWallet.fromSeed(seed);
    const evmNode = masterNodeEVM.derivePath("m/44'/60'/0'/0/0");
    const evmWallet = new Wallet(evmNode.privateKey);

    // --- 2. Derivasi Solana (Ed25519) ---
    // METODE BARU: Menggunakan library khusus Ed25519
    // Path ini adalah yang digunakan oleh Phantom dan Metamask Snap
    const solanaSeed = derivePath("m/44'/501'/0'/0'", Buffer.from(seed.slice(2), 'hex')).key;
    const solanaKeypair = Keypair.fromSeed(solanaSeed);

    // --- 3. Derivasi Sui (Ed25519) ---
    // Juga menggunakan library khusus Ed25519 untuk konsistensi
    const suiSeed = derivePath("m/44'/784'/0'/0'/0'", Buffer.from(seed.slice(2), 'hex')).key;
    const suiKeypair = Ed25519Keypair.fromSecretKey(suiSeed);
    
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

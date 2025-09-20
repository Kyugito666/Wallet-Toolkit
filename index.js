import { Wallet } from "ethers";
import chalk from "chalk";
import readline from 'readline';
import * as crypto from './crypto.js';
import * as ui from './ui.js';

let activeWallet = null;

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
        console.log(chalk.yellow('\nProgram dihentikan.'));
        process.exit(0);
    }
});

async function runWalletLoadedMenu() {
    while (activeWallet) {
        ui.printHeader();
        ui.showWalletStatus(activeWallet);
        const action = await ui.showMainMenu_WalletLoaded();
        
        switch (action) {
            case 'Cek Saldo': {
                const network = await ui.askForNetwork();
                await ui.displayBalances(() => crypto.checkAllBalances(activeWallet, network));
                break;
            }
            case 'Tampilkan Detail Lengkap': {
                ui.displayWalletDetails(activeWallet);
                break;
            }
            case 'Simpan Ulang ke File (Backup)': {
                ui.saveWalletToFile(activeWallet);
                break;
            }
            case 'Faucet (Coming Soon)': {
                ui.showFaucetInfo();
                break;
            }
            case 'Keluarkan Wallet (Kembali)': {
                activeWallet = null;
                console.log(chalk.yellow('\n dompet dikeluarkan.'));
                break;
            }
        }
        if (activeWallet) await ui.askToContinue();
    }
}

async function main() {
    while (true) {
        ui.printHeader();
        ui.showWalletStatus(activeWallet);
        const action = await ui.showMainMenu_NoWallet();

        switch (action) {
            case 'Buat Wallet Baru': {
                const newWallet = Wallet.createRandom();
                activeWallet = crypto.getKeysFromMnemonic(newWallet.mnemonic.phrase);
                ui.displayNewWallet(newWallet.mnemonic.phrase);
                ui.saveWalletToFile(activeWallet);
                await runWalletLoadedMenu();
                break;
            }
            case 'Muat Wallet dari File': {
                const selectedMnemonic = await ui.selectPhraseFromFile();
                if (selectedMnemonic) {
                    activeWallet = crypto.getKeysFromMnemonic(selectedMnemonic);
                    console.log(chalk.green('\n dompet berhasil dimuat.'));
                    await runWalletLoadedMenu();
                } else {
                    await ui.askToContinue();
                }
                break;
            }
            case 'Keluar': {
                console.log(chalk.yellow('\nTerima kasih!'));
                process.exit(0);
            }
        }
    }
}

main().catch(console.error);
import { Wallet } from "ethers";
import chalk from "chalk";
import readline from 'readline';
import fs from 'fs'; // <-- Tambahkan fs
import ora from 'ora'; // <-- Tambahkan ora untuk spinner
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
                 console.log(chalk.green.bold('\n✅ Data wallet berhasil disimpan ulang ke file .txt.'));
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
                console.log(chalk.green.bold('\n✅ Data wallet baru berhasil ditambahkan ke file .txt.'));
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
            // --- LOGIKA FITUR BARU ---
            case 'Sinkronkan Wallet dari phrase.txt': {
                const spinner = ora('Membaca file dan memproses wallet...').start();
                try {
                    if (!fs.existsSync('phrase.txt')) {
                        spinner.fail(chalk.red('File phrase.txt tidak ditemukan.'));
                        await ui.askToContinue();
                        break;
                    }

                    const phrases = fs.readFileSync('phrase.txt', 'utf8').trim().split(/\r?\n/).filter(line => line.trim() !== '');
                    let existingAddresses = new Set();
                    if (fs.existsSync('address_evm.txt')) {
                        const addressesData = fs.readFileSync('address_evm.txt', 'utf8');
                        const matches = addressesData.matchAll(/\]\s*(0x[a-fA-F0-9]{40})/g);
                        for (const match of matches) {
                            existingAddresses.add(match[1]);
                        }
                    }

                    let newWallets = 0;
                    let skippedWallets = 0;

                    for (const phrase of phrases) {
                        const walletData = crypto.getKeysFromMnemonic(phrase);
                        if (!existingAddresses.has(walletData.evm.address)) {
                            ui.saveWalletToFile(walletData);
                            existingAddresses.add(walletData.evm.address);
                            newWallets++;
                        } else {
                            skippedWallets++;
                        }
                    }
                    
                    spinner.succeed(chalk.green('Sinkronisasi selesai!'));
                    console.log(chalk.cyan(`\n✨ Hasil: ${newWallets} wallet baru ditambahkan, ${skippedWallets} wallet sudah ada dan dilewati.`));

                } catch (error) {
                    spinner.fail(chalk.red('Terjadi kesalahan saat sinkronisasi.'));
                    console.error(error);
                }
                await ui.askToContinue();
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

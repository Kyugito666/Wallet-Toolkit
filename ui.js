import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import fs from 'fs';
import boxen from 'boxen';
import Table from 'cli-table3';

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'magenta',
    titleAlignment: 'center',
    textAlignment: 'center'
};

export function printHeader() {
    console.clear();
    const title = chalk.bold('Crypto Wallet Toolkit');
    const author = chalk.cyan('Dibuat oleh: Kyugito666 & Gemini');
    console.log(boxen(`${title}\n\n${author}`, boxenOptions));
}

export function showWalletStatus(walletData) {
    if (walletData) {
        console.log(chalk.green(` dompet Aktif: ${chalk.bold(walletData.evm.address)}\n`));
    } else {
        console.log(chalk.yellow(' Belum ada dompet yang aktif.\n'));
    }
}

export async function showMainMenu_NoWallet() {
    const { action } = await inquirer.prompt([{
        type: 'list', name: 'action', message: 'Pilih Aksi:',
        choices: [ '1. Buat Wallet Baru', '2. Muat Wallet dari File', new inquirer.Separator(), '3. Keluar'],
        filter(val) { return val.split('. ')[1]; }
    }]);
    return action;
}

export async function showMainMenu_WalletLoaded() {
    const { action } = await inquirer.prompt([{
        type: 'list', name: 'action', message: 'Wallet Aktif:',
        choices: [
            '1. Cek Saldo', 
            '2. Tampilkan Detail Lengkap',
            '3. Simpan Ulang ke File (Backup)',
            '4. Faucet (Coming Soon)',
            new inquirer.Separator(),
            '5. Keluarkan Wallet (Kembali)',
        ],
        filter(val) { return val.split('. ')[1]; }
    }]);
    return action;
}

export async function selectPhraseFromFile() {
    try {
        if (!fs.existsSync('phrase.txt')) {
            console.log(chalk.red('\nFile phrase.txt tidak ditemukan.'));
            return null;
        }
        const data = fs.readFileSync('phrase.txt', 'utf8');
        const entries = data.trim().split(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]\n/).filter(p => p.trim() !== '');
        const timestamps = data.match(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/g) || [];
        if (entries.length === 0) {
            console.log(chalk.yellow('\nFile phrase.txt kosong.'));
            return null;
        }

        const choices = entries.map((entry, index) => {
            const phrase = entry.trim().replace(/\n/g, ' ');
            return { 
                name: `${chalk.gray(timestamps[index])} ${phrase.substring(0, 20)}...`, 
                value: phrase 
            };
        });

        const { selectedPhrase } = await inquirer.prompt([{
            type: 'list', name: 'selectedPhrase', message: 'Pilih phrase untuk dimuat:', choices: choices,
        }]);
        return selectedPhrase;
    } catch { 
        return null;
    }
}

export function saveWalletToFile(wallet) {
    try {
        if (fs.existsSync('phrase.txt')) {
            const existingPhrases = fs.readFileSync('phrase.txt', 'utf8');
            if (existingPhrases.includes(wallet.mnemonic)) {
                console.log(chalk.yellow('\nInfo: Data wallet ini sudah tersimpan. Proses backup dilewati.'));
                return;
            }
        }

        const timestamp = new Date().toISOString();
        const appendToFile = (filePath, data) => fs.appendFileSync(filePath, `[${timestamp}] ${data}\n`, 'utf8');
        
        const phraseContent = `[${timestamp}]\n${wallet.mnemonic}\n\n`;
        fs.appendFileSync('phrase.txt', phraseContent, 'utf8');
        appendToFile('address_evm.txt', wallet.evm.address);
        appendToFile('address_sol.txt', wallet.solana.address);
        appendToFile('address_sui.txt', wallet.sui.address);
        appendToFile('privatekey_evm.txt', wallet.evm.privateKey);
        appendToFile('privatekey_sol.txt', wallet.solana.privateKey);
        appendToFile('privatekey_sui.txt', wallet.sui.privateKey);
        console.log(chalk.green.bold('\n✅ Data wallet baru berhasil ditambahkan ke file .txt.'));
    } catch (error) {
        console.log(chalk.red.bold(`\n❌ Gagal menyimpan file:`, error.message));
    }
}

export function displayNewWallet(mnemonic) {
    const content = `${chalk.green(' dompet BARU DIBUAT!')}\n\n${chalk.cyan.bold(mnemonic)}`;
    console.log(boxen(content, {...boxenOptions, borderColor: 'green', title: 'Mnemonic Phrase'}));
}

export function displayWalletDetails(walletData) {
    const table = new Table({
        head: [chalk.cyan('Jaringan'), chalk.cyan('Alamat'), chalk.cyan('Private Key')],
        colWidths: [10, 45, 70],
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
               , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });

    table.push(
        [chalk.yellow('EVM'), chalk.white(walletData.evm.address), chalk.white(walletData.evm.privateKey)],
        [chalk.yellow('Solana'), chalk.white(walletData.solana.address), chalk.white(walletData.solana.privateKey)],
        [chalk.yellow('Sui'), chalk.white(walletData.sui.address), chalk.white(walletData.sui.privateKey)]
    );
    
    console.log(chalk.bold.cyan('\n--- Detail Wallet Aktif ---'));
    console.log(table.toString());
}

export async function askForNetwork() {
    const { network } = await inquirer.prompt([{
        type: 'list', name: 'network', message: 'Pilih Jaringan:', choices: ['mainnet', 'testnet'],
    }]);
    return network;
}

export async function displayBalances(balanceFunction) {
    const spinner = ora('Mengambil saldo...').start();
    try {
        const balances = await balanceFunction();
        spinner.succeed(chalk.green('Saldo berhasil diambil!'));
        
        const table = new Table({ head: [chalk.cyan('Jaringan'), chalk.cyan('Saldo')] });
        table.push(
            [chalk.yellow('EVM (ETH)'), chalk.white(`${balances.evm} ETH`)],
            [chalk.yellow('Solana (SOL)'), chalk.white(`${balances.sol} SOL`)],
            [chalk.yellow('Sui (SUI)'), chalk.white(`${balances.sui} SUI`)]
        );
        console.log(table.toString());

    } catch (error) {
        spinner.fail(chalk.red('Gagal mengambil saldo.'));
    }
}

export function showFaucetInfo() {
    const info = chalk.yellow('Fitur ini sedang dalam pengembangan.');
    console.log(boxen(info, {...boxenOptions, borderColor: 'yellow', title: 'Faucet (Coming Soon)'}));
}

export async function askToContinue() {
    await inquirer.prompt([{ type: 'input', name: 'continue', message: '\nTekan Enter untuk kembali ke menu utama...' }]);
}
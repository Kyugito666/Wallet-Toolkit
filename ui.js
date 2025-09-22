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
        choices: [
            '1. Buat Wallet Baru',
            '2. Muat Wallet dari File',
            '3. Sinkronkan Wallet dari phrase.txt',
            new inquirer.Separator(),
            '4. Keluar'
        ],
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
        const phrases = data.trim().split(/\r?\n/).filter(line => line.trim() !== '');

        if (phrases.length === 0) {
            console.log(chalk.yellow('\nFile phrase.txt kosong.'));
            return null;
        }

        const choices = phrases.map((phrase, index) => {
            return {
                name: `[${index + 1}] ${phrase.substring(0, 40)}...`,
                value: phrase
            };
        });

        const { selectedPhrase } = await inquirer.prompt([{
            type: 'list', name: 'selectedPhrase', message: 'Pilih phrase untuk dimuat:', choices: choices,
        }]);
        return selectedPhrase;
    } catch (e) {
        console.error(chalk.red('Gagal membaca file phrase.txt:'), e);
        return null;
    }
}

// --- PERUBAHAN UTAMA ADA DI FUNGSI INI ---
export function saveWalletToFile(wallet) {
    try {
        // Fungsi appendToFile sekarang tidak lagi menggunakan timestamp
        const appendToFile = (filePath, data) => {
            // Menambah baris baru di awal jika file sudah ada isinya
            const content = fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8').length > 0 ? '\n' + data : data;
            fs.appendFileSync(filePath, content, 'utf8');
        }

        appendToFile('address_evm.txt', wallet.evm.address);
        appendToFile('address_sol.txt', wallet.solana.address);
        appendToFile('address_sui.txt', wallet.sui.address);
        appendToFile('privatekey_evm.txt', wallet.evm.privateKey);
        appendToFile('privatekey_sol.txt', wallet.solana.privateKey);
        appendToFile('privatekey_sui.txt', wallet.sui.privateKey);

        // Logika untuk menyimpan phrase.txt tetap sama (tanpa timestamp)
        let phraseContent = '';
        if (fs.existsSync('phrase.txt')) {
            phraseContent = fs.readFileSync('phrase.txt', 'utf8');
        }
        if (!phraseContent.includes(wallet.mnemonic.trim())) {
            const contentToAppend = (phraseContent.length > 0 && !phraseContent.endsWith('\n') ? '\n' : '') + wallet.mnemonic.trim();
            fs.appendFileSync('phrase.txt', contentToAppend, 'utf8');
        }

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

    console.log(chalk.bold.cyan('\n--- Detail Wallet ---'));
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

const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

//清空之前编译的结果
const compileDir = path.resolve(__dirname, '../compiled');
fs.removeSync(compileDir);
fs.ensureDirSync(compileDir);

//找到合约文件的地址，编译合约
// const contractPath = path.resolve(__dirname, '../contracts', 'Car.sol');
// const contractSource = fs.readFileSync(contractPath, 'utf8');
// const compiledContract = solc.compile(contractSource, 1);
const contractFiles = fs.readdirSync(path.resolve(__dirname, '../contracts'));
contractFiles.forEach(contractFile => {
    const contractPath = path.resolve(__dirname, '../contracts', contractFile);
    const contractSource = fs.readFileSync(contractPath, 'utf8');
    const compiledContract = solc.compile(contractSource, 1);
    console.log('compiled contract', compiledContract);


    
    //为了更好的显示编译过程中出现的错误
    if (Array.isArray(compiledContract.errors) && compiledContract.errors.length) {
        throw new Error(compiledContract.errors[0]);
    }

    //将编译后的结果保存下来
    Object.keys(compiledContract.contracts).forEach(name => {
        const contractName = name.replace(/^:/, '');
        const filePath = path.resolve(compileDir, `${contractName}.json`);
        fs.outputJsonSync(filePath, compiledContract.contracts[name]);
        console.log(`compiled file ${contractName} have saved in ${filePath}`);
    });
});

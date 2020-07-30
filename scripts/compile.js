const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

//���֮ǰ����Ľ��
const compileDir = path.resolve(__dirname, '../compiled');
fs.removeSync(compileDir);
fs.ensureDirSync(compileDir);

//�ҵ���Լ�ļ��ĵ�ַ�������Լ
// const contractPath = path.resolve(__dirname, '../contracts', 'Car.sol');
// const contractSource = fs.readFileSync(contractPath, 'utf8');
// const compiledContract = solc.compile(contractSource, 1);
const contractFiles = fs.readdirSync(path.resolve(__dirname, '../contracts'));
contractFiles.forEach(contractFile => {
    const contractPath = path.resolve(__dirname, '../contracts', contractFile);
    const contractSource = fs.readFileSync(contractPath, 'utf8');
    const compiledContract = solc.compile(contractSource, 1);
    console.log('compiled contract', compiledContract);


    
    //Ϊ�˸��õ���ʾ��������г��ֵĴ���
    if (Array.isArray(compiledContract.errors) && compiledContract.errors.length) {
        throw new Error(compiledContract.errors[0]);
    }

    //�������Ľ����������
    Object.keys(compiledContract.contracts).forEach(name => {
        const contractName = name.replace(/^:/, '');
        const filePath = path.resolve(compileDir, `${contractName}.json`);
        fs.outputJsonSync(filePath, compiledContract.contracts[name]);
        console.log(`compiled file ${contractName} have saved in ${filePath}`);
    });
});

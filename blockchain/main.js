const SHA256=require('crypto-js/sha256');
class Block{
    constructor(index,timestamp,data,previousHash=''){
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
    }
    calculateHash(){
        return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)).toString();
    }
}
class Blockchain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new Block(0,"16/06/2023","Genesis Block","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock){
        newBlock.previousHash=this.getLatestBlock().hash;
        newBlock.hash=newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];
            if(currentBlock.hash!==currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash!==previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}
let MuCoin=new Blockchain();
MuCoin.addBlock(new Block(1,"17/06/2023",{amount:4}));
MuCoin.addBlock(new Block(2,"18/06/2023",{amount:10}));
console.log(JSON.stringify(MuCoin,null,4));
console.log('Validity Check Before Tampering: '+MuCoin.isChainValid());
MuCoin.chain[1].data={amount:100};
console.log('Validity Check After Tampering Data: '+MuCoin.isChainValid());
MuCoin.chain[1].hash=MuCoin.chain[1].calculateHash();
console.log('Validity Check After Tampering Hash: '+MuCoin.isChainValid());

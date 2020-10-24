// Lottery: 2020-10-05
pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;   // Dynamic Array 
    
    function Lottery() public {
        manager = msg.sender; 
    }
    
    function enter() public payable { // Function Type類型: public, private, view, constant & pure, payable
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) { //生成假的隨機數
        return uint(keccak256(block.difficulty, now, players));
    }
    
    function pickWinner() public restrickted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players  = new address[](0); 
    }
    
    modifier restrickted() { // Modifier 的功用
        require (msg.sender == manager); //確保只有 manager可以執行
        _; 
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
    
}
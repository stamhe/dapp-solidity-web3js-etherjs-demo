rawOpcodes =
    'PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x42 PUSH1 0x0 DUP2 SWAP1 SSTORE POP PUSH1 0xC5 DUP1 PUSH2 0x27 PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH1 0xF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH1 0x28 JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0xF8A8FD6D EQ PUSH1 0x2D JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x33 PUSH1 0x47 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH1 0x3E SWAP2 SWAP1 PUSH1 0x76 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x58 SWAP1 POP PUSH1 0x63 PUSH1 0x0 DUP2 SWAP1 SSTORE POP PUSH1 0x0 SLOAD SWAP2 POP POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x70 DUP2 PUSH1 0x5F JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH1 0x89 PUSH1 0x0 DUP4 ADD DUP5 PUSH1 0x69 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 INVALID PUSH13 0x95CFDE1969EDDF166DA0CAB85A CALLDATALOAD KECCAK256 LOG0 MSTORE 0xAE PUSH20 0xEC58DA539CC77241E5E1B64736F6C6343000811 STOP CALLER';
arrOpcodes = rawOpcodes.split(' ');
// console.log(arrOpcodes);

for (let i = 1; i <= arrOpcodes.length; i++) {
    const element = arrOpcodes[i - 1];
    console.log(`${i} ${element}`);
}

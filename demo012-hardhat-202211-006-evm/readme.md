# EVM - 内存布局
## solidity 基于 0.8.0 以上，solc 使用最新的 0.8.17
### 0 文档说明
```

Solidity EVM 状态变量内存布局
https://mirror.xyz/xyyme.eth/5eu3_7f7275rqY-fNMUP5BKS8izV9Tshmv8Z5H9bsec

EVM Deep Dives: The Path to Shadowy Super Coder - 非常非常重要
https://noxx.substack.com/archive

引介｜EVM 深入探讨-Part 1
https://mp.weixin.qq.com/s/KX_mVRb2uyO0hLsONCOcaA

引介｜EVM 深入探讨 Part 2
https://mp.weixin.qq.com/s/fif_-19KZUY3ccWFaqw_4g


深入理解 EVM（一）
https://mirror.xyz/xyyme.eth/GNVcUgKAOEiLyClKeqkmD35ctLu6_XomT3ZDIfV3tz8

深入理解 EVM（二）
https://mirror.xyz/xyyme.eth/6vqE2DRsMzlPNmh3kYiwTdMBj-9hanmxyDuTHM7tZDU

深入理解 EVM（三）
https://mirror.xyz/xyyme.eth/dsU7KoQLyqiHrY0bQX2ETq1zkDYiW-3PtzxfzGwRdss

理解 EVM - 探究Solidity 背后的秘密
https://learnblockchain.cn/column/22




编译字节码
solc Memory001.sol --bin

获取合约的 metadata hash 信息
solc Memory001.sol --metadata


得到 init bytecode 对应的 opcodes
solc Memory002.sol --opcodes

得到合约的 abi
solc Memmory001.sol --abi

输出到特定目录(不能指定文件名)
solc Memory001.sol --abi -o output 

重新编译进行覆盖
solc Memory001.sol --abi -o output --overwrite

状态变量的存储布局
solc Storage004.sol --storage-layout --pretty-json

运行时和 metahash 的16进制
solc Memory001.sol --bin-runtime

获取 abi 信息
solc Memory001.sol --abi

获取汇编
solc Memory001.sol --asm
solc Memory001.sol --asm-json

打印所有的函数签名字符串
solc Memory001.sol --hashes




使用单元测试
npx hardhat test



一、状态变量内存布局 Storage Layout
await provider.getStorageAt(s1Addr, 0);
第一个参数是部署的合约地址
第二个参数是插槽的位置，这里注意，如果是十进制，就直接写数字. 如果是十六进制，需要加上引号，例如 '0x0'
【一个插槽的大小固定是 32 字节(256位)】
【固定长度数据类型】
Storage001.sol 合约的 a,b,c 三个变量都是 uint256 类型的，
恰好每个变量都占用了一个插槽，分别是插槽0，1，2

Storage002.sol 合约的 a,b,c 三个变量分别是 uint8, uint8, uint256 类型的, 
只有插槽0, 1 有数据， 插槽 2 没有数据，因为一个插槽的大小是 32 字节，
而 a 和 b 都只占用 1 个字节，Solidity 为了节省存储空间，会将它俩放在同一个插槽中，
而下一个 c 变量，由于它占用了 32 字节，因此它要占用下一个插槽

Storage003.sol 合约的 a,b,c 三个变量分别是 uint8, uint256, uint8 类型的, 
三个变量都各自占据了一个插槽，这是因为，虽然 a 只占据了插槽 0 中的 1 个字节，
但是由于下一个变量 c 要占据一整个插槽，所以 c 只能去下一个插槽，
那么 b 也就只能去第三个插槽了。



【非固定长度数据类型】
Storage004.sol 合约的 a,b,c变量分别是 string, string, mapping(uint256 => uint256),uint256[] 类型.
一、string，bytes 这种非固定长度的类型，它们的存储规则是：
    1. 如果数据长度小于等于 31 字节， 则它存储在高位字节（左对齐），
        最低位最后一个字节存储 length * 2 | flag。当 flag =1, 表示length > 31, 否则长度 <= 31
    2. 如果数据长度超出 31 字节，
        A. 主插槽存储 length * 2 | flag。当 flag =1, 表示length > 31, 否则长度 <= 31
        B. 数据存储在 keccak256(abi.encode(slotNo)) 中。
        C. 如果大于 32 字节，那么剩余的长度就会继续往下一个插槽
            【即 keccak256(abi.encode(slotNo)) + 1 】延伸

二、对于 mapping 类型，规则是：
    所处的插槽，空置，不存储内容，
    mapping 中的数据，存储在插槽 keccak256(key, slotNo) 中，也就是：
        keccak256(abi.encode(key, slotNo))

三、数组类型，它所满足的规则是：
    所处的插槽，存储数组的长度。随着数据变化而变化更新。
    数组内存储的元素，存储在以 keccak256(abi.encode(slotNo)) + arrIndex  插槽开始的位置

四、组合类型，例如 mapping(uint256 => uint256[])，那么就按照组合的规则，从外到里进行计算即可



二、合约内存布局 Memory Layout



编译字节码
solc Memory001.sol --bin
======= Memory001.sol:Memory001 =======
Binary:
6080604052348015600f57600080fd5b506001600081905550603f8060256000396000f3fe6080604052600080fdfea2646970667358221220193f52380bf3c76731eef9ecc1f1c6fa3b46d0735a220e7297cbba8b93ed068e64736f6c63430008110033

上面的字节码中 0xfe 是无效操作符（INVALID）。它的作用其实是分隔符，它将字节码分成了三部分：
    1. init bytecode（初始化字节码，就是合约的部署流程字节码，solc Demo.sol --opcodes 可以得到完整的翻译以后的操作码）
    2. runtime bytecode （运行时字节码）
    3. metadata hash（合约的一些 meta 信息哈希）

如下：
6080604052348015600f57600080fd5b506001600081905550603f8060256000396000f3
fe
6080604052600080fd
fe
a26469706673582212204ca38d4a605f03f1487b9cb337c0853cca3c62a6c42f942ecb021fb7357002b564736f6c634300080f0033

获取合约的 metadata hash 信息
solc Memory001.sol --metadata
主要包含了编译器版本，ABI，IPFS 等信息。详细内容 https://docs.soliditylang.org/en/latest/metadata.html


Memory 的数据结构就是一个简单的字节数组，数据可以以 1 字节（8 位）或者 32 字节（256 位）为单位进行存储，读取时只能以 32 字节为单位读取，但是读取时可以从任意字节处开始读取，不限定于 32 的倍数字节。

用于操作内存的一共有 3 个操作符：
    1. MSTORE (x, y) - 在内存 x 处开始存储 32 字节的数据 y
    2. MLOAD (x) - 将内存 x 处开始的 32 字节数据加载到栈中(读取时只能以 32 字节为单位读取)
    3. MSTORE8 (x, y) - 在内存 x 处存储 1 字节数据 y（32字节栈值中的最低有效字节）

Solidity 中预留了 4 个 32 字节的插槽（slot，32 * 4 = 128 个字节），分别是：
    1. 0x00 - 0x3f (64 字节): 哈希方法的暂存空间
    2. 0x40 - 0x5f (32 字节): 当前已分配内存大小 (也称为空闲内存指针)
    3. 0x60 - 0x7f (32 字节): 零槽，用作空动态内存数组的初始值，永远不能写入值，永久为零。
类式
0000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000080    // 0x80
0000000000000000000000000000000000000000000000000000000000000000

空闲指针指向空闲空间的开始位置(0x80，跳过预留的 128 个字节)，也就是说，要将一个新变量写入内存，给它分配的位置就是空闲指针所指向的位置。需要注意的是，Solidity 中的内存是不会被释放（free）的。
对于空闲指针，它的更新遵守了很简单的原则：

新的空闲指针位置 = 旧的空闲指针位置 + 分配的数据大小

Solidity 的预留空间已经占据了 128 个字节，因此空闲指针的起始位置就只能从 0x80（128字节） 开始。空闲指针本身是存在于 0x40 位置的。由于我们在函数中的操作均需要在内存中进行，因此首要任务就是要通过空闲指针分配内存，所以我们前面才需要使用 6080604052，也就是 MSTORE(0x40, 0x80)，来加载空闲指针。此时是不是已经有些明白为什么所有的合约都是以 6080604052 开头了（有些老版本合约以 6060604052 开头）。

6080604052
开头的 60 代表的是 PUSH1，也就是将后面的一个字节（这里是 80）压入栈中。后面又是一个 60，接着是 40，即代表将 40 压入栈中。后面是 52，代表 MSTORE，它需要消耗两个操作数，需要从栈中获取。也就是说，上面的 6080604052，就代表着：

3. MSTORE
2. PUSH1 0x40
1. PUSH1 0x80
MSTORE 的两个操作数分别为 0x40、0x80(FILO或LIFO, 先进后出)，即 MSTORE(0x40, 0x80)，也就是在内存中地址 0x40 处存储了数据 0x80。

队列用的是先进先出（FIFO）;堆栈用的是先进后出（FILO）。



数据加载相关的指令，一共有4种：
CALLDATALOAD：把输入数据加载到Stack中
CALLDATACOPY：把输入数据加载到Memory中
CODECOPY：把当前合约代码拷贝到Memory中
EXTCODECOPY：把外部合约代码拷贝到Memory中


合约内部调用另外一个合约，有4种调用方式：
CALL
CALLCODE
DELEGATECALL
STATICALL
实际上，可以认为DELEGATECALL是CALLCODE的一个bugfix版本，官方已经不建议使用CALLCODE了。
CALLCODE和DELEGATECALL的区别在于：msg.sender不同。
具体来说，DELEGATECALL会一直使用原始调用者的地址，而CALLCODE不会
在编译器层面把调用view和pure类型的函数编译成STATICCALL指令



字节码的基本逻辑：由操作符和操作数组成的。其中两个字符(16进制字符)代表一个字节，【操作符都是一个字节】，但是操作数可能有多个字节。像我们前面看到的 PUSH1，是将后面的一个字节压入栈中，如果是 PUSH4，就是将后面的四个字节压入栈中。一般将操作符称为 Opcodes，操作符列表
https://www.evm.codes/


solc Memory002.sol --bin
======= Memory002.sol:Memory002 =======
Binary:
6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea26469706673582212209f6d7cdd29ad42e98865fc6ef70ed8383c36265aadd514a8a01a947cfdd1b9c364736f6c63430008110033

6080604052348015600f57600080fd5b50603f80601d6000396000f3
fe
6080604052600080fd
fe
a26469706673582212209f6d7cdd29ad42e98865fc6ef70ed8383c36265aadd514a8a01a947cfdd1b9c364736f6c63430008110033

得到 init bytecode 对应的 opcodes
solc Memory002.sol --opcodes
======= Memory002.sol:Memory002 =======
Opcodes:
PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH1 0xF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x3F DUP1 PUSH1 0x1D PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x0 DUP1 REVERT INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 SWAP16 PUSH14 0x7CDD29AD42E98865FC6EF70ED838 EXTCODECOPY CALLDATASIZE 0x26 GAS 0xAD 0xD5 EQ 0xA8 LOG0 BYTE SWAP5 PUSH29 0xFDD1B9C364736F6C634300081100330000000000000000000000000000


Ethervm.io 
https://www.evm.codes/
https://www.ethervm.io/
通过 Ethervm.io 来查看 EVM 操作码列表。一个操作码长度为 1 个字节（byte），这使得它可以存在 256 种不同的操作码。但 EVM 仅使用其中的 140 个操作码

keccak256 计算
https://emn178.github.io/online-tools/keccak_256.html

以太坊函数签名数据库(通过 hash 反查函数签名)
https://www.4byte.directory/signatures/

EVM Playground(通过交互方式来查看栈的变化)
https://www.evm.codes/playground


```

### 1. 安装启动 ganache

```


npm install -g ganache-cli ganache

ganache --wallet.accounts 0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad,100000000000000000000 0x2d7ebdb29614e40846274bcb7f3a591a53472d2107c2586886e1a7f72c38235a,100000000000000000000 0x532f5aad84ac90976760037798e1469df169e856e49c6b12893008d997bc2ea0,100000000000000000000 0xbb9c5f23fd14febf9a98fd00ccf6cc18ad93b0edc439e6ab5d3184ab5bcb3572,100000000000000000000  --server.ws true  --database.dbPath /data/tmp/ganache --wallet.accountKeysPath /data/tmp/ganache-privatekey.json  --wallet.defaultBalance 1000 --wallet.passphrase ""  --chain.chainId 30303 --server.host 127.0.0.1  --server.port 8545

ganache-cli --account 0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad,100000000000000000000 0x2d7ebdb29614e40846274bcb7f3a591a53472d2107c2586886e1a7f72c38235a,100000000000000000000 0x532f5aad84ac90976760037798e1469df169e856e49c6b12893008d997bc2ea0,100000000000000000000 0xbb9c5f23fd14febf9a98fd00ccf6cc18ad93b0edc439e6ab5d3184ab5bcb3572,100000000000000000000  --db /data/tmp/ganache --account_keys_path /data/tmp/ganache-privatekey.json --chainId 30303


eth addr(和下面的私钥顺序对应)
0xa2bb801AD4424f54CC9962053cfD9e58E8f5Fb2D
0xE3205B97510cF1052DCe5b476f409731bbe3921E
0x7a125DC6dA2E5909Aa64965Bc4113386560AbBC9
0xA1c3e8cC2faCda678C861101bE1232c87625392f

eth private_key - 只是测试网络随机生成，测试数据用，没有实际意义.
0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad
0x2d7ebdb29614e40846274bcb7f3a591a53472d2107c2586886e1a7f72c38235a
0x532f5aad84ac90976760037798e1469df169e856e49c6b12893008d997bc2ea0
0xbb9c5f23fd14febf9a98fd00ccf6cc18ad93b0edc439e6ab5d3184ab5bcb3572

```

### 2. hardhat 工程初始化

```
mkdir test
cd test
npm init --yes
npm install ethers fs solc@0.8.17 dotenv @openzeppelin/contracts hardhat @nomicfoundation/hardhat-toolbox

npx hardhat  # Create a JavaScript project


https://hardhat.org/hardhat-network/docs/overview
启动 fork 的节点(hardhat.config.js 配置好以后)
npx hardhat node
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<key>

使用单元测试
npx hardhat test



编写代码
vim xxx.sol
vim xxx.js

```

### 3. 编译&测试&部署 合约

```

配置 eth 私钥
export ETH_PRIVATE_KEY=0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad

# truffle 使用的 HDWalletProvider 接收的私钥要去除私钥前面的 0x 前缀
export ETH_PRIVATE_KEY_RAW="77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad"



npx hardhat compile --force
npx hardhat test --network myself
npx hardhat run scripts/deploy.js --network myself

如果不指定部署网络，会默认在 hardhat 内置网络内部署 (Hardhat Network)
npx hardhat run scripts/deploy.js
npx hardhat run scripts/deploy.js --network myself	// 指定网络







npx hardhat	// 查看 task 列表
npx hardhat help [task]  
npx hardhat compile // 执行 compile task
npx hardhat compile --force	// 强制重新编译
npx hardhat test	// 批量运行测试脚本
npx hardhat test test/SimpleToken.test.js	// 运行执行测试脚本


npx hardhat run scripts/deploy.js --network <network-name>  // 部署
npx hardhat run scripts/deploy.js --network myself	// 部署到指定网络

hardhat 的控制台模式，实时与链上交互。默认会启动 hardhat 内置网络
npx hardhat console
npx hardhat console --network myself


hardhat 提供了一个 console.log() 方法，可以在合约运行时打印日志，方便调试和测试。
【此方法仅在 hardhat 内置网络中运行有效】
在合约中引入 hardhat/console.sol 即可使用：
import "hardhat/console.sol";
```


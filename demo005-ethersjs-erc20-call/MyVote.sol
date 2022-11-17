// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MyVote {
    bytes32[] public candidateList;
    mapping(bytes32 => uint8) public votesReceived;

    constructor(bytes32[] memory candidateListName) {
        candidateList = candidateListName;
    }

    modifier ValidateCandidate(bytes32 candidateName) {
        bool isExist = false;
        for (uint8 index = 0; index < candidateList.length; index++) {
            if (candidateList[index] == candidateName) {
                isExist = true;
            }
        }
        require(isExist == true);
        _;
    }

    function voteForCandidate(bytes32 candidateName)
        public
        ValidateCandidate(candidateName)
    {
        votesReceived[candidateName] += 1;
    }

    function totalVotesFor(bytes32 candidateName)
        public
        view
        ValidateCandidate(candidateName)
        returns (uint8)
    {
        return votesReceived[candidateName];
    }
}

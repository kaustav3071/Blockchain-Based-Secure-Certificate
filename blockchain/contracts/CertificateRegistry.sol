// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateRegistry {
    struct Certificate {
        string certId;
        bytes32 hashValue;
        address issuer;
        uint256 timestamp;
        bool exists;
        bool revoked;
    }

    address public admin;

    // certId => Certificate (for issuance tracking & revocation)
    mapping(string => Certificate) private certificates;

    // hashValue => Certificate (for hash-based verification — the core decentralized lookup)
    mapping(bytes32 => Certificate) private hashToCertificate;

    event CertificateIssued(string certId, bytes32 hashValue, address issuer, uint256 timestamp);
    event CertificateRevoked(string certId, address revokedBy, uint256 timestamp);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyNewCertificate(string memory certId) {
        require(!certificates[certId].exists, "Certificate already exists");
        _;
    }

    function issueCertificate(string memory certId, bytes32 hashValue)
        public
        onlyNewCertificate(certId)
    {
        require(!hashToCertificate[hashValue].exists, "Hash already registered");

        Certificate memory cert = Certificate({
            certId: certId,
            hashValue: hashValue,
            issuer: msg.sender,
            timestamp: block.timestamp,
            exists: true,
            revoked: false
        });

        certificates[certId] = cert;
        hashToCertificate[hashValue] = cert;

        emit CertificateIssued(certId, hashValue, msg.sender, block.timestamp);
    }

    // Verify by certId (kept for revocation and admin queries)
    function verifyCertificate(string memory certId)
        public
        view
        returns (bytes32, address, uint256, bool, bool)
    {
        Certificate memory cert = certificates[certId];
        return (cert.hashValue, cert.issuer, cert.timestamp, cert.exists, cert.revoked);
    }

    // *** THE KEY FUNCTION *** — verify by hash directly (truly decentralized)
    function verifyCertificateByHash(bytes32 hashValue)
        public
        view
        returns (string memory certId, address issuer, uint256 timestamp, bool exists, bool revoked)
    {
        Certificate memory cert = hashToCertificate[hashValue];
        return (cert.certId, cert.issuer, cert.timestamp, cert.exists, cert.revoked);
    }

    function revokeCertificate(string memory certId) public {
        require(certificates[certId].exists, "Certificate does not exist");
        require(
            certificates[certId].issuer == msg.sender || msg.sender == admin,
            "Not authorized to revoke"
        );
        require(!certificates[certId].revoked, "Already revoked");

        certificates[certId].revoked = true;

        // Also update the hash-based mapping
        bytes32 h = certificates[certId].hashValue;
        hashToCertificate[h].revoked = true;

        emit CertificateRevoked(certId, msg.sender, block.timestamp);
    }
}

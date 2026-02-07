const UniversityFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-navy-900 text-white py-5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <img src="/logo.png" alt="CertifyChain" className="w-8 h-8 object-contain" />
                            <span className="text-lg font-bold tracking-wide">CertifyChain</span>
                        </div>
                        <p className="text-navy-300 text-xs leading-relaxed">
                            Issue tamper-proof certificates on the blockchain.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-200 mb-2">Quick Links</h3>
                        <ul className="space-y-1 text-xs text-navy-300">
                            <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                            <li><a href="/issue" className="hover:text-white transition-colors">Issue Certificate</a></li>
                            <li><a href="/my-certificates" className="hover:text-white transition-colors">My Certificates</a></li>
                        </ul>
                    </div>

                    {/* Technology */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-200 mb-2">Technology</h3>
                        <ul className="space-y-1 text-xs text-navy-300">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                Ethereum Sepolia Testnet
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                SHA-256 Hash Storage
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                Smart Contract Issuance
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-navy-700 mt-5 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-navy-400">
                        © {currentYear} CertifyChain. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-navy-400">
                        <span>University Portal</span>
                        <div className="w-1 h-1 rounded-full bg-navy-600"></div>
                        <span>Powered by Ethereum</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default UniversityFooter;

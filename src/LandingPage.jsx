import React, { useState, useEffect } from 'react';
import { Terminal, GitBranch, Zap, Shield, Rocket, Copy, Check, Github, Code, Users, Star } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
    const [copied, setCopied] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeFeature, setActiveFeature] = useState(0);

    const installCommand = "npm install -g @smartcomponents/vault-cli";

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(installCommand);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const features = [
        {
            icon: <GitBranch className="w-8 h-8" />,
            title: "Master Git Flow",
            description: "Learn branching, merging, and collaboration patterns used by elite developers"
        },
        {
            icon: <Terminal className="w-8 h-8" />,
            title: "Command Line Mastery",
            description: "Transform from GUI dependent to terminal ninja with guided practice"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Real-world Projects",
            description: "Practice with actual codebases and scenarios you'll face in production"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div
                    className="absolute w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse"
                    style={{
                        left: mousePosition.x * 0.02,
                        top: mousePosition.y * 0.02,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
                <div
                    className="absolute w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"
                    style={{
                        right: mousePosition.x * 0.01,
                        bottom: mousePosition.y * 0.01,
                        transform: 'translate(50%, 50%)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-purple-900/10" />
            </div>

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.5) 1px, transparent 0)`,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center p-6 border-b border-gray-800/50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <GitBranch className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Vault
          </span>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="px-6 py-2 border border-gray-600 rounded-lg hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => window.location.href = '/signup'}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-spin-slow">
                                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                                    <Code className="w-8 h-8 text-blue-400" />
                                </div>
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse" />
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                        Master Version Control
                        <br />
                        <span className="text-4xl md:text-5xl">Like a Pro</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                        Transform from beginner to Git expert with our futuristic training platform.
                        <br />
                        Learn through interactive simulations and real-world scenarios.
                    </p>

                    {/* CLI Installation */}
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-12 max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <Terminal className="w-6 h-6 text-green-400" />
                                <span className="text-lg font-semibold">Quick Install</span>
                            </div>
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full" />
                                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                            </div>
                        </div>
                        <div className="bg-black/50 rounded-lg p-4 font-mono text-left">
                            <div className="flex items-center justify-between">
                                <span className="text-green-400">$ {installCommand}</span>
                                <button
                                    onClick={copyToClipboard}
                                    className="ml-4 p-2 hover:bg-gray-700 rounded transition-colors"
                                    title="Copy to clipboard"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-3">
                            Get started with our CLI tool in seconds. Works on Windows, macOS, and Linux.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => window.location.href = '/signup'}
                            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105"
                        >
              <span className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                <span>Start Training</span>
              </span>
                        </button>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="px-8 py-4 border-2 border-gray-600 rounded-xl text-lg font-semibold hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
                        >
                            Already have an account?
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-500 hover:scale-105 ${
                                activeFeature === index
                                    ? 'border-blue-500 bg-blue-500/10 shadow-xl shadow-blue-500/25'
                                    : 'border-gray-700 hover:border-gray-600'
                            }`}
                        >
                            <div className={`mb-4 ${activeFeature === index ? 'text-blue-400' : 'text-gray-400'}`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-3 gap-8 text-center max-w-2xl mx-auto">
                    <div>
                        <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
                        <div className="text-gray-400">Developers Trained</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
                        <div className="text-gray-400">Success Rate</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-pink-400 mb-2">24/7</div>
                        <div className="text-gray-400">AI Support</div>
                    </div>
                </div>
            </main>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 animate-float">
                <div className="w-4 h-4 bg-blue-500 rounded-full opacity-60" />
            </div>
            <div className="absolute top-40 right-20 animate-float-delayed">
                <div className="w-3 h-3 bg-purple-500 rounded-full opacity-60" />
            </div>
            <div className="absolute bottom-20 left-20 animate-float">
                <div className="w-5 h-5 bg-pink-500 rounded-full opacity-60" />
            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
        </div>
    );
}
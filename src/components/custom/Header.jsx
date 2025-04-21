import React, { useContext } from "react";
import { motion } from "framer-motion";
import { LogInContext } from "@/Context/LogInContext/Login.jsx";
import { Button } from "../ui/button.jsx";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";

function Header() {
    const { user, isAuthenticated, login, logout } = useContext(LogInContext);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    // Navigation links
    const navLinks = [
        { name: "Destinations", path: "/plan-a-trip" },
        { name: "About Us", path: "/scrap-book" },
        { name: "Contact", path: "/todo" }
    ];

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full py-4 px-6 flex justify-between items-center backdrop-blur-md bg-black/20 border-b border-white/10 sticky top-0 z-50"
        >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
                <motion.div
                    whileHover={{ rotate: 10 }}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center"
                >
                    <span className="text-2xl font-bold text-white">T</span>
                </motion.div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-600 hidden sm:block">
                    1Plan
                </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link 
                        key={link.name}
                        to={link.path} 
                        className="text-white/80 hover:text-white transition-colors relative group"
                    >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                ))}
                
                {isAuthenticated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full cursor-pointer border border-white/20 hover:border-purple-500/50 transition-all"
                            >
                                <h2 className="font-medium">Hi, {user.name}</h2>
                                <img src={user.picture} alt="User" className="h-8 w-8 rounded-full" />
                            </motion.div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="backdrop-blur-md bg-black/50 border border-white/10">
                            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
                                <Link to='/all-trips' className="w-full text-white/80 hover:text-white">My Trips</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
                                <Link to='/plan-a-trip' className="w-full text-white/80 hover:text-white">Create Trip</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
                                <button onClick={logout} className="w-full text-left text-white/80 hover:text-white">Log Out</button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button 
                        onClick={login} 
                        className="flex gap-2 items-center bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 transition-all shadow-lg shadow-pink-500/20"
                    >
                        Sign In <FcGoogle className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-white p-2"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-16 right-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10"
                >
                    <div className="flex flex-col p-4 gap-4">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name}
                                to={link.path} 
                                className="text-white/80 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/10"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to="/all-trips"
                                    className="text-white/80 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/10"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Trips
                                </Link>
                                <Link 
                                    to="/plan-a-trip"
                                    className="text-white/80 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/10"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Create Trip
                                </Link>
                                <button 
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-white/80 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/10 text-left"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => {
                                    login();
                                    setMobileMenuOpen(false);
                                }}
                                className="flex gap-2 items-center justify-center bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 px-4 rounded-lg"
                            >
                                Sign In <FcGoogle className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}

export default Header;
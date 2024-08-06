"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from '../../public/logo.png';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Page() {
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Navbar */}
            <motion.div
                className="flex items-center justify-between h-[10vh] px-4 md:px-8 bg-white shadow-xl border-b border-gray-200"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center space-x-2 md:space-x-4">
                    <Image src={logo} alt="Logo" width={40} height={40} />
                    <span className="text-lg md:text-xl font-semibold">Goal Tracker</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <Link href="/login">
                        <motion.div
                            className="flex items-center px-3 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition duration-200 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FaSignInAlt className="mr-1" />
                            Log in
                        </motion.div>
                    </Link>
                    <Link href="/signup">
                        <motion.div
                            className="flex items-center px-3 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium text-blue-500 border border-blue-500 rounded-full hover:bg-blue-50 transition duration-200 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FaUserPlus className="mr-1" />
                            Sign up
                        </motion.div>
                    </Link>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
                className="flex flex-col items-center justify-center h-[90vh] bg-white text-center p-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image src={logo} alt="Logo" width={150} height={150} className="rounded-full shadow-2xl" />
                </motion.div>
                <motion.h1
                    className="mt-6 text-3xl md:text-4xl font-extrabold text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    Goal Tracker
                </motion.h1>
                <motion.p
                    className="mt-2 text-base md:text-lg text-gray-500 max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                >
                    Organize e gerencie suas metas de maneira eficiente. Simplifique seu progresso e alcance seus objetivos com facilidade.
                </motion.p>
                <motion.p
                    className="mt-4 text-xl md:text-2xl font-semibold text-gray-600 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                >
                    Your goals, our mission
                </motion.p>
                <Link href="/home">
                    <motion.button
                        className="mt-8 px-6 md:px-8 py-2 md:py-3 bg-blue-500 text-white font-semibold text-lg rounded-full hover:bg-blue-600 transition duration-200 shadow-lg"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.5 }}
                        type="button"
                    >
                        Get Started
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}

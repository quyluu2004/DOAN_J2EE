import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from 'react-router-dom'

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2000&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5)'
                }}
            />

            <Card className="w-full max-w-md border-white/10 bg-black/30 backdrop-blur-md shadow-2xl z-10 text-white">
                <CardHeader className="text-center space-y-2 pt-10 pb-6 relative">
                    <div className="absolute top-4 left-6 text-xs font-bold tracking-widest uppercase text-white/80">ÉLITAN</div>
                    <Link to="/" className="absolute top-4 right-6 text-[10px] font-medium tracking-widest uppercase text-white/60 hover:text-white transition-colors">Back to Collection</Link>

                    <div className="pt-4">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Membership</span>
                        <CardTitle className="text-3xl font-serif tracking-wide mt-1 italic font-normal">Curating Your Lifestyle</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-gray-300 font-light px-8 leading-relaxed">
                        Join our inner circle to access members-only collections and bespoke design services.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 px-8">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            className="h-8 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 text-white text-sm placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-white transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            className="h-8 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 text-white text-sm placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-white transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="password" className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className="h-8 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 text-white text-sm placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-white transition-colors"
                        />
                    </div>
                    {/* Checkbox for updates - Cosmetic for now */}
                    <div className="flex items-center space-x-2 pt-2">
                        <input type="checkbox" id="updates" className="rounded border-gray-600 bg-transparent text-white focus:ring-0 w-3 h-3" />
                        <Label htmlFor="updates" className="text-[10px] text-gray-400 font-light">Join the ÉLITAN inner circle for exclusive updates.</Label>
                    </div>

                </CardContent>
                <CardFooter className="flex flex-col space-y-6 px-8 pb-10">
                    <Button className="w-full bg-black hover:bg-black/80 text-white text-[10px] font-bold tracking-[0.2em] uppercase py-6 rounded-none transition-all border border-transparent hover:border-white/20">
                        Create Account
                    </Button>
                    <div className="text-[10px] text-gray-400 text-center font-light">
                        Already a member?{" "}
                        <Link to="/login" className="text-white hover:underline font-medium transition-colors border-b border-white pb-0.5">
                            Sign In
                        </Link>
                    </div>
                    <div className="flex justify-between w-full text-[9px] text-gray-500 uppercase tracking-widest mt-2">
                        <span>Privacy</span>
                        <span>© 2026 ÉLITAN</span>
                        <span>Terms</span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register

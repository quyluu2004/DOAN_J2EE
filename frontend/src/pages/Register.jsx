import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const Register = () => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validate phía Frontend
        if (!fullName || !email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin')
            return
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email không hợp lệ')
            return
        }
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự')
            return
        }

        setLoading(true)
        try {
            await register(fullName, email, password)
            setSuccess('Đăng ký thành công! Đang chuyển sang trang đăng nhập...')
            setTimeout(() => navigate('/login'), 1500)
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại')
        } finally {
            setLoading(false)
        }
    }

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
                <form onSubmit={handleSubmit}>
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
                        {/* Hiển thị lỗi */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}
                        {/* Hiển thị thành công */}
                        {success && (
                            <div className="bg-green-500/20 border border-green-500/50 text-green-200 text-sm px-4 py-3 rounded-md">
                                {success}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-8 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 text-white text-sm placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-white transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-8 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 text-white text-sm placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-white transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="password" className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Password</Label>
                                <span className="text-[9px] text-gray-500">Min 6 characters</span>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-8 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 text-white text-sm placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-white transition-colors"
                            />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <input type="checkbox" id="updates" className="rounded border-gray-600 bg-transparent text-white focus:ring-0 w-3 h-3" />
                            <Label htmlFor="updates" className="text-[10px] text-gray-400 font-light">Join the ÉLITAN inner circle for exclusive updates.</Label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-6 px-8 pb-10">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black hover:bg-black/80 text-white text-[10px] font-bold tracking-[0.2em] uppercase py-6 rounded-none transition-all border border-transparent hover:border-white/20 disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Create Account'}
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
                </form>
            </Card>
        </div>
    )
}

export default Register

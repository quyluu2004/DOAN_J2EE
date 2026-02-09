import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validate phía Frontend
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu')
            return
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email không hợp lệ')
            return
        }

        setLoading(true)
        try {
            await login(email, password)
            navigate('/') // Chuyển về trang chủ
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại')
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
                    filter: 'brightness(0.6)'
                }}
            />

            <Card className="w-full max-w-md border-white/10 bg-black/30 backdrop-blur-md shadow-2xl z-10 text-white">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="text-center space-y-2 pt-10 pb-6 relative">
                        <div className="absolute top-4 left-6 text-xs font-bold tracking-widest uppercase text-white/80">ÉLITAN</div>
                        <Link to="/" className="absolute top-4 right-6 text-[10px] font-medium tracking-widest uppercase text-white/60 hover:text-white transition-colors">Back to Collection</Link>
                        <CardTitle className="text-4xl font-serif tracking-tight mt-6">ÉLITAN</CardTitle>
                        <CardDescription className="text-base text-gray-300">
                            Log in to access your bespoke design services.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-8">
                        {/* Hiển thị lỗi */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold tracking-widest text-gray-400 uppercase">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-10 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-white transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-bold tracking-widest text-gray-400 uppercase">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-10 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-white transition-colors"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-6 px-8 pb-10">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black hover:bg-black/80 text-white text-xs font-bold tracking-widest uppercase py-6 rounded-none transition-all border border-transparent hover:border-white/20 disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Sign In'}
                        </Button>
                        <div className="text-xs text-gray-400 text-center">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-white hover:underline font-bold transition-colors">
                                Sign Up
                            </Link>
                        </div>
                        <div className="flex justify-between w-full text-[10px] text-gray-500 uppercase tracking-widest mt-4">
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

export default Login

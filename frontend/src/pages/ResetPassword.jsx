import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '@/services/authService'
import { Lock, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ')
            return
        }
        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự')
            return
        }
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp')
            return
        }
        if (!token) {
            setError('Token không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu lần nữa.')
            return
        }

        setLoading(true)
        try {
            await resetPassword(token, newPassword)
            setSuccess(true)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err) {
            setError(err.message || 'Đặt lại mật khẩu thất bại')
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
                {!success ? (
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="text-center space-y-2 pt-10 pb-6 relative">
                            <div className="absolute top-4 left-6 text-xs font-bold tracking-widest uppercase text-white/80">ÉLITAN</div>

                            <div className="pt-4">
                                {/* Icon */}
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                    <Lock className="w-7 h-7 text-white/80" />
                                </div>
                                <CardTitle className="text-3xl font-serif tracking-tight">New Password</CardTitle>
                            </div>
                            <CardDescription className="text-sm text-gray-300 font-light px-4 leading-relaxed">
                                Create a new password for your ÉLITAN account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 px-8">
                            {/* Hiển thị lỗi */}
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm px-4 py-3 rounded-md animate-in fade-in duration-300">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-xs font-bold tracking-widest text-gray-400 uppercase">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="h-10 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 pr-10 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-white transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-xs font-bold tracking-widest text-gray-400 uppercase">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-10 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-white transition-colors"
                                />
                            </div>

                            {/* Password strength indicator */}
                            {newPassword && (
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${newPassword.length >= (i + 1) * 3
                                                    ? i < 2 ? 'bg-red-400' : i < 3 ? 'bg-yellow-400' : 'bg-emerald-400'
                                                    : 'bg-white/10'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-500">
                                        {newPassword.length < 6 ? 'Too short' : newPassword.length < 9 ? 'Fair' : newPassword.length < 12 ? 'Good' : 'Strong'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-6 px-8 pb-10">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black hover:bg-black/80 text-white text-xs font-bold tracking-widest uppercase py-6 rounded-none transition-all border border-transparent hover:border-white/20 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Resetting...
                                    </span>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                            <div className="flex justify-between w-full text-[10px] text-gray-500 uppercase tracking-widest mt-4">
                                <span>Privacy</span>
                                <span>© 2026 ÉLITAN</span>
                                <span>Terms</span>
                            </div>
                        </CardFooter>
                    </form>
                ) : (
                    /* Success State */
                    <div className="text-center py-12 px-8">
                        <div className="absolute top-4 left-6 text-xs font-bold tracking-widest uppercase text-white/80">ÉLITAN</div>

                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-in zoom-in duration-500">
                            <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>

                        <h2 className="text-2xl font-serif tracking-tight mb-3">Password Reset!</h2>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Your password has been successfully reset. Redirecting to login...
                        </p>

                        {/* Animated progress bar */}
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-8">
                            <div className="h-full bg-emerald-400 rounded-full animate-pulse" style={{ width: '100%', animation: 'shrink 3s linear forwards' }} />
                        </div>

                        <Link to="/login">
                            <Button className="w-full bg-black hover:bg-black/80 text-white text-xs font-bold tracking-widest uppercase py-5 rounded-none transition-all border border-transparent hover:border-white/20">
                                Go to Login
                            </Button>
                        </Link>

                        <div className="flex justify-between w-full text-[9px] text-gray-500 uppercase tracking-widest mt-8">
                            <span>Privacy</span>
                            <span>© 2026 ÉLITAN</span>
                            <span>Terms</span>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default ResetPassword

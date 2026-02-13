import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useGoogleLogin } from '@react-oauth/google'

// Lấy Facebook App ID từ biến môi trường
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, socialLogin } = useAuth()
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

    // Google Login - dùng Authorization Code flow rồi lấy id_token
    const googleLogin = useGoogleLogin({
        flow: 'implicit',
        onSuccess: async (tokenResponse) => {
            setError('')
            setLoading(true)
            try {
                // Lấy thông tin user từ Google bằng access_token
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                })
                const userInfo = await res.json()

                // Gửi access_token và thông tin user về backend
                await socialLogin(tokenResponse.access_token, 'GOOGLE')
                navigate('/')
            } catch (err) {
                setError(err.message || 'Đăng nhập bằng Google thất bại')
            } finally {
                setLoading(false)
            }
        },
        onError: () => setError('Đăng nhập bằng Google thất bại'),
    })

    // Facebook SDK Loading
    React.useEffect(() => {
        if (!window.FB) {
            const script = document.createElement('script');
            script.src = 'https://connect.facebook.net/en_US/sdk.js';
            script.async = true;
            script.defer = true;
            script.crossOrigin = 'anonymous';
            script.onload = () => {
                window.FB.init({
                    appId: FACEBOOK_APP_ID,
                    cookie: true,
                    xfbml: true,
                    version: 'v19.0'
                });
            };
            document.body.appendChild(script);
        }
    }, []);

    // Facebook Login
    const handleFacebookLogin = () => {
        setError('');

        if (!window.FB) {
            setError('Facebook SDK chưa sẵn sàng. Vui lòng tải lại trang.');
            return;
        }

        window.FB.login((response) => {
            if (response.authResponse) {
                // Fix: Wrap async logic in IIFE
                (async () => {
                    setLoading(true);
                    try {
                        await socialLogin(response.authResponse.accessToken, 'FACEBOOK');
                        navigate('/');
                    } catch (err) {
                        console.error("FB Login Error:", err);
                        setError(err.message || 'Đăng nhập bằng Facebook thất bại');
                    } finally {
                        setLoading(false);
                    }
                })();
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, { scope: 'email,public_profile' });
    };

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

                        {/* Social Login Buttons */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium tracking-wider uppercase py-3 rounded-none transition-all disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign in with Google
                            </button>
                            <button
                                type="button"
                                onClick={handleFacebookLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/40 text-white text-xs font-medium tracking-wider uppercase py-3 rounded-none transition-all disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Sign in with Facebook
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/20"></div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-white/20"></div>
                        </div>

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

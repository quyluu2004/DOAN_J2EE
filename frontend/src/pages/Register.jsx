import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useGoogleLogin } from '@react-oauth/google'

import { useLocalization } from '@/context/LocalizationContext'

// Lấy Facebook App ID từ biến môi trường
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

const Register = () => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const { register, socialLogin } = useAuth()
    const { t } = useLocalization()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validate phía Frontend
        if (!fullName || !email || !password) {
            setError(t('auth.error_fill'))
            return
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError(t('auth.error_email'))
            return
        }
        if (password.length < 8) {
            setError(t('auth.error_password_length'))
            return
        }
        if (!/(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
            setError(t('auth.error_password_pattern'))
            return
        }

        setLoading(true)
        try {
            await register(fullName, email, password)
            setSuccess(t('auth.register_success'))
            setTimeout(() => navigate('/'), 1500)
        } catch (err) {
            setError(err.message || t('auth.register_fail'))
        } finally {
            setLoading(false)
        }
    }

    // Google Login
    const googleLogin = useGoogleLogin({
        flow: 'implicit',
        onSuccess: async (tokenResponse) => {
            setError('')
            setLoading(true)
            try {
                await socialLogin(tokenResponse.access_token, 'GOOGLE')
                navigate('/')
            } catch (err) {
                setError(err.message || 'Đăng nhập bằng Google thất bại')
            } finally {
                setLoading(false)
            }
        },
        onError: () => setError(t('auth.error_google_fail')),
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
            setError(t('auth.error_facebook_sdk'));
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
                        setError(err.message || t('auth.error_facebook_fail'));
                    } finally {
                        setLoading(false);
                    }
                })();
            } else {
                // User cancelled login or did not fully authorize.
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
                    filter: 'brightness(0.5)'
                }}
            />

            <Card className="w-full max-w-md border-white/10 bg-black/30 backdrop-blur-md shadow-2xl z-10 text-white">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="text-center space-y-2 pt-10 pb-6 relative">
                        <div className="absolute top-4 left-6 text-xs font-bold tracking-widest uppercase text-white/80">ÉLITAN</div>
                        <Link to="/" className="absolute top-4 right-6 text-[10px] font-medium tracking-widest uppercase text-white/60 hover:text-white transition-colors">{t('product.gallery.back')}</Link>

                        <div className="pt-4">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">{t('auth.membership_label')}</span>
                            <CardTitle className="text-3xl font-serif tracking-wide mt-1 italic font-normal">{t('auth.register_title_alt')}</CardTitle>
                        </div>
                        <CardDescription className="text-sm text-gray-300 font-light px-8 leading-relaxed">
                            {t('auth.register_subtitle')}
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
                                {t('auth.google_login')}
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
                                {t('auth.facebook_login')}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/20"></div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-white/20"></div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{t('contact.field_name')}</Label>
                            <Input
                                id="name"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-8 bg-transparent border-0 border-b border-gray-600 rounded-none px-0 text-white text-sm placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-white transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{t('auth.email_label')}</Label>
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
                                <Label htmlFor="password" className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{t('auth.password_label')}</Label>
                                <span className="text-[9px] text-gray-500">{t('auth.password_hint')}</span>
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
                            <Label htmlFor="updates" className="text-[10px] text-gray-400 font-light">{t('auth.join_inner_circle')}</Label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-6 px-8 pb-10">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black hover:bg-black/80 text-white text-[10px] font-bold tracking-[0.2em] uppercase py-6 rounded-none transition-all border border-transparent hover:border-white/20 disabled:opacity-50"
                        >
                            {loading ? t('auth.processing') : t('auth.register_btn')}
                        </Button>
                        <div className="text-[10px] text-gray-400 text-center font-light">
                            {t('auth.has_account')}{" "}
                            <Link to="/login" className="text-white hover:underline font-medium transition-colors border-b border-white pb-0.5">
                                {t('auth.login_btn')}
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

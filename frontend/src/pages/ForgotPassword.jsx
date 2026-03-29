import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from 'react-router-dom'
import { forgotPassword } from '@/services/authService'
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { useLocalization } from '@/context/LocalizationContext'

const ForgotPassword = () => {
    const { t } = useLocalization()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email) {
            setError(t('auth.error_fill'))
            return
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError(t('auth.error_email'))
            return
        }

        setLoading(true)
        try {
            await forgotPassword(email)
            setSuccess(true)
        } catch (err) {
            setError(err.message || t('auth.forgot_fail'))
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
                            <Link to="/login" className="absolute top-4 right-6 text-[10px] font-medium tracking-widest uppercase text-white/60 hover:text-white transition-colors flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" />
                                {t('product.gallery.back')}
                            </Link>

                            <div className="pt-6">
                                {/* Icon */}
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                    <Mail className="w-7 h-7 text-white/80" />
                                </div>
                                <CardTitle className="text-3xl font-serif tracking-tight">{t('auth.forgot_password')}</CardTitle>
                            </div>
                            <CardDescription className="text-sm text-gray-300 font-light px-4 leading-relaxed">
                                {t('auth.forgot_desc')}
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
                                <Label htmlFor="email" className="text-xs font-bold tracking-widest text-gray-400 uppercase">{t('auth.email_label')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {t('auth.processing')}
                                    </span>
                                ) : (
                                    t('auth.send_reset_btn')
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

                        {/* Animated Success Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-in zoom-in duration-500">
                            <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>

                        <h2 className="text-2xl font-serif tracking-tight mb-3">{t('auth.forgot_success')}</h2>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            {t('auth.forgot_success_desc')}
                        </p>
                        <p className="text-white font-medium mb-6">{email}</p>

                        <div className="space-y-3">
                            <Button
                                onClick={() => { setSuccess(false); setEmail(''); }}
                                variant="outline"
                                className="w-full bg-transparent border border-white/20 text-white text-xs font-bold tracking-widest uppercase py-5 rounded-none hover:bg-white/10 transition-all"
                            >
                                {t('common.try_again')}
                            </Button>
                            <Link to="/login">
                                <Button
                                    variant="ghost"
                                    className="w-full text-gray-400 text-xs tracking-wider hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="w-3 h-3 mr-2" />
                                    {t('product.gallery.back')}
                                </Button>
                            </Link>
                        </div>

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

export default ForgotPassword

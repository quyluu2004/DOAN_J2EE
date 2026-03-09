import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getProfile, updateProfile, changePassword } from '@/services/userService'
import { User, Lock, Mail, Phone, MapPin, ArrowLeft, Save, Loader2, Shield, Eye, EyeOff, Camera } from 'lucide-react'

const Profile = () => {
    const { user, isAuthenticated, updateUser } = useAuth()
    const navigate = useNavigate()

    // Profile state
    const [profile, setProfile] = useState(null)
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [profileLoading, setProfileLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Password state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPasswords, setShowPasswords] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        loadProfile()
    }, [isAuthenticated])

    const loadProfile = async () => {
        try {
            const data = await getProfile()
            setProfile(data)
            setFullName(data.fullName || '')
            setPhone(data.phone || '')
            setAddress(data.address || '')
            setAvatarUrl(data.avatarUrl || '')
        } catch (err) {
            toast.error('Không thể tải thông tin profile')
        } finally {
            setProfileLoading(false)
        }
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()

        if (!fullName.trim()) {
            toast.error('Tên không được để trống')
            return
        }

        setSaving(true)
        try {
            const updated = await updateProfile({ fullName, phone, address, avatarUrl })
            setProfile(updated)
            // Cập nhật AuthContext
            if (updateUser) {
                updateUser({ ...user, fullName: updated.fullName })
            }
            toast.success('Cập nhật profile thành công!', {
                description: 'Thông tin của bạn đã được lưu.'
            })
        } catch (err) {
            toast.error(err.message || 'Cập nhật thất bại')
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ')
            return
        }
        if (newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp')
            return
        }

        setChangingPassword(true)
        try {
            await changePassword(currentPassword, newPassword)
            toast.success('Đổi mật khẩu thành công!', {
                description: 'Mật khẩu mới đã được cập nhật.'
            })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err) {
            toast.error(err.message || 'Đổi mật khẩu thất bại')
        } finally {
            setChangingPassword(false)
        }
    }

    // Lấy chữ cái đầu cho avatar fallback
    const getInitials = (name) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    <p className="text-sm text-gray-500 tracking-wider uppercase">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="bg-[#111827] text-white">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <Avatar className="w-24 h-24 border-4 border-white/10 shadow-2xl">
                                <AvatarImage src={avatarUrl} alt={fullName} />
                                <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 text-white text-2xl font-bold">
                                    {getInitials(fullName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Camera className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold tracking-tight">{profile?.fullName}</h1>
                            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" />
                                {profile?.email}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                                <Badge variant="outline" className="text-[10px] tracking-wider uppercase border-white/20 text-gray-300">
                                    {profile?.role}
                                </Badge>
                                {profile?.provider !== 'LOCAL' && (
                                    <Badge variant="outline" className="text-[10px] tracking-wider uppercase border-blue-500/30 text-blue-300">
                                        {profile?.provider}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 -mt-4">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm rounded-xl h-12 p-1">
                        <TabsTrigger
                            value="profile"
                            className="rounded-lg text-sm font-medium data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                        >
                            <User className="w-4 h-4 mr-2" />
                            Personal Info
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="rounded-lg text-sm font-medium data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Security
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab: Personal Info */}
                    <TabsContent value="profile" className="mt-6">
                        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                            <form onSubmit={handleSaveProfile}>
                                <CardHeader className="bg-white pb-4">
                                    <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                                    <CardDescription>
                                        Update your personal details. This information will be displayed on your account.
                                    </CardDescription>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-6 space-y-6 bg-white">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" />
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="h-11 bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-black/20 focus-visible:border-gray-400 transition-colors"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    {/* Email (readonly) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5" />
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            value={profile?.email || ''}
                                            disabled
                                            className="h-11 bg-gray-100 border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="text-[11px] text-gray-400">Email cannot be changed</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5" />
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="h-11 bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-black/20 focus-visible:border-gray-400 transition-colors"
                                                placeholder="+84 xxx xxx xxx"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5" />
                                                Address
                                            </Label>
                                            <Input
                                                id="address"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="h-11 bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-black/20 focus-visible:border-gray-400 transition-colors"
                                                placeholder="Your address"
                                            />
                                        </div>
                                    </div>

                                    {/* Avatar URL */}
                                    <div className="space-y-2">
                                        <Label htmlFor="avatarUrl" className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-2">
                                            <Camera className="w-3.5 h-3.5" />
                                            Avatar URL
                                        </Label>
                                        <Input
                                            id="avatarUrl"
                                            value={avatarUrl}
                                            onChange={(e) => setAvatarUrl(e.target.value)}
                                            className="h-11 bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-black/20 focus-visible:border-gray-400 transition-colors"
                                            placeholder="https://example.com/your-avatar.jpg"
                                        />
                                    </div>
                                </CardContent>
                                <Separator />
                                <CardFooter className="bg-white py-4 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-black hover:bg-gray-800 text-white text-xs font-bold tracking-wider uppercase px-8 py-5 rounded-lg transition-all shadow-md hover:shadow-lg"
                                    >
                                        {saving ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Save className="w-4 h-4" />
                                                Save Changes
                                            </span>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    {/* Tab: Security */}
                    <TabsContent value="security" className="mt-6">
                        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                            <form onSubmit={handleChangePassword}>
                                <CardHeader className="bg-white pb-4">
                                    <CardTitle className="text-xl font-bold">Change Password</CardTitle>
                                    <CardDescription>
                                        Update your password to keep your account secure.
                                    </CardDescription>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-6 space-y-6 bg-white">
                                    {profile?.provider !== 'LOCAL' && (
                                        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Your account uses {profile?.provider} login. Password change is not available.
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword" className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-2">
                                            <Lock className="w-3.5 h-3.5" />
                                            Current Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="currentPassword"
                                                type={showPasswords ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                disabled={profile?.provider !== 'LOCAL'}
                                                className="h-11 bg-gray-50 border-gray-200 rounded-lg pr-10 focus-visible:ring-black/20 focus-visible:border-gray-400 transition-colors"
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(!showPasswords)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPasswordProfile" className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-2">
                                            <Lock className="w-3.5 h-3.5" />
                                            New Password
                                        </Label>
                                        <Input
                                            id="newPasswordProfile"
                                            type={showPasswords ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={profile?.provider !== 'LOCAL'}
                                            className="h-11 bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-black/20 focus-visible:border-gray-400 transition-colors"
                                            placeholder="Enter new password (min 6 chars)"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPasswordProfile" className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-2">
                                            <Lock className="w-3.5 h-3.5" />
                                            Confirm New Password
                                        </Label>
                                        <Input
                                            id="confirmPasswordProfile"
                                            type={showPasswords ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={profile?.provider !== 'LOCAL'}
                                            className="h-11 bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-black/20 focus-visible:border-gray-400 transition-colors"
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    {/* Password strength */}
                                    {newPassword && profile?.provider === 'LOCAL' && (
                                        <div className="space-y-2">
                                            <div className="flex gap-1">
                                                {[...Array(4)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${newPassword.length >= (i + 1) * 3
                                                                ? i < 2 ? 'bg-red-400' : i < 3 ? 'bg-yellow-400' : 'bg-emerald-500'
                                                                : 'bg-gray-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[11px] text-gray-500">
                                                Password strength: {newPassword.length < 6 ? 'Too short' : newPassword.length < 9 ? 'Fair' : newPassword.length < 12 ? 'Good' : 'Strong'}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                                <Separator />
                                <CardFooter className="bg-white py-4 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={changingPassword || profile?.provider !== 'LOCAL'}
                                        className="bg-black hover:bg-gray-800 text-white text-xs font-bold tracking-wider uppercase px-8 py-5 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                    >
                                        {changingPassword ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Changing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                Change Password
                                            </span>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Footer */}
                <div className="text-center py-8">
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest">© 2026 ÉLITAN. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Profile

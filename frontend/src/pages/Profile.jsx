import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import * as userService from '@/services/userService';
import * as orderService from '@/services/orderService';
import { 
  User, Package, Settings, Heart, LogOut, 
  MapPin, Phone, Mail, Calendar, CheckCircle2, 
  Clock, Truck, ChevronRight, ShieldCheck, 
  MessageCircle, Camera, Edit2, Gem, RotateCw, Crown, Wallet
} from 'lucide-react';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { useLocalization } from '@/context/LocalizationContext';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { BlurText } from '@/components/ui/ReactBits';

const StatusBadge = ({ status }) => {
  const { t } = useLocalization();
  const configs = {
    'PENDING': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: t('orders.status.PENDING') },
    'CONFIRMED': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2, label: t('orders.status.CONFIRMED') },
    'PROCESSING': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: RotateCw, label: t('orders.status.PREPARING') },
    'SHIPPED': { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Truck, label: t('orders.status.SHIPPING') },
    'DELIVERED': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: t('orders.status.DELIVERED') },
    'CANCELLED': { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: LogOut, label: t('orders.status.CANCELLED') },
  };

  const config = configs[status] || configs['PENDING'];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1.5 px-2.5 py-1 font-medium border`}>
      <Icon size={12} />
      {config.label}
    </Badge>
  );
};

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { t, formatPrice } = useLocalization();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Lấy đơn hàng thất bại:', error);
      toast.error(t('checkout.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(profileForm);
      updateUser(profileForm);
      setIsEditing(false);
      toast.success(t('profile.success_update') || 'Cập nhật thành công');
    } catch (error) {
      toast.error(error.message || t('checkout.errors.generic'));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fffcf9] pb-20 mt-16 font-['Plus_Jakarta_Sans']">
      {/* ═══ PROFILE HERO ═══ */}
      <section className="relative h-64 md:h-80 bg-[#221a0c] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#703225] to-transparent" />
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-[#fffcf9] shadow-2xl">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}&background=703225&color=fff`} />
                <AvatarFallback className="bg-[#703225] text-white text-2xl">
                  {user.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-1 right-1 bg-[#c8a35a] text-white p-2 rounded-full shadow-lg border-2 border-[#fffcf9] hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </motion.div>
            
            <div className="text-center md:text-left text-[#fff8f3] flex-1">
              <BlurText text={user.fullName} className="text-3xl md:text-4xl font-serif mb-2" />
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-[#b8a99a]">
                <span className="flex items-center gap-1.5"><Mail size={14} className="text-[#c8a35a]" /> {user.email}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#c8a35a]" /> {t('profile.member_since').replace('{{year}}', '2024')}</span>
                <Badge className="bg-[#c8a35a] hover:bg-[#b08e4d] text-[#221a0c] font-bold">{t('profile.badge')}</Badge>
                {profile?.vip && (
                  <Badge className="bg-gradient-to-r from-[#c8a35a] to-[#e8c968] text-[#221a0c] font-black flex items-center gap-1">
                    <Crown size={12} /> VIP Member
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="border-[#c8a35a]/50 text-[#c8a35a] hover:bg-[#c8a35a]/10" onClick={() => window.location.href='/wallet'}>
                <Wallet size={16} className="mr-2" />               
                  {t('wallet')}
              </Button>
              {user?.role !== 'ADMIN' && (
                <Button 
                  variant="outline" 
                  className="border-red-500/80 text-red-400 hover:bg-red-500/20 font-bold" 
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    try {
                      const res = await fetch('/api/users/make-me-admin', { headers: { 'Authorization': `Bearer ${token}` } });
                      const data = await res.json();
                      toast.success(data.message || 'Thành công');
                      setTimeout(() => window.location.reload(), 3000);
                    } catch (e) {
                      toast.error('Lỗi khi nâng cấp');
                    }
                  }}
                >
                  [DEV] Lên quyền Admin
                </Button>
              )}
              <Button variant="outline" className="border-[#fff8f3]/20 text-white hover:bg-white/10" onClick={logout}>
                <LogOut size={16} className="mr-2" />
                {t('nav.logout')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="max-w-6xl mx-auto px-6 -mt-6">
        <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
          <div className="flex justify-center md:justify-start overflow-auto pb-2">
            <TabsList className="bg-white shadow-md border border-[#fcecd5] p-1 h-14 rounded-full">
              <TabsTrigger value="overview" className="rounded-full px-6 data-[state=active]:bg-[#703225] data-[state=active]:text-white transition-all">
                <User size={16} className="mr-2 md:inline hidden" /> {t('profile.overview')}
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-full px-6 data-[state=active]:bg-[#703225] data-[state=active]:text-white transition-all">
                <Package size={16} className="mr-2 md:inline hidden" /> {t('profile.my_orders')}
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-full px-6 data-[state=active]:bg-[#703225] data-[state=active]:text-white transition-all">
                <Settings size={16} className="mr-2 md:inline hidden" /> {t('profile.settings')}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* OVERVIEW CONTENT */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Stats */}
              <Card className="border-[#fcecd5] shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#86736f]">{t('profile.stats.active')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-serif text-[#703225]">{orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length}</p>
                </CardContent>
              </Card>
              <Card className="border-[#fcecd5] shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#86736f]">{t('profile.stats.total')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-serif text-[#703225]">{orders.length}</p>
                </CardContent>
              </Card>
              <Card className="border-[#fcecd5] shadow-sm hover:shadow-md transition-shadow bg-[#703225] text-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#fff8f3]/70">{t('profile.stats.zalo')}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold">{t('profile.stats.zalo_verified')}</p>
                    <p className="text-xs text-[#fff8f3]/70">{t('profile.stats.otp_verified')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-[#fcecd5] shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-serif text-xl">{t('profile.recent')}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')} className="text-[#c8a35a]">
                  {t('checkout.edit')} <ChevronRight size={16} />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-[#86736f]">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    <p>{t('profile.no_orders')}</p>
                  </div>
                ) : (
                  orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-[#fffcf9] border border-[#fcecd5] hover:bg-white transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-[#fcecd5] flex items-center justify-center text-[#703225]">
                          <Package size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-[#221a0c]">{order.trackingNumber}</p>
                          <p className="text-xs text-[#86736f]">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-6">
                        <StatusBadge status={order.status} />
                        <span className="font-serif font-bold text-[#703225] group-hover:translate-x-1 transition-transform">
                          {formatPrice(order.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders">
            <Card className="border-[#fcecd5] shadow-sm min-h-[400px]">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-[#221a0c]">{t('orders.title')}</CardTitle>
                <CardDescription>{t('orders.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-[#fcecd5] rounded-sm p-6 hover:shadow-lg transition-shadow bg-white">
                      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86736f] mb-1">{t('profile.tracking')}</p>
                          <h4 className="text-xl font-serif text-[#703225]">{order.trackingNumber}</h4>
                        </div>
                        <div className="flex items-center gap-6 self-start">
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">{t('profile.status_label')}</p>
                            <StatusBadge status={order.status} />
                          </div>
                          <Separator orientation="vertical" className="h-10 bg-[#fcecd5]" />
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">{t('profile.amount')}</p>
                            <p className="font-serif font-bold text-lg">{formatPrice(order.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="mb-6 bg-[#fcecd5]" />
                      
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-3 bg-[#fffcf9] px-3 py-2 rounded border border-[#fcecd5]">
                          <div className="w-10 h-10 rounded-full bg-[#c8a35a]/10 flex items-center justify-center text-[#c8a35a]">
                            <Gem size={20} />
                          </div>
                          <span className="text-xs font-bold text-[#221a0c] uppercase tracking-wider">{t('orders.artisan_piece') || 'Artisan Piece'}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#fffcf9] px-3 py-2 rounded border border-[#fcecd5]">
                          <Truck size={16} className="text-[#703225]" />
                          <span className="text-xs text-[#86736f]">{order.shippingMethod}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button variant="outline" className="border-[#703225] text-[#703225] hover:bg-[#703225] hover:text-white">
                          {t('orders.track') || 'Track Shipment'}
                        </Button>
                        <Button className="bg-[#c8a35a] hover:bg-[#b08e4d] text-[#221a0c] font-bold">
                          {t('profile.contact_showroom')}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && !loading && (
                    <div className="text-center py-24 opacity-40">
                      <Package size={64} className="mx-auto mb-4" />
                      <p className="font-serif text-xl italic">{t('profile.ready_to_curate')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-[#fcecd5] shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="font-serif text-2xl text-[#221a0c]">{t('profile.edit_profile')}</CardTitle>
                      <CardDescription>{t('profile.edit_profile_desc') || 'Update your personal details and delivery preferences.'}</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 size={14} className="mr-2" /> {t('profile.edit_profile')}
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">{t('checkout.form.full_name')}</label>
                          <Input 
                            value={profileForm.fullName} 
                            disabled={!isEditing} 
                            onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                            className="bg-[#fffcf9] border-[#fcecd5] focus:border-[#703225]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">{t('profile.email_label') || 'Email Address'}</label>
                          <Input value={profileForm.email} disabled className="bg-[#f5f5f5] border-[#fcecd5] cursor-not-allowed opacity-70" />
                        </div>
                      </div>

                      <div className="space-y-2 relative">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#86736f] flex items-center gap-2">
                          {t('checkout.form.phone')} 
                          <Badge className="bg-blue-100 text-blue-700 border-none px-2 py-0 h-4 text-[8px] font-bold">{t('profile.stats.zalo_verified').toUpperCase()}</Badge>
                        </label>
                        <div className="relative">
                          <Input 
                            value={profileForm.phone} 
                            disabled={!isEditing} 
                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                            className="bg-[#fffcf9] border-[#fcecd5] pl-10"
                          />
                          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8a35a]" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500">
                             <ShieldCheck size={18} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">{t('profile.delivery_address') || 'Default Delivery Address'}</label>
                        <div className="relative">
                          <Input 
                            value={profileForm.address} 
                            disabled={!isEditing} 
                            onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                            className="bg-[#fffcf9] border-[#fcecd5] pl-10 pr-4 py-6"
                          />
                          <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8a35a]" />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex justify-end gap-3 pt-4">
                          <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>{t('profile.cancel')}</Button>
                          <Button type="submit" className="bg-[#703225] hover:bg-[#5a281e] text-white px-8">{t('profile.save_changes')}</Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-[#fcecd5] bg-[#fff9f4] shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">{t('profile.security.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-[#86736f]">{t('profile.security.desc').replace('{{phone}}', user.phone || 'N/A')}</p>
                    <Button variant="outline" className="w-full border-[#fcecd5] text-[#703225]">{t('profile.security.change_password')}</Button>
                  </CardContent>
                </Card>

                <Card className="border-[#fcecd5] bg-[#221a0c] text-white overflow-hidden relative">
                   <div className="absolute -right-8 -bottom-8 opacity-10">
                     <Gem size={150} />
                   </div>
                   <CardHeader>
                    <CardTitle className="font-serif text-lg text-[#c8a35a]">{t('profile.concierge.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <p className="text-xs text-[#b8a99a]">{t('profile.concierge.desc')}</p>
                    <Button className="w-full bg-[#703225] hover:bg-[#8d493a] border-none text-white font-bold">
                       {t('profile.concierge.cta')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

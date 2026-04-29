import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import * as userService from '@/services/userService';
import * as orderService from '@/services/orderService';
import * as authService from '@/services/authService';
import { 
  User, Package, Settings, Heart, LogOut, 
  MapPin, Phone, Mail, Calendar, CheckCircle2, 
  Clock, Truck, ChevronRight, ShieldCheck, 
  MessageCircle, Camera, Edit2, Gem, RotateCw, Plus, Trash2, MapPinHouse 
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

// New Shadcn Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const StatusBadge = ({ status }) => {
  const { t } = useLocalization();
  const configs = {
    'PENDING': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: t('orders.status.PENDING') || 'Chờ xác nhận' },
    'CONFIRMED': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2, label: t('orders.status.CONFIRMED') || 'Đã xác nhận' },
    'PROCESSING': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: RotateCw, label: t('orders.status.PREPARING') || 'Đang xử lý' },
    'SHIPPED': { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Truck, label: t('orders.status.SHIPPING') || 'Đang giao' },
    'DELIVERED': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: t('orders.status.DELIVERED') || 'Đã giao' },
    'CANCELLED': { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: LogOut, label: t('orders.status.CANCELLED') || 'Đã hủy' },
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
  });

  // Sổ địa chỉ (Address Book)
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({ id: '', name: '', phone: '', address: '', isDefault: false });

  useEffect(() => {
    if (user) {
      fetchOrders();
      // Khởi tạo Sổ địa chỉ từ mảng JSON trong user.address
      try {
        if (user.address && user.address.startsWith('[')) {
          setAddresses(JSON.parse(user.address));
        } else if (user.address) {
          // Fallback legacy (1 địa chỉ cũ)
          setAddresses([{ id: Date.now().toString(), name: user.fullName, phone: user.phone, address: user.address, isDefault: true }]);
        } else {
          setAddresses([]);
        }
      } catch (e) {
         console.warn("Lỗi parse địa chỉ, tạo sổ địa chỉ trống");
         setAddresses([]);
      }
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
      // Giữ nguyên address hiện tại (đã lưu string JSON)
      const payload = { ...profileForm, address: user?.address || '' };
      await userService.updateProfile(payload);
      updateUser(payload);
      setIsEditing(false);
      toast.success(t('profile.success_update') || 'Cập nhật thành công');
    } catch (error) {
      toast.error(error.message || t('checkout.errors.generic'));
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!user?.email) {
        toast.error('Không tìm thấy email liên kết với tài khoản này.');
        return;
      }
      await authService.forgotPassword(user.email);
      toast.success('Gửi OTP/Link đổi mật khẩu thành công!', {
        description: 'Vui lòng kiểm tra hộp thư đến hoặc mục thư rác email của bạn.'
      });
    } catch (error) {
      toast.error(error.message || 'Lỗi gửi yêu cầu đổi mật khẩu. Vui lòng thử lại sau.');
    }
  };

  // --- ADDRESS BOOK HANDLERS ---
  const saveAddressBook = async (newAddresses) => {
     try {
        const addressString = JSON.stringify(newAddresses);
        const payload = { ...profileForm, address: addressString };
        await userService.updateProfile(payload);
        updateUser(payload); // Cập nhật AuthContext
        setAddresses(newAddresses);
        toast.success("Đã lưu sổ địa chỉ");
     } catch (error) {
        toast.error("Lỗi khi lưu địa chỉ: " + error.message);
     }
  };

  const handleAddressSubmit = () => {
     if(!addressForm.name || !addressForm.phone || !addressForm.address) {
        toast.error("Vui lòng nhập đầy đủ thông tin địa chỉ");
        return;
     }

     let newAddresses = [...addresses];
     
     // Xử lý isDefault (Nếu cái mới là mặc định, bỏ mặc định các cái cũ)
     if (addressForm.isDefault || newAddresses.length === 0) {
        newAddresses = newAddresses.map(a => ({...a, isDefault: false}));
        setAddressForm({...addressForm, isDefault: true});
     }

     if (addressForm.id) {
        // Edit 
        newAddresses = newAddresses.map(a => a.id === addressForm.id ? { ...addressForm, isDefault: addressForm.isDefault || newAddresses.length === 0 } : a);
     } else {
        // Add
        newAddresses.push({ ...addressForm, id: Date.now().toString(), isDefault: addressForm.isDefault || newAddresses.length === 0 });
     }

     saveAddressBook(newAddresses);
     setIsAddressModalOpen(false);
  };

  const deleteAddress = (id) => {
     const newAddresses = addresses.filter(a => a.id !== id);
     // Đảm bảo có mặc định 
     if (newAddresses.length > 0 && !newAddresses.some(a => a.isDefault)) {
        newAddresses[0].isDefault = true;
     }
     saveAddressBook(newAddresses);
  };

  const setAsDefaultAddress = (id) => {
     const newAddresses = addresses.map(a => ({ ...a, isDefault: a.id === id }));
     saveAddressBook(newAddresses);
  };

  const openNewAddressForm = () => {
     setAddressForm({ id: '', name: user?.fullName || '', phone: user?.phone || '', address: '', isDefault: addresses.length === 0 });
     setIsAddressModalOpen(true);
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-[#fffcf9] shadow-2xl">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}&background=703225&color=fff`} />
                <AvatarFallback className="bg-[#703225] text-white text-2xl">{user.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-1 right-1 bg-[#c8a35a] text-white p-2 rounded-full shadow-lg border-2 border-[#fffcf9] hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </motion.div>
            
            <div className="text-center md:text-left text-[#fff8f3] flex-1">
              <BlurText text={user.fullName} className="text-3xl md:text-4xl font-serif mb-2" />
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-[#b8a99a]">
                <span className="flex items-center gap-1.5"><Mail size={14} className="text-[#c8a35a]" /> {user.email}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#c8a35a]" /> {t('profile.member_since')?.replace('{{year}}', '2024') || 'Thành viên từ 2024'}</span>
                <Badge className="bg-[#c8a35a] hover:bg-[#b08e4d] text-[#221a0c] font-bold">ELITAN MEMBER</Badge>
              </div>
            </div>

            <div className="flex gap-3 relative z-30">
              <Button variant="outline" className="border-[#fff8f3]/30 bg-black/20 text-[#fff8f3] hover:bg-white/20 hover:text-white backdrop-blur-sm" onClick={logout}>
                <LogOut size={16} className="mr-2" />
                {t('nav.logout') || 'Đăng xuất'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="relative z-20 max-w-6xl mx-auto px-6 py-6 md:py-10">
        <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
          <div className="flex justify-center md:justify-start overflow-auto pb-2">
            <TabsList className="bg-white shadow-md border border-[#fcecd5] p-1 h-14 rounded-full">
              <TabsTrigger value="overview" className="rounded-full px-6 data-[state=active]:bg-[#703225] data-[state=active]:text-white transition-all">
                <User size={16} className="mr-2 md:inline hidden" /> {t('profile.overview') || 'Tổng quan'}
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-full px-6 data-[state=active]:bg-[#703225] data-[state=active]:text-white transition-all">
                <Package size={16} className="mr-2 md:inline hidden" /> {t('profile.my_orders') || 'Đơn hàng'}
              </TabsTrigger>
              <TabsTrigger value="addresses" className="rounded-full px-6 data-[state=active]:bg-[#703225] data-[state=active]:text-white transition-all">
                <MapPinHouse size={16} className="mr-2 md:inline hidden" /> Sổ địa chỉ
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-full px-6 data-[state=active]:bg-[#703225] data-[state=active]:text-white transition-all">
                <Settings size={16} className="mr-2 md:inline hidden" /> {t('profile.settings') || 'Cài đặt'}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* OVERVIEW CONTENT */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-[#fcecd5] shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#86736f]">Đơn đang xử lý</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-serif text-[#703225]">{orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length}</p>
                </CardContent>
              </Card>
              <Card className="border-[#fcecd5] shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#86736f]">Tổng số đơn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-serif text-[#703225]">{orders.length}</p>
                </CardContent>
              </Card>
              <Card className="border-[#fcecd5] shadow-sm hover:shadow-md transition-shadow bg-[#703225] text-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#fff8f3]/70">Trạng thái xác thực</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold">Zalo Verified</p>
                    <p className="text-xs text-[#fff8f3]/70">Đã xác thực OTP</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-[#fcecd5] shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-serif text-xl">Đơn hàng gần đây</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')} className="text-[#c8a35a]">
                  Xem tất cả <ChevronRight size={16} />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-[#86736f]">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Chưa có đơn hàng nào. Khám phá ngay bộ sưu tập của chúng tôi.</p>
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
                <CardTitle className="font-serif text-2xl text-[#221a0c]">{t('orders.title') || 'Lịch sử mua hàng'}</CardTitle>
                <CardDescription>Theo dõi danh sách nội thất nghệ thuật của bạn.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-[#fcecd5] rounded-sm p-6 hover:shadow-lg transition-shadow bg-white">
                      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86736f] mb-1">Mã vận đơn</p>
                          <h4 className="text-xl font-serif text-[#703225]">{order.trackingNumber}</h4>
                        </div>
                        <div className="flex items-center gap-6 self-start">
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">Trạng thái</p>
                            <StatusBadge status={order.status} />
                          </div>
                          <Separator orientation="vertical" className="h-10 bg-[#fcecd5]" />
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">Tổng tiền</p>
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
                          <span className="text-xs font-bold text-[#221a0c] uppercase tracking-wider">Artisan Piece</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#fffcf9] px-3 py-2 rounded border border-[#fcecd5]">
                          <Truck size={16} className="text-[#703225]" />
                          <span className="text-xs text-[#86736f]">{order.shippingMethod}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button variant="outline" className="border-[#703225] text-[#703225] hover:bg-[#703225] hover:text-white">
                           Theo dõi vận chuyển
                        </Button>
                        <Button className="bg-[#c8a35a] hover:bg-[#b08e4d] text-[#221a0c] font-bold">
                           Liên hệ Showroom
                        </Button>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && !loading && (
                    <div className="text-center py-24 opacity-40">
                      <Package size={64} className="mx-auto mb-4" />
                      <p className="font-serif text-xl italic">Bạn chưa mua gì, hãy sẵn sàng khám phá</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADDRESS BOOK TAB */}
          <TabsContent value="addresses">
             <div className="flex flex-col md:flex-row justify-between mb-8 items-end gap-4">
                <div>
                   <h2 className="text-3xl font-serif text-[#221a0c]">Sổ địa chỉ giao hàng</h2>
                   <p className="text-gray-500 mt-2">Quản lý không giới hạn các địa chỉ ngôi nhà của bạn để đặt nội thất ÉLITAN.</p>
                </div>
                <Button onClick={openNewAddressForm} className="bg-[#221a0c] hover:bg-[#c8a35a] text-white">
                   <Plus size={16} className="mr-2" /> Thêm địa chỉ mới
                </Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((addr) => (
                   <Card key={addr.id} className={`border ${addr.isDefault ? 'border-[#703225] shadow-md relative overflow-hidden' : 'border-[#fcecd5] shadow-sm'}`}>
                      {addr.isDefault && (
                         <div className="absolute top-0 right-0 py-1 px-4 bg-[#703225] text-white text-[9px] font-bold uppercase tracking-widest text-center shadow-sm">
                            Mặc định
                         </div>
                      )}
                      <CardHeader className="pb-3 pt-6">
                         <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="text-base font-bold text-[#221a0c] uppercase">{addr.name}</CardTitle>
                                <CardDescription className="flex items-center text-xs mt-1 font-semibold text-gray-500">
                                   <Phone size={12} className="mr-1" /> {addr.phone}
                                </CardDescription>
                             </div>
                         </div>
                      </CardHeader>
                      <CardContent>
                         <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap flex items-start -ml-1">
                            <MapPin size={16} className="text-[#c8a35a] mr-2 shrink-0 mt-0.5" />
                            {addr.address}
                         </p>
                      </CardContent>
                      <Separator className="bg-[#fcecd5]"/>
                      <CardFooter className="pt-4 flex justify-between">
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[#c8a35a] hover:text-[#221a0c] hover:bg-[#fcecd5]"
                            onClick={() => { setAddressForm(addr); setIsAddressModalOpen(true); }}
                         >
                            Chỉnh sửa
                         </Button>
                         <div className="flex gap-2">
                            {!addr.isDefault && (
                               <Button size="sm" variant="outline" className="border-[#fcecd5] text-xs" onClick={() => setAsDefaultAddress(addr.id)}>
                                  Dùng tạm
                               </Button>
                            )}
                            <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => deleteAddress(addr.id)}>
                               <Trash2 size={16} />
                            </Button>
                         </div>
                      </CardFooter>
                   </Card>
                ))}
             </div>
             
             {/* Thêm Dialog ở trong File để quản lý form */}
             <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                <DialogContent className="sm:max-w-[500px] border-[#c8a35a]/20 shadow-2xl bg-[#fffcf9]">
                   <DialogHeader>
                      <DialogTitle className="font-serif text-2xl text-[#221a0c]">{addressForm.id ? "Chỉnh sửa địa chỉ" : "Thêm mới điểm giao"}</DialogTitle>
                      <DialogDescription>
                         Nhập thông tin người nhận hàng chính xác để chúng tôi vận chuyển nội thất Tới nhà bạn.
                      </DialogDescription>
                   </DialogHeader>
                   <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-[#86736f]">Họ và tên</Label>
                            <Input 
                               id="name" 
                               value={addressForm.name} 
                               onChange={(e) => setAddressForm({...addressForm, name: e.target.value})} 
                               className="border-[#fcecd5] focus:border-[#703225] bg-white" 
                            />
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-[#86736f]">Điện thoại</Label>
                            <Input 
                               id="phone" 
                               value={addressForm.phone} 
                               onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} 
                               className="border-[#fcecd5] focus:border-[#703225] bg-white" 
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <Label htmlFor="address" className="text-xs font-bold uppercase tracking-widest text-[#86736f]">Địa chỉ nhà / Căn hộ chi tiết</Label>
                         <Textarea 
                            id="address" 
                            rows={3}
                            value={addressForm.address} 
                            onChange={(e) => setAddressForm({...addressForm, address: e.target.value})} 
                            className="border-[#fcecd5] focus:border-[#703225] bg-white placeholder:italic" 
                            placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Thành phố..."
                         />
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                         <Checkbox 
                            id="isDefault" 
                            checked={addressForm.isDefault} 
                            onCheckedChange={(checked) => setAddressForm({...addressForm, isDefault: checked})} 
                            className="border-[#c8a35a] data-[state=checked]:bg-[#703225] data-[state=checked]:border-[#703225]"
                         />
                         <Label htmlFor="isDefault" className="text-sm font-medium leading-none text-[#703225]">
                            Đặt làm địa chỉ nhận hàng ưu tiên
                         </Label>
                      </div>
                   </div>
                   <DialogFooter>
                      <Button variant="outline" className="border-[#fcecd5]" onClick={() => setIsAddressModalOpen(false)}>Hủy bỏ</Button>
                      <Button onClick={handleAddressSubmit} className="bg-[#703225] hover:bg-[#5a281e] text-white">Lưu vị trí này</Button>
                   </DialogFooter>
                </DialogContent>
             </Dialog>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-[#fcecd5] shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="font-serif text-2xl text-[#221a0c]">{t('profile.edit_profile') || 'Thông tin người dùng'}</CardTitle>
                      <CardDescription>Cập nhật số điện thoại và email cá nhân.</CardDescription>
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
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">Họ và Tên</label>
                          <Input 
                            value={profileForm.fullName} 
                            disabled={!isEditing} 
                            onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                            className="bg-[#fffcf9] border-[#fcecd5] focus:border-[#703225]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">Email Address</label>
                          <Input value={profileForm.email} disabled className="bg-[#f5f5f5] border-[#fcecd5] cursor-not-allowed opacity-70" />
                        </div>
                      </div>

                      <div className="space-y-2 relative w-full md:w-1/2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#86736f] flex items-center gap-2">
                          Số điện thoại 
                          <Badge className="bg-blue-100 text-blue-700 border-none px-2 py-0 h-4 text-[8px] font-bold">ZALO VERIFIED</Badge>
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

                      {isEditing && (
                        <div className="flex justify-end gap-3 pt-4">
                          <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>{t('profile.cancel') || 'Hủy'}</Button>
                          <Button type="submit" className="bg-[#703225] hover:bg-[#5a281e] text-white px-8">{t('profile.save_changes') || 'Lưu lại'}</Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-[#fcecd5] bg-[#fff9f4] shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">{t('profile.security.title') || 'Bảo mật'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-[#86736f]">Bảo vệ mật khẩu với mã OTP gửi qua Email: <span className="font-bold">{user.email || 'N/A'}</span></p>
                    <Button variant="outline" className="w-full border-[#fcecd5] text-[#703225] hover:bg-[#703225] hover:text-white" onClick={handleResetPassword}>Thay Đổi Mật Khẩu</Button>
                    
                    <Separator className="bg-[#fcecd5] my-4" />
                    
                        {/* --- Discord 2FA Section --- */}
                        <div className="space-y-4">
                           <div className="flex items-center gap-2">
                              <ShieldCheck size={20} className="text-[#703225]" />
                              <h4 className="font-serif text-base text-[#221a0c]">Xác thực 2 lớp (2FA)</h4>
                           </div>
                           <p className="text-[11px] text-gray-500 leading-relaxed italic">
                              Nhận mã OTP qua Discord mỗi khi bạn đăng nhập để bảo mật tài khoản tuyệt đối.
                           </p>
                       
                           <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#86736f]">Discord User ID</Label>
                              <div className="flex gap-2">
                                 <Input 
                                    type="text" 
                                    placeholder="Nhập ID người dùng Discord" 
                                    defaultValue={user.discordUserId || ''}
                                    id="discordUserId"
                                    className="bg-white border-[#fcecd5] h-9 text-sm"
                                 />
                                 <Button 
                                    size="sm" 
                                    className="bg-[#221a0c] text-white hover:bg-[#c8a35a]"
                                    onClick={async () => {
                                       try {
                                          const uid = document.getElementById('discordUserId').value;
                                          if(!uid) return toast.error("Vui lòng nhập Discord User ID");
                                          await userService.linkDiscord(uid);
                                          updateUser({ discordUserId: uid });
                                          toast.success("Đã liên kết Discord");
                                       } catch(e) {
                                          toast.error(e.message);
                                       }
                                    }}
                                 >
                                    <CheckCircle2 size={14} />
                                 </Button>
                              </div>
                              <p className="text-[9px] text-[#c8a35a]">
                                 * Bật Developer Mode trong Discord, chuột phải vào tên bạn và chọn <b>Copy User ID</b>.
                              </p>
                           </div>

                       <div className="flex items-center justify-between p-3 bg-white rounded border border-[#fcecd5]">
                          <div className="space-y-0.5">
                             <p className="text-xs font-bold text-[#221a0c]">Trạng thái 2FA</p>
                             <p className="text-[10px] text-gray-500">{user.twoFactorEnabled ? "Đang bật" : "Đang tắt"}</p>
                          </div>
                          <Checkbox 
                            checked={user.twoFactorEnabled}
                            onCheckedChange={async (checked) => {
                               try {
                                   await userService.toggle2FA(checked);
                                   updateUser({ twoFactorEnabled: checked });
                                   toast.success(`Đã ${checked ? 'Bật' : 'Tắt'} 2FA`);
                               } catch(e) {
                                  toast.error(e.message);
                               }
                            }}
                            className="border-[#c8a35a] data-[state=checked]:bg-[#703225] data-[state=checked]:border-[#703225]"
                          />
                       </div>
                    </div>
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


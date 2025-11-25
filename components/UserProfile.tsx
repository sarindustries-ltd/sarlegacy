
import React, { useState } from 'react';
import { User, Order } from '../types';
import { ArrowLeftIcon, PackageIcon, SettingsIcon, CreditCardIcon, LayoutDashboardIcon, LogOutIcon, AwardIcon, ShieldCheckIcon, Edit2Icon, CameraIcon, MapPinIcon, TruckIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';

interface UserProfileProps {
  user: User;
  orders: Order[];
  onBack: () => void;
  onLogout?: () => void;
}

type ProfileTab = 'overview' | 'orders' | 'settings';

const UserProfile: React.FC<UserProfileProps> = ({ user, orders, onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  // Filter orders for the current user
  const userOrders = orders.filter(order => order.userId === user.id);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-4">
      {/* Breadcrumb / Back */}
      <nav className="mb-8 flex items-center gap-4 text-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group font-medium">
          <ArrowLeftIcon size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Store
        </button>
        <span className="text-slate-700">/</span>
        <span className="text-slate-200 font-medium">My Profile</span>
      </nav>

      {/* Profile Header Card */}
      <div className="relative w-full h-48 sm:h-64 rounded-3xl overflow-hidden mb-12 group">
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-950 to-blue-950">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-nexus-950 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col sm:flex-row items-end sm:items-center gap-6">
            <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-nexus-950 shadow-2xl overflow-hidden bg-slate-800 relative group-hover:scale-105 transition-transform duration-500">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-2 right-2 p-2 rounded-full bg-nexus-accent text-white border border-nexus-950 shadow-lg hover:bg-white hover:text-nexus-accent transition-colors" aria-label="Change profile picture">
                    <CameraIcon size={14} />
                </button>
            </div>
            
            <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">{user.name}</h1>
                    {user.rank && (
                      <span className="px-3 py-1 rounded-full bg-nexus-accent/20 border border-nexus-accent/30 text-nexus-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <AwardIcon size={12} /> {user.rank}
                      </span>
                    )}
                </div>
                <p className="text-slate-400 text-sm font-mono mb-4">{user.email} • Member since {user.memberSince}</p>
                
                {user.tierProgress !== undefined && (
                  <div className="max-w-md">
                     <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                        <span>Tier Progress</span>
                        <span>{user.tierProgress}% to Legend</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-nexus-accent rounded-full" style={{ width: `${user.tierProgress}%` }}></div>
                     </div>
                  </div>
                )}
            </div>

            <div className="flex gap-3 pb-2">
               <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all flex items-center gap-2 backdrop-blur-md">
                  <Edit2Icon size={16} /> Edit Profile
               </button>
            </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:sticky lg:top-24 h-fit" role="tablist" aria-label="User Profile Sections">
            <div className="space-y-2">
                <button role="tab" aria-selected={activeTab === 'overview'} onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-nexus-accent text-white shadow-lg shadow-nexus-accent/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}><LayoutDashboardIcon size={18} /> Dashboard</button>
                <button role="tab" aria-selected={activeTab === 'orders'} onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-nexus-accent text-white shadow-lg shadow-nexus-accent/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}><PackageIcon size={18} /> Orders History</button>
                <button role="tab" aria-selected={activeTab === 'settings'} onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-nexus-accent text-white shadow-lg shadow-nexus-accent/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}><SettingsIcon size={18} /> Account Settings</button>
            </div>
            <div className="pt-4 border-t border-white/5 mt-4"><button onClick={onLogout} className="w-full flex items-center gap-3 p-4 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"><LogOutIcon size={18} /> Log Out</button></div>
         </div>

         <div className="col-span-1 lg:col-span-3">
            <div role="tabpanel" hidden={activeTab !== 'overview'}>
              {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4"><div className="p-3 rounded-xl bg-nexus-accent/20 text-nexus-accent"><CreditCardIcon size={24} /></div><div><p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Wallet Balance</p><p className="text-2xl font-display font-bold text-white">{user.credits || 0} <span className="text-sm text-slate-500 font-sans font-normal">CR</span></p></div></div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4"><div className="p-3 rounded-xl bg-purple-500/20 text-purple-400"><PackageIcon size={24} /></div><div><p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Total Orders</p><p className="text-2xl font-display font-bold text-white">{userOrders.length}</p></div></div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4"><div className="p-3 rounded-xl bg-green-500/20 text-green-400"><ShieldCheckIcon size={24} /></div><div><p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Account Status</p><p className="text-xl font-display font-bold text-white">Verified</p></div></div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Recent Orders</h3>
                        <div className="space-y-4">
                          {userOrders.slice(0, 2).map(order => (
                              <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-black/20 hover:bg-black/40 transition-colors border border-white/5 gap-4">
                                  <div className="flex items-center gap-4"><div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0"><img src={`https://picsum.photos/seed/${order.items[0].productId}/200`} alt="Order" className="w-full h-full object-cover" /></div><div><h4 className="text-white font-bold text-sm">{order.id}</h4><p className="text-slate-400 text-xs">{order.items.map(i => i.name).join(", ")}</p><p className="text-slate-500 text-[10px] mt-1">{order.date}</p></div></div>
                                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{order.status}</span>
                                      <span className="text-white font-bold font-mono">${order.total.toFixed(2)}</span>
                                  </div>
                              </div>
                          ))}
                        </div>
                        <button onClick={() => setActiveTab('orders')} className="w-full mt-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium">View All Activity</button>
                    </div>
                  </div>
              )}
            </div>
            <div role="tabpanel" hidden={activeTab !== 'orders'}>
              {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2"><h2 className="text-2xl font-bold text-white">Order History</h2><div className="flex gap-2"><select className="bg-white/5 border border-white/10 rounded-lg text-xs text-white px-3 py-2 outline-none focus:border-nexus-accent"><option>All Time</option><option>Last 30 Days</option><option>2024</option></select></div></div>
                    {userOrders.map(order => (
                        <div key={order.id} className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4 mb-4"><div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6"><div><p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Order Placed</p><p className="text-slate-200 text-sm font-medium">{order.date}</p></div><div><p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total</p><p className="text-slate-200 text-sm font-medium">${order.total.toFixed(2)}</p></div><div><p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Order #</p><p className="text-slate-200 text-sm font-medium font-mono">{order.id}</p></div></div><div className="flex items-center gap-3"><button className="px-4 py-2 rounded-lg border border-white/10 text-xs font-bold text-white hover:bg-white/5 transition-colors">View Invoice</button></div></div>
                            <div className="flex items-start gap-4"><div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-white/5"><img src={`https://picsum.photos/seed/${order.items[0].productId}/200`} alt="Product" className="w-full h-full object-cover" /></div><div className="flex-1"><div className="flex justify-between items-start"><div><h4 className="text-white font-bold text-base mb-1">{order.items[0].name} {order.items.length > 1 && <span className="text-slate-500 font-normal text-xs">+{order.items.length - 1} more</span>}</h4><p className="text-slate-400 text-sm mb-3">Standard Shipping</p></div></div>{order.status === 'Delivered' ? (<div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wide"><CheckCircleIcon size={14} /> Delivered</div>) : (<div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wide"><ClockIcon size={14} /> Processing</div>)}</div><div className="hidden sm:block"><button className="px-4 py-2 bg-nexus-accent text-white text-xs font-bold rounded-lg hover:bg-nexus-accentHover transition-colors shadow-lg shadow-nexus-accent/20">Buy Again</button></div></div>
                        </div>
                    ))}
                  </div>
              )}
            </div>
            <div role="tabpanel" hidden={activeTab !== 'settings'}>
              {activeTab === 'settings' && (
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label><input type="text" defaultValue={user.name} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-nexus-accent transition-colors" /></div>
                        <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label><input type="email" defaultValue={user.email} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-nexus-accent transition-colors" /></div>
                        <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label><input type="tel" defaultValue="+1 (555) 000-0000" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-nexus-accent transition-colors" /></div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-6 pt-6 border-t border-white/5">Shipping Addresses</h3>
                    <div className="flex items-center gap-4 p-4 border border-nexus-accent/30 bg-nexus-accent/5 rounded-xl mb-4"><MapPinIcon className="text-nexus-accent" /><div><p className="text-white font-bold text-sm">Home</p><p className="text-slate-400 text-xs">123 Cyber Lane, Neo-Tokyo, NT-99201</p></div><span className="ml-auto text-xs bg-nexus-accent/20 text-nexus-accent px-2 py-1 rounded font-bold">Default</span></div>
                    <button className="w-full py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white hover:border-white/40 transition-all text-sm font-medium">+ Add New Address</button>
                    <div className="mt-8 pt-8 border-t border-white/5 flex justify-end gap-4"><button className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-bold text-sm">Cancel</button><button className="px-6 py-3 rounded-xl bg-nexus-accent text-white hover:bg-nexus-accentHover transition-colors shadow-lg shadow-nexus-accent/20 font-bold text-sm">Save Changes</button></div>
                  </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserProfile;
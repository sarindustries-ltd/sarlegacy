
import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, Order, ProductCategory } from '../types';
import { 
    LayoutDashboardIcon, PackageIcon, UsersIcon, ShoppingCartIcon, LogOutIcon, MoreVerticalIcon, 
    EditIcon, Trash2Icon, PlusCircleIcon, XIcon, DollarSignIcon, BarChartIcon, UserPlusIcon, 
    ActivityIcon, SearchIcon, SettingsIcon, BellIcon, ToggleLeftIcon, ToggleRightIcon, 
    ArrowRightIcon, CheckCircleIcon, ClockIcon, TruckIcon, StarIcon, ShieldCheckIcon
} from 'lucide-react';

type AdminPanel = 'overview' | 'products' | 'users' | 'orders' | 'settings';

// --- Reusable Components ---
const StatCard = ({ title, value, icon, change }) => (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 transition-all hover:border-nexus-accent/30 hover:bg-slate-800/80 hover:-translate-y-1 cursor-pointer shadow-lg hover:shadow-nexus-accent/10">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-700/50 text-slate-300 rounded-lg group-hover:bg-nexus-accent/20 group-hover:text-nexus-accent transition-colors">{icon}</div>
            <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
        </div>
        <p className="text-3xl font-display font-bold text-white">{value}</p>
        <p className="text-sm text-slate-500 uppercase tracking-wider">{title}</p>
    </div>
);

const Modal = ({ isOpen, onClose, title, children, size = '2xl' }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
            <div className={`relative w-full max-w-${size} bg-slate-900 border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col`}>
                <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                    <h3 className="text-xl font-display font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-nexus-accent focus:ring-offset-2 focus:ring-offset-slate-900"><XIcon size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

// --- Panels ---
const OverviewPanel = ({ products, users, orders }) => {
    const salesData = useMemo(() => [
        { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 }, { name: 'Mar', sales: 5000 },
        { name: 'Apr', sales: 4500 }, { name: 'May', sales: 6000 }, { name: 'Jun', sales: 5500 },
    ], []);
    const maxSales = useMemo(() => Math.max(...salesData.map(d => d.sales)), [salesData]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                  <p className="text-sm text-slate-400">Welcome back, Admin. Here's a snapshot of your store.</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <button className="px-4 py-2 bg-nexus-accent text-white font-bold text-sm rounded-lg hover:bg-nexus-accentHover transition-colors shadow-lg shadow-nexus-accent/20 flex items-center gap-2"><PlusCircleIcon size={16}/> New Product</button>
                    <button className="px-4 py-2 bg-white/5 text-white font-bold text-sm rounded-lg hover:bg-white/10 transition-colors border border-white/10">Generate Report</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`$${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`} icon={<DollarSignIcon />} change="+12.5%" />
                <StatCard title="Total Sales" value={orders.length} icon={<ShoppingCartIcon />} change="+8.1%" />
                <StatCard title="New Customers" value={users.length} icon={<UserPlusIcon />} change="+2" />
                <StatCard title="Products" value={products.length} icon={<PackageIcon />} change="+1" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BarChartIcon size={18} /> Sales Chart (Last 6 Months)</h3>
                    <div className="h-64 flex items-end justify-between gap-4">
                        {salesData.map((d, i) => (
                            <div key={d.name} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full h-full bg-slate-700/50 rounded-lg relative overflow-hidden flex items-end animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i*100}ms`}}>
                                    <div className="w-full bg-nexus-accent transition-all duration-500 ease-out group-hover:bg-nexus-glow" style={{ height: `${(d.sales / maxSales) * 100}%` }}></div>
                                </div>
                                <span className="text-xs text-slate-500 font-bold">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ActivityIcon size={18} /> Recent Activity</h3>
                    <div className="space-y-4">
                        {orders.slice(0, 2).map(o => (
                            <div key={o.id} className="flex items-center gap-3 text-sm"><div className="w-8 h-8 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center flex-shrink-0"><ShoppingCartIcon size={14}/></div><div><span className="font-bold text-white">{o.customerName}</span> placed order <span className="font-mono text-nexus-accent">{o.id}</span>.</div></div>
                        ))}
                        {users.slice(0, 2).map(u => (
                             <div key={u.id} className="flex items-center gap-3 text-sm"><div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0"><UserPlusIcon size={14}/></div><div><span className="font-bold text-white">{u.name}</span> created an account.</div></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductsPanel = ({ products, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'All'>('All');

    const filteredProducts = useMemo(() => products.filter(p => 
        (p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (categoryFilter === 'All' || p.category === categoryFilter)
    ), [products, searchTerm, categoryFilter]);

    const openModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setFormData(product || { name: '', price: 0, category: ProductCategory.ELECTRONICS, description: '', image: '', stock: 0 });
        setIsModalOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            onUpdate({ ...editingProduct, ...formData });
        } else {
            onAdd(formData as any);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full sm:max-w-xs">
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 pl-10 text-white outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent"/>
                    <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as any)} className="w-full sm:w-auto bg-slate-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent">
                        {Object.values(ProductCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <button onClick={() => openModal()} className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-nexus-accent text-white font-bold text-sm rounded-lg hover:bg-nexus-accentHover transition-colors shadow-lg shadow-nexus-accent/20"><PlusCircleIcon size={16} /> Add</button>
                </div>
            </div>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider"><tr><th className="p-4">Product Name</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProducts.map(p => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white flex items-center gap-3 min-w-[250px]"><img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md border border-white/10" />{p.name}</td>
                                <td className="p-4 text-slate-400">{p.category}</td>
                                <td className="p-4 text-slate-300 font-mono">${p.price.toFixed(2)}</td>
                                <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.stock < 10 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>{p.stock} units</span></td>
                                <td className="p-4 text-right"><button onClick={() => openModal(p)} className="p-2 text-slate-400 hover:text-white rounded-md focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white"><EditIcon size={16} /></button><button onClick={() => onDelete(p.id)} className="p-2 text-slate-400 hover:text-red-400 rounded-md focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white"><Trash2Icon size={16} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name || ''} onChange={handleFormChange} placeholder="Product Name" required className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent" />
                    <textarea name="description" value={formData.description || ''} onChange={handleFormChange} placeholder="Description" required className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-nexus-accent min-h-[100px]" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="price" type="number" step="0.01" value={formData.price || 0} onChange={handleFormChange} placeholder="Price" required className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-nexus-accent" />
                        <input name="stock" type="number" value={formData.stock || 0} onChange={handleFormChange} placeholder="Stock" required className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-nexus-accent" />
                        <select name="category" value={formData.category || ''} onChange={handleFormChange} className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-nexus-accent">
                            {Object.values(ProductCategory).filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <input name="image" value={formData.image || ''} onChange={handleFormChange} placeholder="Image URL" required className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-nexus-accent" />
                    <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Cancel</button><button type="submit" className="px-4 py-2 text-white bg-nexus-accent rounded-lg hover:bg-nexus-accentHover transition-colors">{editingProduct ? 'Save Changes' : 'Create Product'}</button></div>
                </form>
            </Modal>
        </div>
    );
};

const UsersPanel = ({ users, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});

    const openModal = (user: User) => {
        setEditingUser(user);
        setFormData(user);
        setIsModalOpen(true);
    };
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({ ...editingUser, ...formData });
        setIsModalOpen(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider"><tr><th className="p-4">User</th><th className="p-4">Total Spent</th><th className="p-4">Role</th><th className="p-4">Last Login</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white flex items-center gap-3 min-w-[250px]"><img src={user.avatar} alt={user.name} className="w-10 h-10 object-cover rounded-full border border-white/10" /><div>{user.name}<p className="text-xs text-slate-500 font-mono">{user.email}</p></div></td>
                                <td className="p-4 text-slate-300 font-mono">${user.totalSpent.toFixed(2)}</td>
                                <td className="p-4"><span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${user.isAdmin ? 'bg-nexus-accent/10 text-nexus-accent border-nexus-accent/20' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>{user.isAdmin ? 'Admin' : 'Customer'}</span></td>
                                <td className="p-4 text-slate-400">{new Date(user.lastLogin).toLocaleDateString()}</td>
                                <td className="p-4 text-right"><button onClick={() => openModal(user)} className="p-2 text-slate-400 hover:text-white rounded-md focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white"><EditIcon size={16} /></button><button onClick={() => onDelete(user.id)} className="p-2 text-slate-400 hover:text-red-400 rounded-md focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white"><Trash2Icon size={16} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit User: ${editingUser?.name}`}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name || ''} onChange={handleFormChange} placeholder="Full Name" className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent" />
                    <input name="email" type="email" value={formData.email || ''} onChange={handleFormChange} placeholder="Email" className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-nexus-accent" />
                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg border border-white/10">
                        <label htmlFor="isAdmin" className="text-white font-medium">Administrator Privileges</label>
                        <input type="checkbox" id="isAdmin" name="isAdmin" checked={!!formData.isAdmin} onChange={handleFormChange} className="ml-auto w-4 h-4 text-nexus-accent bg-slate-700 border-slate-600 rounded focus:ring-nexus-accent" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Cancel</button><button type="submit" className="px-4 py-2 text-white bg-nexus-accent rounded-lg hover:bg-nexus-accentHover transition-colors">Save Changes</button></div>
                </form>
            </Modal>
        </div>
    );
};

const OrdersPanel = ({ orders, onUpdateStatus }) => {
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

    const handleStatusChange = (status: Order['status']) => {
        if (viewingOrder) {
            onUpdateStatus(viewingOrder.id, status);
            setViewingOrder(prev => prev ? { ...prev, status } : null);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider"><tr><th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white font-mono">{order.id}</td>
                                <td className="p-4 text-slate-300">{order.customerName}</td>
                                <td className="p-4 text-slate-400">{order.date}</td>
                                <td className="p-4 text-slate-300 font-mono">${order.total.toFixed(2)}</td>
                                <td className="p-4"><span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{order.status}</span></td>
                                <td className="p-4 text-right"><button onClick={() => setViewingOrder(order)} className="p-2 text-slate-400 hover:text-white rounded-md focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white"><MoreVerticalIcon size={16} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} title={`Order Details: ${viewingOrder?.id}`}>
                {viewingOrder && <div className="space-y-6">
                    <div><h4 className="text-xs text-slate-500 font-bold uppercase mb-1">Customer</h4><p className="text-white">{viewingOrder.customerName}</p></div>
                    <div><h4 className="text-xs text-slate-500 font-bold uppercase mb-1">Shipping Address</h4><p className="text-white">{viewingOrder.shippingAddress}</p></div>
                    <div><h4 className="text-xs text-slate-500 font-bold uppercase mb-2">Items</h4>
                        <div className="space-y-2">{viewingOrder.items.map(item => (<div key={item.productId} className="flex justify-between p-2 bg-slate-800/50 rounded-lg"><span className="text-slate-300">{item.name} (x{item.quantity})</span></div>))}</div>
                    </div>
                    <div><h4 className="text-xs text-slate-500 font-bold uppercase mb-2">Update Status</h4>
                        <div className="flex gap-2">{(['Processing', 'Shipped', 'Delivered', 'Cancelled'] as Order['status'][]).map(status => (<button key={status} onClick={() => handleStatusChange(status)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${viewingOrder.status === status ? 'bg-nexus-accent text-white border-nexus-accent' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}>{status}</button>))}</div>
                    </div>
                </div>}
            </Modal>
        </div>
    );
};

const SettingsPanel = () => {
    const [settings, setSettings] = useState({ maintenanceMode: false, emailNotifications: true, pushNotifications: false });
    const toggleSetting = (key: keyof typeof settings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
            <div className="space-y-6 bg-slate-800/50 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-white/5"><div><h4 className="font-medium text-white">Maintenance Mode</h4><p className="text-xs text-slate-500">Temporarily disable storefront for updates.</p></div><button onClick={() => toggleSetting('maintenanceMode')}>{settings.maintenanceMode ? <ToggleRightIcon size={32} className="text-nexus-accent"/> : <ToggleLeftIcon size={32} className="text-slate-600"/>}</button></div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-white/5"><div><h4 className="font-medium text-white">Email Notifications</h4><p className="text-xs text-slate-500">Receive alerts for new orders and user sign-ups.</p></div><button onClick={() => toggleSetting('emailNotifications')}>{settings.emailNotifications ? <ToggleRightIcon size={32} className="text-nexus-accent"/> : <ToggleLeftIcon size={32} className="text-slate-600"/>}</button></div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-white/5"><div><h4 className="font-medium text-white">Push Notifications</h4><p className="text-xs text-slate-500">Get real-time browser notifications.</p></div><button onClick={() => toggleSetting('pushNotifications')}>{settings.pushNotifications ? <ToggleRightIcon size={32} className="text-nexus-accent"/> : <ToggleLeftIcon size={32} className="text-slate-600"/>}</button></div>
                <div className="flex justify-end pt-4"><button className="px-6 py-2 bg-nexus-accent text-white font-bold text-sm rounded-lg hover:bg-nexus-accentHover transition-colors">Save Settings</button></div>
            </div>
        </div>
    );
}

// --- Main Admin Dashboard Component ---
interface AdminDashboardProps {
    user: User;
    products: Product[];
    users: User[];
    orders: Order[];
    onLogout: () => void;
    onAddProduct: (product: Omit<Product, 'id' | 'rating'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
    onUpdateUser: (user: User) => void;
    onDeleteUser: (userId: number) => void;
    onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activePanel, setActivePanel] = useState<AdminPanel>('overview');
    
    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
        { id: 'products', label: 'Products', icon: PackageIcon },
        { id: 'users', label: 'Users', icon: UsersIcon },
        { id: 'orders', label: 'Orders', icon: ShoppingCartIcon },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ];

    const renderPanel = () => {
        const panelProps = {
            overview: { products: props.products, users: props.users, orders: props.orders },
            products: { products: props.products, onAdd: props.onAddProduct, onUpdate: props.onUpdateProduct, onDelete: props.onDeleteProduct },
            users: { users: props.users, onUpdate: props.onUpdateUser, onDelete: props.onDeleteUser },
            orders: { orders: props.orders, onUpdateStatus: props.onUpdateOrderStatus },
            settings: {}
        };
        const panels = {
            overview: <OverviewPanel {...panelProps.overview} />,
            products: <ProductsPanel {...panelProps.products} />,
            users: <UsersPanel {...panelProps.users} />,
            orders: <OrdersPanel {...panelProps.orders} />,
            settings: <SettingsPanel />
        };
        // Adding a key ensures the component re-mounts and animations re-run on tab switch
        return <div key={activePanel} className="animate-in fade-in duration-300">{panels[activePanel] || null}</div>;
    };

    return (
        <div className="min-h-screen flex bg-slate-900 text-slate-200">
            <aside className="w-64 bg-slate-950/80 p-6 flex-col border-r border-white/5 hidden lg:flex">
                <div className="mb-12"><span className="font-display font-black text-2xl tracking-[0.15em] text-white uppercase italic">SAR<span className="text-nexus-accent">ADMIN</span></span></div>
                <nav className="flex-1 space-y-2">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => setActivePanel(item.id as AdminPanel)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activePanel === item.id ? 'bg-nexus-accent text-white shadow-lg shadow-nexus-accent/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                            <item.icon size={18} /> {item.label}
                        </button>
                    ))}
                </nav>
                <div className="mt-auto"><button onClick={props.onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"><LogOutIcon size={18} /> Sign Out</button></div>
            </aside>
            <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white capitalize">{activePanel}</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-slate-400 hidden md:block">Welcome, <span className="font-bold text-white">{props.user.name}</span></p>
                        <img src={props.user.avatar} alt="Admin" className="w-10 h-10 rounded-full border-2 border-nexus-accent" />
                    </div>
                </header>
                {renderPanel()}
            </main>
        </div>
    );
};

export default AdminDashboard;
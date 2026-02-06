
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, User as UserIcon, Building, Mail, MapPin, Phone, Shield, Save, Key, Briefcase, Camera } from 'lucide-react';

export default function Profile() {
  const { user, updateUser, farms } = useApp();
  
  // Local state for editing form
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    companyName: user?.companyName || '',
  });

  // Fixed property name from assignedFarmId to assignedFarmIds
  const assignedFarm = user?.role === 'STAFF' && user?.assignedFarmIds && user.assignedFarmIds.length > 0 
      ? farms.find(f => f.id === user.assignedFarmIds![0])?.name 
      : 'All Farms (Admin)';

  const handleSave = () => {
    updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        companyName: formData.companyName
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
       <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">User Profile</h1>
                <p className="text-slate-500">Manage your personal and company information</p>
            </div>
            {isEditing ? (
                 <div className="flex space-x-3">
                     <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                     >
                         Cancel
                     </button>
                     <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center shadow-sm"
                     >
                         <Save size={18} className="mr-2" /> Save Changes
                     </button>
                 </div>
            ) : (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                    Edit Profile
                </button>
            )}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-blue-500 to-primary-600"></div>
                    <div className="px-6 pb-6 text-center -mt-10 relative">
                        <div className="w-20 h-20 bg-white rounded-full p-1 mx-auto shadow-md">
                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-2xl border border-slate-200">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mt-3">{user?.name}</h2>
                        <p className="text-sm text-slate-500 mb-1">{user?.role}</p>
                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200 font-medium">
                            {user?.sector}
                        </span>
                        
                        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center space-y-3">
                             {user?.role === 'STAFF' && (
                                <div className="text-sm flex items-center text-slate-600">
                                    <Building size={16} className="mr-2 text-slate-400" />
                                    <span>Assigned: {assignedFarm}</span>
                                </div>
                             )}
                             <div className="text-sm flex items-center text-slate-600">
                                 <Briefcase size={16} className="mr-2 text-slate-400" />
                                 <span>{user?.businessType}</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Details Forms */}
            <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
                        <UserIcon size={20} className="mr-2 text-primary-600" /> Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input 
                                disabled={!isEditing}
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className={`w-full border rounded-lg px-3 py-2 outline-none ${isEditing ? 'border-slate-300 focus:ring-2 focus:ring-primary-500' : 'bg-slate-50 border-transparent text-slate-600'}`} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input 
                                disabled={!isEditing}
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className={`w-full border rounded-lg px-3 py-2 outline-none ${isEditing ? 'border-slate-300 focus:ring-2 focus:ring-primary-500' : 'bg-slate-50 border-transparent text-slate-600'}`} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <input 
                                disabled={!isEditing}
                                placeholder={isEditing ? "Enter phone" : "Not set"}
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className={`w-full border rounded-lg px-3 py-2 outline-none ${isEditing ? 'border-slate-300 focus:ring-2 focus:ring-primary-500' : 'bg-slate-50 border-transparent text-slate-600'}`} 
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Location / City</label>
                            <input 
                                disabled={!isEditing}
                                placeholder={isEditing ? "Enter location" : "Not set"}
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                                className={`w-full border rounded-lg px-3 py-2 outline-none ${isEditing ? 'border-slate-300 focus:ring-2 focus:ring-primary-500' : 'bg-slate-50 border-transparent text-slate-600'}`} 
                            />
                        </div>
                    </div>
                </div>

                {/* Company Information */}
                {user?.role === 'ADMIN' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
                            <Building size={20} className="mr-2 text-blue-600" /> Company Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                <input 
                                    disabled={!isEditing}
                                    value={formData.companyName}
                                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                                    className={`w-full border rounded-lg px-3 py-2 outline-none ${isEditing ? 'border-slate-300 focus:ring-2 focus:ring-primary-500' : 'bg-slate-50 border-transparent text-slate-600'}`} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Business Category</label>
                                <input 
                                    disabled
                                    value={user?.businessCategory || ''}
                                    className="w-full border bg-slate-50 border-transparent text-slate-500 rounded-lg px-3 py-2 cursor-not-allowed" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sector Type</label>
                                <input 
                                    disabled
                                    value={user?.sector || ''}
                                    className="w-full border bg-slate-50 border-transparent text-slate-500 rounded-lg px-3 py-2 cursor-not-allowed" 
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Account Security (Mock) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
                        <Shield size={20} className="mr-2 text-slate-600" /> Account Security
                    </h3>
                    <div className="flex items-center justify-between">
                         <div>
                             <p className="text-sm font-medium text-slate-800">Password</p>
                             <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                         </div>
                         <button className="text-primary-600 hover:text-primary-700 text-sm font-medium border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">
                             Change Password
                         </button>
                    </div>
                </div>
            </div>
       </div>
    </div>
  );
}

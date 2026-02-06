import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import { Plus, Search, MapPin, Mail, Phone, Briefcase } from 'lucide-react';

export default function Clients() {
  const { clients, addClient } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newClient, setNewClient] = useState<Partial<Client>>({
      type: 'BUYER',
      country: ''
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
      if (newClient.name && newClient.country && newClient.email) {
          addClient({
              ...newClient,
              id: Math.random().toString(),
              totalOrders: 0,
              totalValue: 0,
              joinedDate: new Date().toISOString()
          } as Client);
          setShowModal(false);
          setNewClient({ type: 'BUYER', country: '' });
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Clients & Buyers</h1>
            <p className="text-slate-500">Manage customer relationships and order history.</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-sm hover:bg-primary-700"
        >
            <Plus size={18} className="mr-2" /> Add Client
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <Search className="text-slate-400 mr-2" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or country..." 
            className="w-full outline-none text-slate-700"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No clients found. Add your first customer!</p>
              </div>
          ) : (
              filteredClients.map(client => (
                  <div key={client.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                  {client.name.charAt(0)}
                              </div>
                              <div>
                                  <h3 className="font-bold text-lg text-slate-800">{client.name}</h3>
                                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{client.type}</span>
                              </div>
                          </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600 mb-6">
                          <div className="flex items-center"><MapPin size={16} className="mr-2 text-slate-400" /> {client.country}</div>
                          <div className="flex items-center"><Mail size={16} className="mr-2 text-slate-400" /> {client.email}</div>
                          <div className="flex items-center"><Phone size={16} className="mr-2 text-slate-400" /> {client.phone}</div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-sm">
                           <div className="text-center">
                               <p className="text-slate-400 text-xs uppercase">Orders</p>
                               <p className="font-bold text-slate-800">{client.totalOrders}</p>
                           </div>
                           <div className="text-center">
                               <p className="text-slate-400 text-xs uppercase">Value</p>
                               <p className="font-bold text-emerald-600">${client.totalValue.toLocaleString()}</p>
                           </div>
                           <button className="text-primary-600 hover:text-primary-700 font-medium text-xs">View History</button>
                      </div>
                  </div>
              ))
          )}
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Client</h2>
                  <div className="space-y-4">
                      <input className="w-full border p-2 rounded" placeholder="Client / Company Name" onChange={e => setNewClient({...newClient, name: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4">
                          <select className="border p-2 rounded" onChange={e => setNewClient({...newClient, type: e.target.value as any})}>
                              <option value="BUYER">Buyer</option>
                              <option value="SUPPLIER">Supplier</option>
                          </select>
                          <input className="border p-2 rounded" placeholder="Country" onChange={e => setNewClient({...newClient, country: e.target.value})} />
                      </div>
                      <input className="w-full border p-2 rounded" placeholder="Email Address" onChange={e => setNewClient({...newClient, email: e.target.value})} />
                      <input className="w-full border p-2 rounded" placeholder="Phone Number" onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                      <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                      <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded font-bold">Add Client</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
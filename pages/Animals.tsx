import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Animal } from '../types';
import { Plus, Cat, HeartPulse, MapPin } from 'lucide-react';

export default function Animals() {
  const { animals, addAnimal, user } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newAnimal, setNewAnimal] = useState<Partial<Animal>>({ status: 'HEALTHY' });

  const handleAdd = () => {
    if (newAnimal.type && newAnimal.quantity) {
        addAnimal({
            ...newAnimal,
            id: Math.random().toString(),
            location: newAnimal.location || 'Main Barn'
        } as Animal);
        setShowModal(false);
        setNewAnimal({ status: 'HEALTHY' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Livestock Management</h1>
            <p className="text-slate-500">Track animal health, breeding, and stock.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-sm hover:bg-primary-700">
            <Plus size={18} className="mr-2" /> Add Animals
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {animals.length === 0 ? (
             <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                 <Cat size={48} className="mx-auto text-slate-300 mb-4" />
                 <p className="text-slate-500">No animals registered yet.</p>
             </div>
         ) : (
             animals.map(animal => (
                 <div key={animal.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                 <Cat size={20} />
                             </div>
                             <div>
                                 <h3 className="font-bold text-lg text-slate-800">{animal.type}</h3>
                                 <p className="text-xs text-slate-500">{animal.breed}</p>
                             </div>
                         </div>
                         <span className={`px-2 py-1 rounded text-xs font-bold ${
                             animal.status === 'HEALTHY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                         }`}>
                             {animal.status}
                         </span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-slate-100">
                         <div>
                             <p className="text-slate-400 text-xs">Quantity</p>
                             <p className="font-semibold text-xl">{animal.quantity}</p>
                         </div>
                         <div>
                             <p className="text-slate-400 text-xs">Location</p>
                             <p className="font-semibold">{animal.location}</p>
                         </div>
                     </div>
                     {animal.notes && <p className="mt-3 text-xs text-slate-500 italic bg-slate-50 p-2 rounded">{animal.notes}</p>}
                 </div>
             ))
         )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Register New Animals</h3>
                <div className="space-y-3">
                    <input className="w-full border p-2 rounded" placeholder="Type (e.g. Cow)" onChange={e => setNewAnimal({...newAnimal, type: e.target.value})} />
                    <input className="w-full border p-2 rounded" placeholder="Breed (e.g. Holstein)" onChange={e => setNewAnimal({...newAnimal, breed: e.target.value})} />
                    <input type="number" className="w-full border p-2 rounded" placeholder="Quantity" onChange={e => setNewAnimal({...newAnimal, quantity: parseInt(e.target.value)})} />
                    <select className="w-full border p-2 rounded" onChange={e => setNewAnimal({...newAnimal, status: e.target.value as any})}>
                        <option value="HEALTHY">Healthy</option>
                        <option value="SICK">Sick</option>
                        <option value="QUARANTINE">Quarantine</option>
                    </select>
                    <input className="w-full border p-2 rounded" placeholder="Location/Barn" onChange={e => setNewAnimal({...newAnimal, location: e.target.value})} />
                    <textarea className="w-full border p-2 rounded" placeholder="Notes" onChange={e => setNewAnimal({...newAnimal, notes: e.target.value})} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                    <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded font-bold">Register</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
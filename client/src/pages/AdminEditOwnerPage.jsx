
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';

const AdminEditOwnerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ownerResponse = await axiosInstance.get('/admin/users');
        let foundOwner;
        if (ownerResponse.data.success) {
          foundOwner = ownerResponse.data.data.find(u => u._id === id);
          if (foundOwner) {
            setOwner(foundOwner);
            setFormData(foundOwner);
            console.log("Found owner data:", foundOwner);
            console.log("Owner photos:", foundOwner.photos);
          } else {
            toast.error('Owner not found.');
            navigate('/admin/pending-owners');
            return;
          }
        } else {
          toast.error('Failed to fetch users.');
          setLoading(false);
          return;
        }

        if (foundOwner.ownerStatus === 'approved') {
          const placesResponse = await axiosInstance.get(`/admin/owners/${id}/places`);
          if (placesResponse.data.success) {
            setPlaces(placesResponse.data.data);
          } else {
            toast.error('Failed to fetch places for this owner.');
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/admin/update-profile/${id}`, formData);
      if (response.data.success) {
        toast.success('Owner details updated successfully!');
        navigate('/admin/pending-owners');
      } else {
        toast.error(response.data.message || 'Failed to update owner details.');
      }
    } catch (error) {
      console.error('Error updating owner:', error);
      toast.error('Error updating owner details.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading owner details...</div>;
  }

  if (!owner) {
    return <div className="text-center py-4">Owner not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Owner Details</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Company Name</label>
            <input type="text" name="companyName" value={formData.companyName || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Website</label>
            <input type="text" name="website" value={formData.website || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Country</label>
            <input type="text" name="country" value={formData.country || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">City</label>
            <input type="text" name="city" value={formData.city || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Postal Code</label>
            <input type="text" name="postalCode" value={formData.postalCode || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Accommodation Type</label>
            <input type="text" name="accommodationType" value={formData.accommodationType || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Number of Properties</label>
            <input type="number" name="numberOfProperties" value={formData.numberOfProperties || 0} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">SIRET</label>
            <input type="text" name="siret" value={formData.siret || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 mt-6">
          <h2 className="text-2xl font-bold mb-4">Submitted Photos</h2>
          {formData.photos && formData.photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.photos.map((photo, index) => (
                <div key={index} className="bg-gray-100 shadow-md rounded-lg p-4">
                  <img src={photo} alt={`Submitted photo ${index + 1}`} className="w-full h-auto rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <p>No photos submitted.</p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 mt-6">
          <h2 className="text-2xl font-bold mb-4">Approved Properties</h2>
          {places.length === 0 ? (
            owner.ownerStatus === 'approved' ? <p>This owner has no approved properties yet.</p> : <p>This owner is not yet approved.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map(place => (
                <div key={place._id} className="bg-gray-100 shadow-md rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">{place.title}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {place.photos.map((photo, index) => (
                      <img key={index} src={photo} alt={`Place photo ${index}`} className="w-full h-auto rounded-md" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/admin/pending-owners')} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditOwnerPage;

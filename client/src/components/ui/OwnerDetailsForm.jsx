import React, { useState } from 'react';
import { useAuth } from '../../../hooks';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';

const OwnerDetailsForm = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    phoneNumber: user.phoneNumber || '',
    companyName: user.companyName || '',
    website: user.website || '',
    country: user.country || '',
    city: user.city || '',
    address: user.address || '',
    postalCode: user.postalCode || '',
    accommodationType: user.accommodationType || '',
    numberOfProperties: user.numberOfProperties || 1,
    howDidYouHear: user.howDidYouHear || '',
    siret: user.siret || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put('/user/owner-details', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while updating your details.');
      console.error(error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Owner Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required />
        <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Website" />
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" required />
        <input type="text" name="accommodationType" value={formData.accommodationType} onChange={handleChange} placeholder="Accommodation Type" required />
        <input type="number" name="numberOfProperties" value={formData.numberOfProperties} onChange={handleChange} placeholder="Number of Properties" required />
        <input type="text" name="howDidYouHear" value={formData.howDidYouHear} onChange={handleChange} placeholder="How did you hear about us?" required />
        <input type="text" name="siret" value={formData.siret} onChange={handleChange} placeholder="Siret" required />
        <button type="submit" className="primary">Save Details</button>
      </form>
    </div>
  );
};

export default OwnerDetailsForm;
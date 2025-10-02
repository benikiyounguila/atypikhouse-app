import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';

const AdminPendingOwners = () => {
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  const fetchPendingOwners = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/owners/pending');
      if (response.data.success) {
        setPendingOwners(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to fetch pending owners.');
      }
    } catch (error) {
      console.error('Error fetching pending owners:', error);
      toast.error('Error fetching pending owners.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ownerId) => {
    try {
      const response = await axiosInstance.put(`/admin/owners/${ownerId}/approve`);
      if (response.data.success) {
        toast.success('Owner approved successfully!');
        fetchPendingOwners(); // Refresh the list
      } else {
        toast.error(response.data.message || 'Failed to approve owner.');
      }
    } catch (error) {
      console.error('Error approving owner:', error);
      toast.error('Error approving owner.');
    }
  };

  const handleReject = async (ownerId) => {
    try {
      const response = await axiosInstance.put(`/admin/owners/${ownerId}/reject`);
      if (response.data.success) {
        toast.success('Owner rejected successfully!');
        fetchPendingOwners(); // Refresh the list
      } else {
        toast.error(response.data.message || 'Failed to reject owner.');
      }
    } catch (error) {
      console.error('Error rejecting owner:', error);
      toast.error('Error rejecting owner.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading pending owners...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Pending Owner Applications</h1>
      {pendingOwners.length === 0 ? (
        <p>No pending owner applications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingOwners.map((owner) => (
            <div key={owner._id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{owner.firstName} {owner.lastName}</h2>
              <p className="text-gray-700">Email: {owner.email}</p>
              <p className="text-gray-700">Phone: {owner.phoneNumber}</p>
              <p className="text-gray-700">Company: {owner.companyName}</p>
              <p className="text-gray-700">Website: {owner.website}</p>
              <p className="text-gray-700">Country: {owner.country}</p>
              <p className="text-gray-700">City: {owner.city}</p>
              <p className="text-gray-700">Address: {owner.address}</p>
              <p className="text-gray-700">Postal Code: {owner.postalCode}</p>
              <p className="text-gray-700">Accommodation Type: {owner.accommodationType}</p>
              <p className="text-gray-700">Number of Properties: {owner.numberOfProperties}</p>
              <p className="text-gray-700">How did they hear: {owner.howDidYouHear}</p>
              <p className="text-gray-700">SIRET: {owner.siret}</p>
              {owner.photos && owner.photos.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Photos:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {owner.photos.map((photo, index) => (
                      <img key={index} src={photo} alt={`Owner photo ${index}`} className="w-full h-auto rounded-md" />
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 flex justify-end space-x-2">
                <Link to={`/admin/owners/${owner._id}/edit`}>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleApprove(owner._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(owner._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingOwners;
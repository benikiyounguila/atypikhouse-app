import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';

import AccountNav from '@/components/ui/AccountNav';
import { AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import PlacesPage from './PlacesPage';
import { useAuth } from '../../hooks';
import { LogOut, Mail, PenSquare, Text } from 'lucide-react';
import EditProfileDialog from '@/components/ui/EditProfileDialog';
import ProfilePictureUploader from '@/components/ui/ProfilePictureUploader';

const ProfilePage = () => {
  const auth = useAuth();
  const { user, logout } = auth;
  const [redirect, setRedirect] = useState(null);
  const [profile, setProfile] = useState(user);

  let { subpage } = useParams();
  if (!subpage) {
    subpage = 'profile';
  }

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      toast.success(response.message);
      setRedirect('/');
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        console.log('User object:', user);
        console.log('User ID:', user._id);
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/users/${user._id}`);
        if (response.status === 200) {
          toast.success('Profile deleted successfully.');
          await logout(); // Log out the user after successful deletion
          setRedirect('/');
        } else {
          toast.error('Failed to delete profile.');
        }
      } catch (error) {
        toast.error('Error deleting profile.');
        console.error(error);
      }
    }
  };

  const handlePictureChange = (newPictureUrlOrUser) => {
    // Si on reçoit un objet user, on l'utilise, sinon on construit l'objet
    let newUser = newPictureUrlOrUser;
    if (typeof newPictureUrlOrUser === 'string') {
      newUser = { ...profile, picture: newPictureUrlOrUser };
    }
    setProfile(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    toast.success('Photo de profil mise à jour !');
  };

  if (!user && !redirect) {
    return <Navigate to={'/login'} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-xl rounded-2xl bg-white/90 p-8 shadow-xl flex flex-col items-center gap-8">
        {/* Avatar */}
        <div className="flex h-32 w-32 items-center justify-center shadow-md mb-4">
          <ProfilePictureUploader user={profile} onChange={handlePictureChange} />
        </div>
        {/* Infos utilisateur */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Text height="18" width="18" />
            <span>Nom :</span>
            <span className="text-gray-600 font-normal">{profile.firstName} {profile.lastName}</span>
          </div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Mail height="18" width="18" />
            <span>Email :</span>
            <span className="text-gray-600 font-normal">{profile.email}</span>
          </div>
        </div>
        {/* Boutons d'action */}
        <div className="flex w-full flex-col gap-4 mt-4">
          <Link to="/account/bookings" className="w-full">
            <Button variant="outline" className="w-full">
              Mes réservations
            </Button>
          </Link>
          <EditProfileDialog />
          <Button variant="destructive" onClick={handleDeleteProfile} className="w-full">
            Supprimer le profil
          </Button>
          <Button variant="secondary" onClick={handleLogout} className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;

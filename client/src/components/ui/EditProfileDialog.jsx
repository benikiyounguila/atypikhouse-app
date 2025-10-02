import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Loader2, PenSquare, Upload } from 'lucide-react';
import { useAuth } from '../../../hooks';

const EditProfileDialog = () => {
  const { user, setUser } = useAuth();
  const uploadRef = useRef(null);
  const [picture, setPicture] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    confirm_password: '',
  });

  const handleImageClick = () => {
    uploadRef.current.click();
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
  };

  const handleUserData = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const { name, email, password, confirm_password } = userData;

    // Validation
    if (name.trim() === '') {
      setLoading(false);
      return toast.error("Name Can't be empty");
    } else if (email.trim() === '') {
      setLoading(false);
      return toast.error("Email can't be empty");
    } else if (password !== confirm_password) {
      setLoading(false);
      return toast.error("Passwords don't match");
    }

    try {
      let pictureUrl = '';
      if (picture) {
        // upload picture and save the image url
        const formData = new FormData();
        formData.append('picture', picture);
        const { data } = await axiosInstance.post('/user/upload-picture', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        pictureUrl = data.url;
      }

      // PATCH /user/me
      const patchData = { name, email };
      if (password) patchData.password = password;
      if (pictureUrl) patchData.picture = pictureUrl;
      const res = await axiosInstance.patch('/user/me', patchData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setLoading(false);
        return toast.success('Updated successfully!');
      }
      setLoading(false);
    } catch (error) {
      console.error('[EDIT PROFILE] Error details:', error);
      console.error('[EDIT PROFILE] Error response:', error.response?.data);
      console.error('[EDIT PROFILE] Error status:', error.response?.status);
      
      // Afficher le message d'erreur spécifique du serveur si disponible
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong!';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-600 ">
          <PenSquare className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex justify-center">
          <div className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full bg-gray-200">
            <div
              className="absolute flex h-full w-full items-center justify-center bg-gray-200 hover:z-10"
              onClick={handleImageClick}
            >
              <input
                type="file"
                className="hidden"
                ref={uploadRef}
                onChange={handlePictureChange}
              />
              <Upload height={50} width={50} color="#4e4646" />
            </div>
            {/* Display user avatar based on picture state */}
            {picture ? (
              <Avatar className="transition-all ease-in-out hover:z-0 hover:hidden ">
                <AvatarImage src={URL.createObjectURL(picture)} />
              </Avatar>
            ) : (
              <Avatar className="transition-all ease-in-out hover:z-0 hover:hidden ">
                <AvatarImage src={user.picture} />
              </Avatar>
            )}
          </div>
        </div>
        {/* Update form */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={userData.name}
              className="col-span-3"
              onChange={handleUserData}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={userData.email}
              className="col-span-3"
              type="email"
              onChange={handleUserData}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              New Password
            </Label>
            <Input
              id="password"
              name="password"
              value={userData.password}
              className="col-span-3"
              type="password"
              onChange={handleUserData}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm_Password" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              value={userData.confirm_password}
              className="col-span-3"
              type="password"
              onChange={handleUserData}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            type="submit"
            className="w-full"
            onClick={handleSaveChanges}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;

import React, { useRef, useState } from "react";
import axiosInstance from "@/utils/axios";

const ProfilePictureUploader = ({ user, onChange }) => {
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    const formData = new FormData();
    formData.append("picture", file);
    try {
      const { data } = await axiosInstance.post("/user/upload-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.user);
    } catch (err) {
      alert("Erreur lors de l'upload de la photo");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={preview || user.picture || "/default-avatar.png"}
        alt="Profil"
        className="w-24 h-24 rounded-full object-cover border"
      />
      <button
        type="button"
        className="bg-blue-600 text-white px-3 py-1 rounded"
        onClick={() => fileInputRef.current.click()}
        disabled={loading}
      >
        {loading ? "Chargement..." : "Changer la photo"}
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePictureUploader; 
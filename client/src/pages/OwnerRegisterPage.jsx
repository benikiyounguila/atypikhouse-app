import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';
import PhotosUploader from '../components/ui/PhotosUploader'; // Assuming this is the correct path

const OwnerRegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    companyName: '',
    website: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    accommodationType: '',
    numberOfProperties: 1,
    howDidYouHear: '',
    siret: '',
  });
  
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFormData = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleFileChange = (e) => {
    
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    // ...

    console.log("formData:", formData);
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    
    addedPhotos.forEach(photo => {
      data.append('photos', photo);
    });


    try {
      const response = await axiosInstance.post('/user/register-owner', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setRedirect(true);
      } else {
        toast.error(response.data.message || "Erreur lors de l'inscription du propriétaire.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'inscription du propriétaire.");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0 flex-grow mt-40">
      <div className="mb-40">
        <h1 id="owner-register-title" className="mb-4 text-center text-4xl">PROPRIETAIRE - ATYPIKHOUSE</h1>
        <h3 id="owner-register-title" className="mb-4 text-center text-1xl">Complétez ce formulaire, un membre de notre équipe étudiera votre demande pour vérifier l'éligibilité de vos hébergements et reviendra vers vous dès que possible !<br/> Tous les champs ne sont pas obligatoires. Toutefois, un formulaire complet permet de vérifier l'éligibilité de votre offre et de préparer au mieux un éventuel rendez-vous téléphonique !</h3>
        

        <form className="mx-auto max-w-4xl" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input name="firstName" type="text" placeholder="Prénom" value={formData.firstName} onChange={handleFormData} disabled={loading} />
            <input name="lastName" type="text" placeholder="Nom" value={formData.lastName} onChange={handleFormData} disabled={loading} />
            <input name="email" type="email" placeholder="Adresse email" value={formData.email} onChange={handleFormData} disabled={loading} />
            <input name="password" type="password" placeholder="Mot de passe" value={formData.password} onChange={handleFormData} disabled={loading} />
            <input name="phoneNumber" type="text" placeholder="Numéro de téléphone" value={formData.phoneNumber} onChange={handleFormData} disabled={loading} />
            <input name="companyName" type="text" placeholder="Nom de l'entreprise" value={formData.companyName} onChange={handleFormData} disabled={loading} />
            <input name="website" type="text" placeholder="Site web (facultatif)" value={formData.website} onChange={handleFormData} disabled={loading} />
            <input name="country" type="text" placeholder="Pays" value={formData.country} onChange={handleFormData} disabled={loading} />
            <input name="city" type="text" placeholder="Ville" value={formData.city} onChange={handleFormData} disabled={loading} />
            <input name="address" type="text" placeholder="Adresse" value={formData.address} onChange={handleFormData} disabled={loading} />
            <input name="postalCode" type="text" placeholder="Code postal" value={formData.postalCode} onChange={handleFormData} disabled={loading} />
            <select name="accommodationType" value={formData.accommodationType} onChange={handleFormData} disabled={loading}>
              <option value="">Type de logement</option>
              <option value="Cabane">Cabane</option>
              <option value="Yourte">Yourte</option>
              <option value="Tipi">Tipi</option>
              <option value="Maison bulle">Maison bulle</option>
              <option value="Château">Château</option>
              <option value="Insolite">Insolite</option>
              <option value="Autre">Autre</option>
            </select>
            <input name="numberOfProperties" type="number" placeholder="Nombre de logements" value={formData.numberOfProperties} onChange={handleFormData} disabled={loading} />
            <select name="howDidYouHear" value={formData.howDidYouHear} onChange={handleFormData} disabled={loading}>
              <option value="">Comment nous avez-vous connus ?</option>
              <option value="Moteur de recherche">Moteur de recherche</option>
              <option value="Réseaux sociaux">Réseaux sociaux</option>
              <option value="Publicité en ligne">Publicité en ligne</option>
              <option value="Recommandation">Recommandation</option>
              <option value="Autre">Autre</option>
            </select>
            <input name="siret" type="text" placeholder="Numéro de SIRET" value={formData.siret} onChange={handleFormData} disabled={loading} />
          </div>
          
          

          

        

          <h2 className="mt-4 text-2xl">Photos du logement</h2>
          <PhotosUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} setIsUploading={setIsUploading} />

         <button className="primary my-2" disabled={loading || isUploading}>
           {loading ? 'Chargement...' : "Envoyer !"}
       </button>

        </form>

        <div className="py-2 text-center text-gray-500">
          Déjà inscrit ?{' '}
          <Link className="text-black underline" to="/login">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegisterPage;
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks';
import axiosInstance from '../utils/axios';

const PartnerForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (!key.includes('Photo')) {
          formData.append(key, data[key]);
        }
      });
      if (data.exteriorPhoto && data.exteriorPhoto[0]) {
        formData.append('exteriorPhoto', data.exteriorPhoto[0]);
      }
      if (data.interiorPhoto && data.interiorPhoto[0]) {
        formData.append('interiorPhoto', data.interiorPhoto[0]);
      }
      if (data.otherPhoto && data.otherPhoto[0]) {
        formData.append('otherPhoto', data.otherPhoto[0]);
      }

      const response = await axiosInstance.post('/user/partner/partner-form', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Demande envoyée avec succès !');
        localStorage.setItem('token', response.data.token);
        setRedirect(true);
      } else {
        toast.error(response.data.message || "Erreur lors de l'envoi du formulaire.");
      }
    } catch (error) {
      toast.error("Erreur inattendue lors de l'envoi du formulaire.");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0 flex-grow mt-40">
      <div className="mb-40 w-full max-w-2xl mx-auto">
        <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
          Devenir Partenaire
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                id="firstname"
                type="text"
                placeholder="Prénom"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstname ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('firstname', { required: 'Le prénom est requis' })}
                disabled={loading}
              />
              {errors.firstname && (
                <p className="mt-1 text-sm text-red-500">{errors.firstname.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                id="lastname"
                type="text"
                placeholder="Nom"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastname ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('lastname', { required: 'Le nom est requis' })}
                disabled={loading}
              />
              {errors.lastname && (
                <p className="mt-1 text-sm text-red-500">{errors.lastname.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('email', {
                required: "L'email est requis",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Email invalide',
                },
              })}
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Téléphone"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('phone', { required: 'Le téléphone est requis' })}
              disabled={loading}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Nom de l'entreprise <span className="text-red-500">*</span>
            </label>
            <input
              id="companyName"
              type="text"
              placeholder="Nom de l'entreprise"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.companyName ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('companyName', { required: "Le nom de l'entreprise est requis" })}
              disabled={loading}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-500">{errors.companyName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Ville <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              placeholder="Ville"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('city', { required: 'La ville est requise' })}
              disabled={loading}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Département <span className="text-red-500">*</span>
            </label>
            <input
              id="department"
              type="text"
              placeholder="Département"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.department ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('department', { required: 'Le département est requis' })}
              disabled={loading}
            />
            {errors.department && (
              <p className="mt-1 text-sm text-red-500">{errors.department.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="accommodationType" className="block text-sm font-medium text-gray-700">
              Type d'hébergement <span className="text-red-500">*</span>
            </label>
            <select
              id="accommodationType"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.accommodationType ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('accommodationType', { required: "Le type d'hébergement est requis" })}
              disabled={loading}
            >
              <option value="">Sélectionner un type</option>
              <option value="appartement">Appartement</option>
              <option value="maison">Maison</option>
              <option value="chalet">Chalet</option>
              <option value="autre">Autre</option>
            </select>
            {errors.accommodationType && (
              <p className="mt-1 text-sm text-red-500">{errors.accommodationType.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="otherAccommodationTypes" className="block text-sm font-medium text-gray-700">
              Autres types d'hébergement
            </label>
            <input
              id="otherAccommodationTypes"
              type="text"
              placeholder="Autres types (facultatif)"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              {...register('otherAccommodationTypes')}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="numberOfAccommodations" className="block text-sm font-medium text-gray-700">
              Nombre d'hébergements
            </label>
            <input
              id="numberOfAccommodations"
              type="number"
              placeholder="Nombre d'hébergements"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              {...register('numberOfAccommodations')}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Site web
            </label>
            <input
              id="website"
              type="url"
              placeholder="https://example.com"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              {...register('website')}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Description de votre entreprise"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              {...register('description')}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="exteriorPhoto" className="block text-sm font-medium text-gray-700">
              Photo extérieure
            </label>
            <input
              id="exteriorPhoto"
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md border-gray-300"
              {...register('exteriorPhoto')}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="interiorPhoto" className="block text-sm font-medium text-gray-700">
              Photo intérieure
            </label>
            <input
              id="interiorPhoto"
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md border-gray-300"
              {...register('interiorPhoto')}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="otherPhoto" className="block text-sm font-medium text-gray-700">
              Autre photo
            </label>
            <input
              id="otherPhoto"
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md border-gray-300"
              {...register('otherPhoto')}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Envoyer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerForm;
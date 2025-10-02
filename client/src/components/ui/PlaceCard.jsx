import React from 'react';
import { Link } from 'react-router-dom';

const PlaceCard = ({ place }) => {
  const { _id: placeId, photos, address, title, price } = place;
  const altText = `View of ${title} in ${address}`;

  return (
    <Link to={`/place/${placeId}`} className="block w-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        {photos?.[0] && (
          <div className="w-full h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
            <img
              src={`${photos[0]}`}
              alt={altText}
              title={altText}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-lg font-semibold  text-gray-800 truncate mb-2"><span>{title}</span></h2>
          <h3 className="text-sm text-gray-600 truncate mb-1">{address}</h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-green-700">{price}€</span>
            <span className="text-sm text-gray-500">par nuit</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
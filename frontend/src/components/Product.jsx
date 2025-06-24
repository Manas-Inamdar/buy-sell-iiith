import React from 'react';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Product = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);
    return (
        <Link className="block text-gray-700 dark:text-gray-100 cursor-pointer" to={`/product/${id}`}>
            <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative pt-[100%]">
                    <img 
                        className="absolute top-0 left-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300 ease-in-out" 
                        src={image} 
                        alt={name}
                    />
                </div>
            </div>
            <div className="mt-4">
                <p className="text-lg font-semibold truncate text-gray-900 dark:text-white">{name}</p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{currency}{price}</p>
            </div>
        </Link>
    );
};

export default Product;
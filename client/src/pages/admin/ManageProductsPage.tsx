import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | null;
    category: {
        name: string;
    };
}

export const ManageProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setError('Erreur lors du chargement des produits');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (window.confirm(`Confirmer la suppression de "${name}" ?`)) {
            try {
                const token = localStorage.getItem('authToken');
                await axios.delete(`${API_URL}/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Refresh the list
                fetchProducts();
            } catch (error) {
                console.error('Failed to delete product:', error);
                alert('Erreur lors de la suppression du produit');
            }
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement des produits...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                    {error}
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                    <div>
                        <h2 className="text-3xl font-serif text-gray-800">Gestion des Produits</h2>
                        <p className="text-sm text-gray-500 mt-1">{products.length} produit(s) total</p>
                    </div>
                    <Link
                        to="/admin/add-product"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-gold hover:bg-yellow-600 transition-colors"
                    >
                        <Plus size={18} className="mr-2" />
                        Ajouter un Produit
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow-xl text-center border border-gray-100">
                        <p className="text-gray-500 text-lg mb-4">Aucun produit dans la base de données</p>
                        <Link
                            to="/admin/add-product"
                            className="inline-flex items-center px-6 py-3 bg-gold text-black font-medium rounded-md hover:bg-yellow-600 transition-colors"
                        >
                            <Plus size={20} className="mr-2" />
                            Créer votre premier produit
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className={`bg-white rounded-lg shadow-lg overflow-hidden border flex flex-col ${
                                    product.stock === 0 ? 'border-red-200' : 'border-gray-200'
                                }`}
                            >
                                {/* Image */}
                                <div className="relative h-44">
                                    <img
                                        src={product.image || 'https://placehold.co/400x200/e5e7eb/6b7280?text=No+Image'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute top-2 left-2 bg-gold text-dark text-xs font-bold px-2 py-1 rounded">
                                        {product.category.name}
                                    </span>
                                    <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded ${
                                        product.stock > 10
                                            ? 'bg-green-100 text-green-800'
                                            : product.stock > 0
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                                    </span>
                                </div>

                                {/* Infos */}
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-serif text-base text-gray-800 font-semibold mb-1 leading-tight">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                                        {product.description}
                                    </p>
                                    <p className="text-gold font-bold text-lg mt-auto mb-4">
                                        {product.price.toFixed(2)} €
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/admin/products/edit/${product.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gold text-gold rounded-md hover:bg-gold hover:text-dark transition-colors text-sm font-medium"
                                        >
                                            <Edit size={15} />
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-400 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors text-sm font-medium"
                                        >
                                            <Trash2 size={15} />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
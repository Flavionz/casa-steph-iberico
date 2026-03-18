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
                    <div className="bg-white p-6 rounded-lg shadow-xl overflow-x-auto border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Catégorie
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Prix (€)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className={product.stock === 0 ? 'bg-red-50/50' : 'hover:bg-gray-50'}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={product.image || 'https://placehold.co/60x60/e5e7eb/6b7280?text=No+Image'}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-gray-500 text-xs truncate max-w-xs">
                                            {product.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                        {product.category.name}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                        {product.price.toFixed(2)} €
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.stock > 10
                                  ? 'bg-green-100 text-green-800'
                                  : product.stock > 0
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {product.stock > 0 ? product.stock : 'Rupture'}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link
                                            to={`/admin/products/edit/${product.id}`}
                                            className="inline-block text-gold hover:text-yellow-600 p-1 rounded-md hover:bg-yellow-50 transition-colors"
                                            aria-label={`Modifier ${product.name}`}
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                                            aria-label={`Supprimer ${product.name}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
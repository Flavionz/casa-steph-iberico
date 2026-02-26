import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Edit, Save, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

interface FeaturedProduct {
    id: number;
    title: string;
    category: string;
    image: string;
    position: number;
    isActive: boolean;
}

export const ManageFeaturedPage = () => {
    const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState({ title: '', category: '' });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const API_URL = 'http://localhost:3000/api';

    useEffect(() => {
        fetchFeatured();
    }, []);

    const fetchFeatured = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/featured`);
            setFeatured(response.data);
        } catch (error) {
            console.error('Failed to fetch featured products:', error);
            alert('Erreur lors du chargement');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item: FeaturedProduct) => {
        setEditingId(item.id);
        setEditData({ title: item.title, category: item.category });
        setPreviewUrl(item.image);
        setSelectedImage(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({ title: '', category: '' });
        setSelectedImage(null);
        setPreviewUrl('');
    };

    const handleSave = async (id: number, position: number) => {
        try {
            const formData = new FormData();
            formData.append('title', editData.title);
            formData.append('category', editData.category);
            formData.append('position', position.toString());

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const token = localStorage.getItem('authToken');
            await axios.put(`${API_URL}/featured/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('Produit vitrine modifié avec succès !');
            fetchFeatured();
            handleCancel();
        } catch (error) {
            console.error('Failed to update featured product:', error);
            alert('Erreur lors de la modification');
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles[0]) {
            const file = acceptedFiles[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
        maxFiles: 1,
        disabled: editingId === null,
    });

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                    <div>
                        <h2 className="text-3xl font-serif text-gray-800">Gestion de la Vitrine</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Gérez les 6 produits mis en avant sur la page d'accueil
                        </p>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <ImageIcon className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">Information</p>
                            <p>
                                Ces produits apparaissent dans la section "Nos Incontournables" de la page d'accueil.
                                Cliquez sur "Modifier" pour changer le titre, la catégorie ou l'image.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
                        >
                            <div className="relative h-48">
                <span className="absolute top-2 left-2 bg-gold text-dark text-xs font-bold px-2 py-1 rounded z-10">
                  Position {item.position}
                </span>
                                <img
                                    src={editingId === item.id ? previewUrl : item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4">
                                {editingId === item.id ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Titre
                                            </label>
                                            <input
                                                type="text"
                                                value={editData.title}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, title: e.target.value })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-gold focus:border-gold"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Catégorie
                                            </label>
                                            <input
                                                type="text"
                                                value={editData.category}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, category: e.target.value })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-gold focus:border-gold"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Changer l'image
                                            </label>
                                            <div
                                                {...getRootProps()}
                                                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                                    isDragActive
                                                        ? 'border-gold bg-yellow-50'
                                                        : 'border-gray-300 hover:border-gold hover:bg-gray-50'
                                                }`}
                                            >
                                                <input {...getInputProps()} />
                                                <p className="text-sm text-gray-600">
                                                    {selectedImage
                                                        ? 'Nouvelle image sélectionnée'
                                                        : 'Cliquez ou glissez une image'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 pt-2">
                                            <button
                                                onClick={() => handleSave(item.id, item.position)}
                                                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                <Save size={16} />
                                                <span>Sauvegarder</span>
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                            >
                                                <X size={16} />
                                                <span>Annuler</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="font-serif text-lg text-gray-800 mb-1">
                                            {item.title}
                                        </h3>
                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mb-3">
                      {item.category}
                    </span>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gold text-gold rounded-md hover:bg-gold hover:text-dark transition-colors"
                                        >
                                            <Edit size={16} />
                                            <span>Modifier</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};
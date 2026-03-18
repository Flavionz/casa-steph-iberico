import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { API_URL } from '../../config/api';

export const AddProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  });

  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      fetchProduct();
    }
  }, [id, isEditMode]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/products`);
      const product = response.data.find((p: any) => p.id === parseInt(id!));

      if (product) {
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          stock: product.stock.toString(),
          categoryId: product.categoryId.toString(),
        });

        if (product.image) {
          setPreviewUrl(product.image);
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      alert('Erreur lors du chargement du produit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('categoryId', formData.categoryId);

      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const token = localStorage.getItem('authToken');

      if (isEditMode) {
        await axios.put(`${API_URL}/products/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Produit modifié avec succès !');
      } else {
        await axios.post(`${API_URL}/products`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Produit ajouté avec succès !');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Erreur lors de la sauvegarde du produit');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
        <AdminLayout>
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du produit...</p>
          </div>
        </AdminLayout>
    );
  }

  return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-3xl font-serif text-gray-800">
              {isEditMode ? 'Modifier le Produit' : 'Ajouter un Produit'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="admin-form bg-white p-8 rounded-lg shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold"
                    placeholder="Ex: Jambon Ibérique"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€) *
                </label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold"
                    placeholder="Ex: 89.90"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock/Quantité
                </label>
                <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold"
                    placeholder="Ex: 10"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-gold"
                  placeholder="Description détaillée du produit..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image du produit (JPG, PNG)
              </label>
              <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                          ? 'border-gold bg-yellow-50'
                          : 'border-gray-300 hover:border-gold hover:bg-gray-50'
                  }`}
              >
                <input {...getInputProps()} />
                {previewUrl ? (
                    <div className="space-y-4">
                      <img
                          src={previewUrl}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-md"
                      />
                      <p className="text-sm text-gray-600">
                        Cliquez ou glissez une nouvelle image pour remplacer
                      </p>
                    </div>
                ) : (
                    <p className="text-gray-500">
                      Glissez-déposez l'image ou cliquez pour sélectionner
                    </p>
                )}
              </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gold text-black font-bold uppercase tracking-wider rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                  ? 'Publication en cours...'
                  : isEditMode
                      ? 'Modifier le Produit'
                      : 'Publier le Produit'}
            </button>
          </form>
        </div>
      </AdminLayout>
  );
};
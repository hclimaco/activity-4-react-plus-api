import React, { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar';
import './ProductsPage.css';
import './Modals.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        productImage: null
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState({
        name: '',
        price: '',
        productImage: ''
    });
    const [quantity, setQuantity] = useState(1); // State for quantity
    const [isAddingProduct, setIsAddingProduct] = useState(false); // State to track if adding a product

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        fetch('http://localhost:3000/products')
            .then(response => response.json())
            .then(data => {
                setProducts(data.products);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setErrorMessage('Failed to fetch products. Please try again later.');
            });
    };

    const openModal = (productId) => {
        setSelectedProductId(productId);
        setIsModalOpen(true);
        setIsAddingProduct(!productId); // Set isAddingProduct to true if productId is null
        if (productId) {
            fetch(`http://localhost:3000/products/${productId}`)
                .then(response => response.json())
                .then(data => {
                    setSelectedProduct(data.product);
                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                    setErrorMessage('Failed to fetch product. Please try again later.');
                });
        } else {
            setSelectedProduct({ name: '', price: '', productImage: '' });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewProduct({ // Reset newProduct state
            name: '',
            price: '',
            productImage: null
        });
        setSelectedProduct({ // Reset selectedProduct state
            name: '',
            price: '',
            productImage: ''
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewProduct({
            ...newProduct,
            [name]: value
        });
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setNewProduct({
            ...newProduct,
            productImage: file
        });
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('productImage', newProduct.productImage);

        fetch('http://localhost:3000/products/', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save product.');
                }
                return response.json();
            })
            .then(data => {
                setProducts([...products, data.createdProduct]); // Update products state with the newly created product
                closeModal();
            })
            .catch(error => {
                console.error('Error saving product:', error);
                setErrorMessage('Failed to save product. Please try again later.');
            });
    };

    const handleDelete = (productId) => {
        fetch(`http://localhost:3000/products/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete product.');
                }
                // Remove the deleted product from the state
                setProducts(products.filter(product => product._id !== productId));
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                setErrorMessage('Failed to delete product. Please try again later.');
            });
    };

    const handleUpdate = () => {
        // Prepare update data array
        const updateData = [];
        if (newProduct.name) {
            updateData.push({ propName: 'name', value: newProduct.name });
        }

        if (newProduct.price) {
            updateData.push({ propName: 'price', value: newProduct.price });
        }

        // Add productImage to update data if it exists
        if (newProduct.productImage) {
            updateData.push({ propName: 'productImage', value: newProduct.productImage });
        }
        console.log(updateData);

        if (updateData.length < 1) {
            console.error('No changes made');
            setErrorMessage('No changes made');
        } else {
            
            fetch(`http://localhost:3000/products/${selectedProductId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json' // Setting content type to JSON
            },
            body: JSON.stringify(updateData) // Convert updateData to JSON string
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update product.');
                }
                return response.json();
            })
            .then(data => {
                console.log("data", data)
                // Update the product in the state with the updated data
                const updatedProducts = products.map(product => {
                    if (product._id === selectedProductId) {
                        return data.updatedProduct;
                    }
                    return product;
                });
                setProducts(updatedProducts);
                closeModal();
            })
            .catch(error => {
                console.error('Error updating product:', error);
                setErrorMessage('Failed to update product. Please try again later.');
            });
        }

        
    };

    // Function to handle the "Add to Order" button click event
    const handleAddToOrder = () => {
        const data = {
            productId: selectedProductId,
            quantity: quantity
        };
    
        fetch('http://localhost:3000/orders/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json' // Setting content type to JSON
            },
            body: JSON.stringify(data) // Convert data to JSON string
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add product to order.');
            }
            // Close the modal
            closeModal();
            // Show success message
            window.alert('Product successfully added to order.');
        })
        .catch(error => {
            console.error('Error adding product to order:', error);
            setErrorMessage('Failed to add product to order. Please try again later.');
        });
    };

    return (
        <div className="products-page">
            <NavigationBar isLoggedIn={true} />
            <div className="products-container">
                <h2>Products</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button className="add-product-button" onClick={() => openModal(null)}>Add Product</button>
                <div className="card-container">
                    {products.map(product => (
                        <div key={product._id} className="card" onClick={() => openModal(product._id)}>
                            <img src={`http://localhost:3000/${product.productImage}`} alt={product.name} />
                            <div className="card-body">
                                <h3>{product.name}</h3>
                                <p>Price: ${product.price}</p>
                                <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{selectedProductId ? "Edit Product" : "Add Product"}</h2>
                        <label>Name:</label>
                        <input type="text" name="name" value={newProduct.name || selectedProduct.name} onChange={handleInputChange} />
                        <label>Price:</label>
                        <input type="text" name="price" value={newProduct.price || selectedProduct.price} onChange={handleInputChange} />
                        <label>Product Image:</label>
                        <input type="file" accept="image/*" onChange={handleFileInputChange} />
                        {selectedProduct.productImage && <p>Selected File: {selectedProduct.productImage}</p>}
                        {!isAddingProduct && (
                            <>
                                <label>Quantity:</label> {/* New quantity field */}
                                <input type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                            </>
                        )}
                        <button onClick={selectedProductId ? handleUpdate : handleSave}>{selectedProductId ? "Update" : "Save"}</button>
                        {selectedProductId && !isAddingProduct && <button onClick={handleAddToOrder}>Add to Order</button>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;

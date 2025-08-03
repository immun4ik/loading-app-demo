import React, { useState, useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner'; 
import './App.css'; 

const API_BASE_URL = 'http://localhost:5000/api/items'; 

function App() {
    const [items, setItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 

    const fetchItems = async () => {
        setLoading(true); 
        setError(null);  
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status }`);
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch items:", error);
            setError("Failed to load items. Please try again.");
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchItems();
    }, []); 

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        setLoading(true); 
        setError(null); 
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newItemName }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status }`);
            }

            const addedItem = await response.json();
            setItems((prevItems) => [...prevItems, addedItem]);
            setNewItemName(''); 
        } catch (error) {
            console.error("Failed to add item:", error);
            setError("Failed to add item. Please try again.");
        } finally {
            setLoading(false); 
        }
    };

    const handleDeleteItem = async (id) => {
        setLoading(true); 
        setError(null);   
        try {
            const response = await fetch(`${API_BASE_URL} / ${id }`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status }`);
            }

            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Failed to delete item:", error);
            setError("Failed to delete item. Please try again.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Item Manager with Loading Indicator</h1>
            </header>
            <main>
                <form onSubmit={handleAddItem} className="add-form">
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Add new item"
                        disabled={loading} 
                    />
                    <button type="submit" disabled={loading}>
                        Add Item
                    </button>
                </form>

                {/* Условное отображение спиннера загрузки */}
                {loading && <LoadingSpinner />}

                {/* Условное отображение ошибки */}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && (
                    <ul className="item-list">
                        {items.length > 0 ? (
                            items.map((item) => (
                                <li key={item.id}>
                                    {item.name}
                                    <button onClick={() => handleDeleteItem(item.id)} disabled={loading}>
                                        Delete
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>No items found. Add some!</p>
                        )}
                    </ul>
                )}
            </main>
        </div>
    );
}

export default App;

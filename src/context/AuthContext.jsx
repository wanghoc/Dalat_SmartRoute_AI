import { createContext, useContext, useState, useEffect } from 'react';

// =============================================================================
// Auth Context
// =============================================================================

const AuthContext = createContext(null);

// =============================================================================
// Auth Provider Component
// =============================================================================

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('dalat_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('dalat_user');
            }
        }
        setIsLoading(false);
    }, []);

    // Login function - accepts credentials and sets mock user
    const login = (email, password) => {
        // In a real app, this would validate against a backend
        const mockUser = {
            id: 1,
            name: 'Traveler',
            email: email || 'traveler@dalat.vibe',
            avatar: 'https://i.pravatar.cc/150?img=33'
        };

        setUser(mockUser);
        localStorage.setItem('dalat_user', JSON.stringify(mockUser));
        return mockUser;
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('dalat_user');
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// =============================================================================
// Custom Hook
// =============================================================================

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;

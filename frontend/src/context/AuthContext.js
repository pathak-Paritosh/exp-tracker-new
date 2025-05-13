const { createContext, useReducer, useEffect } = require("react");

export const AuthContext = createContext();

function authReducer(state, action) {
    switch(action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload }
        case 'LOGOUT':
            return { ...state, user: null }
        default:
            return state
    }
}

export function AuthContextProvider({ children }) {
    const [state, authDispatcher] = useReducer(authReducer, { user: null });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user) {
            authDispatcher({type: 'LOGIN', payload: user});
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, authDispatcher }}>
            { children }
        </AuthContext.Provider>
    )
}
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" />;
    }
    if (requiredRole && userRole !== requiredRole && userRole !== 'Administrador') {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requiredRole: PropTypes.string
};

export default ProtectedRoute;

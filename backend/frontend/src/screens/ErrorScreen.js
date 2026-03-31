import React from "react";
import { Link } from "react-router-dom";

function ErrorScreen() {
    return (
        <div>
            <h1>Oops! Page Not Found</h1>

            <div className="back_home_btn">
                <Link to="/">Go Back Home</Link>
            </div>
            
        </div>
    );
};

export default ErrorScreen;
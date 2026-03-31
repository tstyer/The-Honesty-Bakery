import React from "react";
import { Link } from "react-router-dom";

function ErrorScreen() {
    return (
        <div>
            <header className="error_title">
                <h1>(404) Page Not Found</h1>
            </header>

            <div className="back_home_btn">
                <Link to="/">Go Back Home</Link>
            </div>

            <div className="error_message_div">
                <p className="error_message_text">
                    Oops! Looks Like You're Lost! <br /> 
                    Click the <strong>Back Home</strong> button to head back. 
                </p>
            </div>
        </div>
    );
};

export default ErrorScreen;
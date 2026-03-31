import React from "react";
import { Link } from "react-router-dom";

function ErrorScreen() {
    return (
        <div>
            <h1>(404) Page Not Found</h1>

            <div className="back_home_btn">
                <Link to="/">Go Back Home</Link>
            </div>

            <div>
                <p>
                    Oops! Looks Like You're Lost! Click the <bold>Back Home</bold> button to head back. 
                </p>
            </div>
            
        </div>
    );
};

export default ErrorScreen;
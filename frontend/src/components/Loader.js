import React from "react";
import { spinner } from "react-bootstrap";

function Loader() {
    return (
        <spinner
        animation="border"
        role="status"
        style={{
            width: "100px",
            height: "100px",
            margin: "auto",
            display: "block",
        }}>
            <span className="sr-only">Loading...</span>
        </spinner>
    )
}
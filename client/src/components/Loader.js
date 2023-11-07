import React, { useState, CSSProperties } from 'react';
import FadeLoader from "react-spinners/FadeLoader";

function Loader() {
        let [loading, setLoading] = useState(true);
        let [color, setColor] = useState("#ffffff");
       
            return (
                <div style={{marginTop: '150px'}}>
                    <div className="sweet-loading d-flex justify-content-center align-items-center">
                        <FadeLoader color='#000' loading={loading} css="" size={100} />
                    </div>
                </div>
    );
}   


export default Loader;

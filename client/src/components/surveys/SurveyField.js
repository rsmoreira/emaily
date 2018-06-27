// Survey field contains logic to render single label and 
// text input
import React from 'react';

export default({ input, label, meta: {error, touched, active} }) => {
    return (
        <div>
            <label>{label}</label>
            <input {...input} style={{ marginBottom: '3px' }} />
            <div    className="red-text" 
                    style={{    marginBottom: '15px', 
                                fontStyle: 'italic', 
                                fontSize: '12px' }} >
                {touched && (!active && error)}
            </div>
        </div>
    );
};
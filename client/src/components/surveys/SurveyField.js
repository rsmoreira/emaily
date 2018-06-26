// Survey field contains logic to render single label and 
// text input
import React from 'react';

export default({ input }) => {
    return (
        <div>
            <input {...input} />
        </div>
    );
};
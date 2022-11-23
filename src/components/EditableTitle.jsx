import { useState } from 'react';

const EditableTitle = ({ currentTitle }) => {
    const [title, setTitle] = useState(currentTitle);
    const [editTitle, setEditTitle] = useState(false);

    return editTitle ? (
        <input
            className="border-0 w-12 bg-transparent outline-none focus:outline-none"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setEditTitle(false)}
            value={title}
        />
    ) : (
        <span onDoubleClick={() => setEditTitle(true)}>{title}</span>
    );
};

export default EditableTitle;

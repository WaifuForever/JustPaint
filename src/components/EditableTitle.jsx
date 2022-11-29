import { useState } from 'react';

const shortenString = (str) => {
    if (str.length < 12) return str;
    return str.substring(0, 8).concat('...');
};

const EditableTitle = ({ currentTitle }) => {
    const [title, setTitle] = useState(() => shortenString(currentTitle));
    const [editTitle, setEditTitle] = useState(false);

    return editTitle ? (
        <input
            className="border-0 w-12 bg-transparent outline-none focus:outline-none"
            type="text"
            onChange={(e) => setTitle(shortenString(e.target.value))}
            onBlur={() => setEditTitle(false)}
            value={title}
        />
    ) : (
        <span onDoubleClick={() => setEditTitle(true)}>{title}</span>
    );
};

export default EditableTitle;
